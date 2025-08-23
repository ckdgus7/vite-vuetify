<template>
  <v-tabs v-bind="{ ...props }">
    <v-tab v-for="(item, i) in props.items" :key="i" v-bind="{ ...item }"></v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
// const props = defineProps<{
//   'align-tabs': string;
//   'bg-color': string;
//   'center-active': boolean;
//   'color': string;
//   density: string;
//   disabled: boolean;
//   height: string;
//   'selected-class': string;
//   'show-arrows': string | boolean;
//   'slider-color': string;
// }>();
const props = defineProps([
  'align-tabs',
  'bg-color',
  'center-active',
  'color',
  'density',
  'disabled',
  'height',
  'selected-class',
  'show-arrows',
  'slider-color',
  'items',
]);
</script>
