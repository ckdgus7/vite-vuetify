<template>
  <v-combobox
    v-model="localModel"
    v-bind="{ ...props }"
    :items="localItems"
    v-on="{ ...emits }"
  ></v-combobox>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue';
import { type DataMap, useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';

const props = defineProps([
  'autofocus',
  'clearable',
  'density',
  'details',
  'direction',
  'disabled',
  'eager',
  'flat',
  'focused',
  'hide-details',
  'hide-no-data',
  'hide-selected',
  'hide-spin-buttons',
  'hint',
  'id',
  'items',
  'item-title',
  'item-value',
  'label',
  'max-width',
  'min-width',
  'multiple',
  'name',
  'no-auto-scroll',
  'no-data-text',
  'no-filter',
  'open-on-clear',
  'readonly',
  'rounded',
  'tile',
  // 'value',
  'variant',
  'width',
  'exposeId',
  'dataMapSchema',
  'dataMapKey',
]);

const emits = defineEmits(['change']);

const localModel = ref('');
const localItems = ref<any[]>([]);

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

const setModel = (val: string) => {
  localModel.value = val;
};
const getModel = () => {
  return localModel.value;
};
const setItems = (items: any[]) => {
  localItems.value = items;
};
const getExposeId = () => {
  return props.exposeId;
};
const getId = () => {
  return props.id;
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
  setItems,
  getExposeId,
  getId,
  // getDataMapSchema,
  // getDataMapKey,
});
</script>
