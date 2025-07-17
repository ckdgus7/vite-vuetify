<template>
  <div style="margin: 20px">
    <div>
      <BaseGridSearch v-model="search" :fieldList="fullFilters" :cols="3"></BaseGridSearch>
      <!-- <pre>{{ search }}</pre> -->
    </div>
  </div>
  <div style="margin: 20px">
    <div>
      <BaseGridSearch v-model="search" :fieldList="halfFilters" :cols="3"></BaseGridSearch>
      <!-- <pre>{{ search }}</pre> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseGridSearch from '@/components/base/BaseGridSearch.vue';
import type { FilterField } from '@/components/base/composables/types/filterField';
import { computed, ref } from 'vue';
const search = ref<Record<string, string | null>>({});
const fullFilters = ref<FilterField[]>([
  { key: 'name', label: '이름', type: 'text' },
  { key: 'email', label: '이메일', type: 'text' },
  { key: 'content', label: '내용', type: 'text' },
  {
    key: 'status',
    label: '상태',
    type: 'select',
    options: [
      { label: '활성', value: 'active' },
      { label: '비활성', value: 'inactive' },
    ],
  },
  { key: 'createdFrom', label: '생성일자(시작)', type: 'date' },
  { key: 'createdTo', label: '생성일자(종료)', type: 'date' },
  { key: 'createdFrom2', label: '생성일자(시작)', type: 'date' },
  { key: 'createdTo2', label: '생성일자(종료)', type: 'date' },
]);
const halfFilters = computed(() => {
  const returnFilter = fullFilters.value.filter((filter: FilterField) => filter.type === 'text');
  return returnFilter;
});
</script>

<style scoped></style>
