<template>
  <v-data-table :items="getItems" v-bind="{ ...props }"></v-data-table>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps([
  'density',
  'fixed-footer',
  'fixed-header',
  'height',
  'hide-default-body',
  'hide-default-footer',
  'hide-default-header',
  'hide-no-data',
  'headers',
  'items-per-page',
  'loading',
  'sticky',
  'striped',
  'width',
]);
const getItems = computed(() => {
  return [
    {
      name: 'Fern',
      light: 'Low',
      height: '20cm',
      petFriendly: 'Yes',
      price: 20,
    },
    {
      name: 'Snake Plant',
      light: 'Low',
      height: '50cm',
      petFriendly: 'No',
      price: 35,
    },
  ];
});
</script>
