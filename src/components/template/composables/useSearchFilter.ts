// composables/useSearchFilter.ts
import { ref } from 'vue';
import type { FilterField } from './types/filterField';

export const useSearchFilter = (filters: FilterField[]) => {
  const initialModel = ref<Record<string, string | null>>({});
  filters.forEach((f) => {
    initialModel.value[f.key] = null;
  });

  const resetModel = () => {
    filters.forEach((f) => {
      initialModel.value[f.key] = null;
    });
  };

  return {
    filters,
    initialModel,
    resetModel,
  };
};
