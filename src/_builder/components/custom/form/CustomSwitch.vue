<template>
  <v-switch
    v-model="localModel"
    v-bind="{ ...props }"
    :label="getLabel"
    v-on="{ ...emits }"
  ></v-switch>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps([
  'density',
  'direction',
  'disabled',
  'true-value',
  'false-value',
  'flat',
  'focused',
  'hide-details',
  'hide-spin-buttons',
  'hint',
  'id',
  'label',
  'max-width',
  'min-width',
  'name',
  'width',
  'exposeId',
  // 'dataMapSchema',
  // 'dataMapKey',
]);

const emits = defineEmits(['click']);
const localModel = ref(false);

const getLabel = computed(() => {
  return localModel.value.toString();
});

const setModel = (val: boolean) => {
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
