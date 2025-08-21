<template>
  <v-container :class="getContainerClass">
    <template v-for="item in localItems" :key="item.value">
      <v-checkbox
        v-model="localModel"
        :label="item.label"
        :value="item.value"
        v-bind="{ ...props }"
      ></v-checkbox>
    </template>
  </v-container>
</template>
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { type DataMap, useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';

const props = defineProps([
  'direction',
  'disabled',
  'density',
  'hide-details',
  'hint',
  'id',
  'items',
  'max-width',
  'min-width',
  'name',
  'readonly',
  'width',
  'exposeId',
  'dataMapSchema',
  'dataMapKey',
]);
interface checkboxItems {
  label: string;
  value: string;
}
const localModel = ref<string[]>([]);
const localItems = ref<checkboxItems[]>([]);

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

const getContainerClass = computed(() => {
  if (props.direction === 'horizontal') {
    return 'd-flex';
  }
  return '';
});

watchEffect(() => {
  if (props.items && props.items.length) localItems.value = [...props.items];
});
// watch(
//   () => props.items,
//   () => {
//     localItems.value = [...props.items];
//   },
//   {
//     deep: true,
//   }
// );
const setModel = (val: string) => {
  localModel.value = [val];
};
const getModel = () => {
  return localModel.value;
};
const getExposeId = () => {
  return props.exposeId;
};
const getId = () => {
  return props.id;
};
const getDataMapSchema = () => {
  return props.dataMapSchema;
};
const getDataMapKey = () => {
  return props.dataMapKey;
};
defineExpose({
  setModel,
  getModel,
  getExposeId,
  getId,
  getDataMapSchema,
  getDataMapKey,
});
</script>
