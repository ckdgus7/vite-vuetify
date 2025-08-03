<template>
  <div :style="{ ...props }"></div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps([
  'width',
  'height',
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'padding',
  'backgroundColor',
  'exposeId',
]);

watch(
  () => props.height,
  (val: any) => {
    console.log(val);
  }
);
// { key: 'class', label: 'css class', type: 'text' },
// { key: 'width', label: 'width', type: 'text' },
// { key: 'height', label: 'height', type: 'text' },
// { key: 'display', label: 'Display', type: 'select', options: ['flex', 'grid', 'block'] },
// {
//   key: 'flexDirection',
//   label: 'Flex 방향',
//   type: 'select',
//   options: ['row', 'column', 'row-reverse', 'column-reverse'],
// },
// {
//   key: 'justifyContent',
//   label: '가로 정렬 (justify)',
//   type: 'select',
//   options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
// },
// {
//   key: 'alignItems',
//   label: '세로 정렬 (align)',
//   type: 'select',
//   options: ['flex-start', 'center', 'flex-end', 'stretch'],
// },
// { key: 'gap', label: '갭 (gap)', type: 'text' },
// { key: 'padding', label: '패딩 (padding)', type: 'text' },
// { key: 'backgroundColor', label: '배경색 (background color)', type: 'text' },
// { key: 'exposeId', label: 'exposeId', type: 'text' },
</script>
