<template>
  <div style="margin: 20px">
    <div style="margin: 20px">
      <BaseTab
        :options="{
          tabs: { 'bg-color': 'deep-purple-darken-4', 'center-active': true },
          items: [{ text: 'Tab1' }, { text: 'Tab2' }],
        }"
      ></BaseTab>
    </div>
    <div style="margin: 20px">
      <BaseRadio
        v-model:value="value"
        :options="{
          radioGroup: {
            inline: true,
          },
          items: [
            { label: 'test1', value: 'y' },
            { label: 'test2', value: 'n' },
          ],
        }"
        class="test-radio"
      ></BaseRadio>
    </div>
    <div style="margin: 20px"></div>
    <BaseButton
      :options="{
        button: {
          text: 'button1',
        },
      }"
    ></BaseButton>
    <!-- <pre>{{ search }}</pre> -->
  </div>
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
import BaseTab from '@/components/base/BaseTab.vue';
import BaseRadio from '@/components/base/BaseRadio.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseGridSearch from '@/components/template/BaseGridSearch.vue';
import type { FilterField } from '@/components/template/composables/types/filterField';
import { computed, ref } from 'vue';
const search = ref<Record<string, string | null>>({});
const value = ref('');
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
