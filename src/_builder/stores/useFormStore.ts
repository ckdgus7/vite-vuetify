import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStore = defineStore('form', () => {
  const formData = ref<Record<string, any>>({});

  function setValue(id: string, value: any) {
    formData.value[id] = value;
  }

  function getValue(id: string) {
    return formData.value[id] ?? '';
  }

  function resetForm() {
    formData.value = {};
  }

  return {
    formData,
    setValue,
    getValue,
    resetForm,
  };
});
