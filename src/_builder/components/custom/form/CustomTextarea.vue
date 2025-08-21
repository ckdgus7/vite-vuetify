<template>
  <v-textarea v-model="localModel" v-bind="{ ...props }" v-on="{ ...emits }"></v-textarea>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { type DataMap, useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';

const props = defineProps([
  'autofocus',
  'auto-grow',
  'clearable',
  'counter',
  'density',
  'details',
  'dirty',
  'disabled',
  'flat',
  'focused',
  'hide-details',
  'hide-spin-buttons',
  'hint',
  'id',
  'label',
  'max-rows',
  'max-width',
  'min-width',
  'name',
  'no-resize',
  'placeholder',
  'readonly',
  'rounded',
  'rows',
  'tile',
  'variant',
  'width',
  'exposeId',
  'dataMapSchema',
  'dataMapKey',
]);

const emits = defineEmits(['input']);
const localModel = ref('');

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

const setModel = (val: string) => {
  localModel.value = val;
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
