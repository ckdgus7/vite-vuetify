<template>
  <div><v-skeleton-loader v-bind="props.options.skeleton"></v-skeleton-loader></div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
