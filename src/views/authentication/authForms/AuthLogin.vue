<template>
  <form @submit.prevent="loginForm" class="mt-7 loginForm">
    <v-text-field
      v-model="username"
      label="User ID"
      required
      density="comfortable"
      hide-details
      variant="outlined"
      color="primary"
    ></v-text-field>

    <v-btn
      color="secondary"
      block
      class="mt-2"
      variant="flat"
      size="large"
      :disabled="valid"
      type="submit"
    >
      로그인
    </v-btn>
  </form>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@/router';
import { saveUser } from '@/_builder/composables/useIdbUser';
import { useAuthStore } from '@/_builder/stores/useAuthStore';
const userStore = useAuthStore();
const valid = ref(false);
const username = ref('test');

const loginForm = async () => {
  if (!username.value) {
    alert('username을 입력해주세요.');
    return false;
  } else {
    await saveUser(username.value);
    await userStore.login(username.value);
    router.push('/ui-builder');
  }
};
</script>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>
