import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePositionStore = defineStore('position', () => {
  const pos = ref('static');

  function setPosition(value: any) {
    pos.value = value;
  }

  function getPosition() {
    return pos.value;
  }

  return {
    setPosition,
    getPosition,
  };
});
