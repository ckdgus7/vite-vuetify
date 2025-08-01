// stores/useComponentRegistry.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useComponentRegistryStore = defineStore('componentRegistry', () => {
  const components = ref<Record<string, unknown>>({});

  const register = (key: string, instance: unknown) => {
    console.log(key, instance);
    components.value[key] = instance;
  };

  const unregister = (key: string) => {
    delete components.value[key];
  };

  const get = <T>(key: string): T | undefined => {
    return components.value[key] as T | undefined;
  };

  return {
    components,
    register,
    unregister,
    get,
  };
});
