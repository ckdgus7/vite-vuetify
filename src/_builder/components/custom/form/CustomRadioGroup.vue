<template>
  <v-container>
    <v-radio-group v-model="localModel" v-bind="{ ...props }">
      <template v-for="item in localItems" :key="item.value">
        <v-radio :label="item.label" :value="item.value"></v-radio>
      </template>
    </v-radio-group>
  </v-container>
</template>
<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue';
import { type DataMap, useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';

interface radioGroupItems {
  label: string;
  value: string;
}
const props = defineProps([
  'density',
  'direction',
  'disabled',
  'hide-details',
  'hide-spin-buttons',
  'hint',
  'id',
  'inline',
  'items',
  'max-width',
  'min-width',
  'readonly',
  'width',
  'exposeId',
  'dataMapSchema',
  'dataMapKey',
]);

// const emits = defineEmits(['input']);
const localModel = ref<string | number>();
const localItems = ref<radioGroupItems[]>([]);

const dataStore = useDataCollectionStore();
const localdataMap = ref<DataMap>();
watch(
  () => props.dataMapSchema,
  (val: string) => {
    console.log(val);
    if (val) localdataMap.value = dataStore.getDataMap(val);
  },
  {
    deep: true,
  }
);
watch(
  () => props.dataMapKey,
  (val: string) => {
    console.log(val);
    if (val) {
      const mapKey = val.split(':')[1];
      const data = localdataMap.value?.datas[mapKey] ?? '';
      localModel.value = data;
    }
  },
  {
    deep: true,
  }
);

watchEffect(() => {
  if (props.items && props.items.length) localItems.value = [...props.items];
});
const setModel = (val: string | number) => {
  localModel.value = val;
};
const getModel = () => {
  return localModel.value;
};
const getId = () => {
  return props.id;
};
const getExposeId = () => {
  return props.exposeId;
};
// const getDataMapSchema = () => {
//   return props.dataMapSchema;
// };
// const getDataMapKey = () => {
//   return props.dataMapKey;
// };
defineExpose({
  setModel,
  getModel,
  getExposeId,
  getId,
  // getDataMapSchema,
  // getDataMapKey,
});
</script>
