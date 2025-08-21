<template>
  <v-file-upload v-model="localModel" v-bind="{ ...props }" v-on="{ ...emits }"></v-file-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps([
  'clearable',
  'density',
  'details',
  'divider-tex',
  'elevation',
  'height',
  'hide-browse',
  'length',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'multiple',
  'name',
  'position',
  'rounded',
  'scrim',
  'show-size',
  'subtitle',
  'tile',
  'title',
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
// const getDataMapSchema = () => {
//   return props.dataMapSchema;
// };
// const getDataMapKey = () => {
//   return props.dataMapKey;
// };
defineExpose({
  getModel,
  getExposeId,
  // getDataMapSchema,
  // getDataMapKey,
});
</script>
