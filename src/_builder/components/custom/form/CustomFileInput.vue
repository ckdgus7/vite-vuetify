<template>
  <v-file-input v-model="localModel" v-bind="{ ...props }" v-on="{ ...emits }"></v-file-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps([
  'clearable',
  'density',
  'details',
  'direction',
  'dirty',
  'disabled',
  'flat',
  'focused',
  'hide-details',
  'hide-spin-buttons',
  'hint',
  'id',
  'label',
  'max-width',
  'min-width',
  'multiple',
  'name',
  'readonly',
  'rounded',
  'tile',
  // 'value',
  'variant',
  'width',
  'exposeId',
  // 'dataMapSchema',
  // 'dataMapKey',
]);

const emits = defineEmits(['input']);
const localModel = ref();

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
  getModel,
  getExposeId,
  getId,
  // getDataMapSchema,
  // getDataMapKey,
});
</script>
