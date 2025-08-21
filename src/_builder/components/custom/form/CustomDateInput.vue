<template>
  <v-date-input v-model="localModel" v-bind="{ ...props }" v-on="{ ...emits }"></v-date-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { type DataMap, useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';

const props = defineProps([
  'allowed-dates',
  'allowed-months',
  'allowed-years',
  'autofocus',
  'border',
  'cancel-text',
  'clearable',
  'density',
  'details',
  'direction',
  'dirty',
  'disabled',
  'divided',
  'elevation',
  'flat',
  'focused',
  'height',
  'focused',
  'hide-actions',
  'hide-details',
  'hide-header',
  'hide-spin-buttons',
  'hide-weekdays',
  'hint',
  'id',
  'input-format',
  'label',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'month',
  'multiple',
  'name',
  'placeholder',
  'ok-text',
  'position',
  'readonly',
  'rounded',
  'show-week',
  'tile',
  'variant',
  'width',
  'view-mode',
  'weekday-format',
  'weeks-in-month',
  'year',
  'exposeId',
  'dataMapSchema',
  'dataMapKey',
]);

const emits = defineEmits(['input']);
const localModel = ref();

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

const setModel = (val: any) => {
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
