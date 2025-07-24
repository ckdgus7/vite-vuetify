<template>
  <div class="section-title">
    <div class="d-flex align-center mb-2">
      <v-icon v-if="icon" class="me-2" :icon="icon" :size="iconSize" />
      <span :class="[sizeClass, weightClass]">
        {{ title }}
      </span>
    </div>
    <v-divider v-if="divider" class="mb-4" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  icon?: string;
  iconSize?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'bold';
  divider?: boolean;
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-subtitle-2';
    case 'md':
      return 'text-subtitle-1';
    case 'lg':
      return 'text-h6';
    case 'xl':
      return 'text-h5';
    default:
      return 'text-subtitle-1';
  }
});

const weightClass = computed(() => {
  switch (props.weight) {
    case 'medium':
      return 'font-weight-medium';
    case 'bold':
      return 'font-weight-bold';
    default:
      return 'font-weight-regular';
  }
});
</script>

<style scoped>
.section-title {
  word-break: break-word;
}
</style>
