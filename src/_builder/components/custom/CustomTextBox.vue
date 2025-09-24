<template>
  <div :style="props.style">
    <span>
      {{ props.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  style?: Record<string, any>;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
