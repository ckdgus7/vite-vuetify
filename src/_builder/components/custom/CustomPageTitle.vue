<template>
  <v-row
    align="center"
    justify="space-between"
    class="pa-4"
    style="border-bottom: 1px solid #e0e0e0"
  >
    <!-- 좌측 타이틀 -->
    <v-col cols="12" md="6">
      <h1 class="text-h5 text-md-h4 font-weight-bold m-0">
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
import { defineProps } from 'vue';

interface BreadcrumbItem {
  title: string;
  href?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    title: string;
    breadcrumbs: BreadcrumbItem[];
  }>(),
  {
    title: 'Home',
    breadcrumbs: () => [
      {
        title: 'Home',
      },
      {
        title: 'Test',
      },
    ],
  }
);
</script>

<style scoped>
@media (max-width: 600px) {
  h1 {
    font-size: 1.25rem;
  }
}
</style>
