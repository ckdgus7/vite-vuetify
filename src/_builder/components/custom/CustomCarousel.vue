<template>
  <v-carousel hide-delimiters>
    <v-carousel-item v-for="(item, i) in getItems" :key="i" :src="item.src" cover></v-carousel-item>
  </v-carousel>
</template>
<script setup lang="ts">
import { computed } from 'vue';

interface Item {
  src: string;
  title?: string;
  subTitle?: string;
  contents?: string;
}
const props = defineProps<{
  items: Item[];
}>();

const getItems = computed(() => {
  let items: Item[] = [
    {
      src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
    },
  ];
  if (props.items && props.items.length) items = props.items;
  return items;
});
// const items = [
//   {
//     src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
//   },
//   {
//     src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
//   },
//   {
//     src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
//   },
//   {
//     src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
//   },
// ];
</script>
