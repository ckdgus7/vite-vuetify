<template>
  <v-carousel hide-delimiters :style="props.style">
    <v-carousel-item
      v-for="(item, i) in props.items"
      :key="i"
      :src="item.src"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>
<script setup lang="ts">
interface Item {
  src: string;
  title?: string;
  subTitle?: string;
  contents?: string;
}
const props = defineProps<{
  items: Item[];
  style?: string;
}>();

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
