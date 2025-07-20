<template>
  <v-card flat class="pa-4">
    <v-form @submit.prevent="onSearch">
      <v-row dense>
        <template v-for="filter in filters" :key="filter.key">
          <v-col :cols="12" :md="props.cols">
            <!-- 텍스트 필드 -->
            <v-text-field
              v-if="filter.type === 'text'"
              v-model="model[filter.key]"
              :label="filter.label"
              variant="outlined"
              dense
              hide-details
              clearable
            />

            <!-- 셀렉트박스 -->
            <v-select
              v-else-if="filter.type === 'select'"
              v-model="model[filter.key]"
              :label="filter.label"
              :items="filter.options || []"
              item-title="label"
              item-value="value"
              variant="outlined"
              dense
              hide-details
              clearable
            />

            <!-- 날짜 선택기 -->
            <v-text-field
              v-else-if="filter.type === 'date'"
              v-model="model[filter.key]"
              :label="filter.label"
              type="date"
              variant="outlined"
              dense
              hide-details
              clearable
            />
          </v-col>
        </template>

        <!-- 버튼 영역 -->
        <v-col cols="12" md="12" class="d-flex justify-end align-center mt-2">
          <v-btn color="primary" class="mr-2" @click="onSearch">검색</v-btn>
          <v-btn color="secondary" @click="onReset">초기화</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useSearchFilter } from './composables/useSearchFilter';
import type { FilterField } from './composables/types/filterField';

const model = defineModel<Record<string, string | null>>({ default: {} });
interface Props {
  fieldList: FilterField[];
  cols: number;
}

const props = defineProps<Props>();

const { filters, initialModel, resetModel } = useSearchFilter(props.fieldList);

// 초기화 시 바인딩 모델에 초기값 반영
Object.assign(model.value, initialModel.value);

const onReset = () => {
  resetModel();
  Object.assign(model.value, initialModel.value);
};

const onSearch = () => {
  console.log('검색조건:', model.value);
};
</script>

<style scoped>
@media (max-width: 600px) {
  .v-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}
</style>
