<template>
  <div :style="props.style"></div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  style?: Record<string, any>;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
