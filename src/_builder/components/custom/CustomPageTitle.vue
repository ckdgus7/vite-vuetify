<template>
  <v-row
    align="center"
    justify="space-between"
    class="pa-2"
    style="border-bottom: 1px solid #e0e0e0"
  >
    <!-- 좌측 타이틀 -->
    <v-col cols="12" md="6">
      <h1 :class="[sizeClass, weightClass]">
        {{ title }}
      </h1>
    </v-col>

    <!-- 우측 Breadcrumb -->
    <v-col cols="12" md="6" class="d-flex justify-end">
      <v-breadcrumbs :items="breadcrumbs" class="pa-0" divider="/">
        <template #item="{ item, index }">
          <v-breadcrumbs-item :key="index" :href="item.href" :disabled="item.disabled">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface BreadcrumbItem {
  title: string;
  href?: string;
  disabled?: boolean;
}

const props = defineProps<{
  title: string;
  breadcrumbs: BreadcrumbItem[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'bold';
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
      return 'text-h6';
  }
});

const weightClass = computed(() => {
  switch (props.weight) {
    case 'normal':
      return 'font-weight-regular';
    case 'medium':
      return 'font-weight-medium';
    case 'bold':
      return 'font-weight-bold';
    default:
      return 'font-weight-medium';
  }
});
</script>

<style scoped>
@media (max-width: 600px) {
  h1 {
    font-size: 1.25rem;
  }
}
</style>
