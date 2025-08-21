import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('login', () => {
  const userId = ref('');

  function login(loginId: string) {
    userId.value = loginId;
    console.log(loginId);
  }

  function logout() {
    userId.value = '';
  }

  return {
    login,
    logout,
  };
});
