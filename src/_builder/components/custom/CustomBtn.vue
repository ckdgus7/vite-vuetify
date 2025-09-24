<template>
  <v-btn v-bind="{ ...props }" v-on="{ ...emits }">{{ props.text }}</v-btn>
</template>

<script setup lang="ts">
const props = defineProps([
  'id',
  'text',
  'color',
  'disabled',
  'density',
  'elevation',

  'exact',
  'flat',
  'height',

  'href',
  'max-height',
  'max-width',
  'min-height',
  'min-width',

  'readonly',
  'size',
  'slim',

  'tile',
  'to',
  'variant',
  'width',
]);
const emits = defineEmits(['click']);

const getId = () => {
  return props.id;
};
defineExpose({
  getId,
});
</script>
