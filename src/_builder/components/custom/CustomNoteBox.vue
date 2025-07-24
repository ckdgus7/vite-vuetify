<template>
  <v-alert variant="outlined" border="start" class="note-box">
    <template #title>
      <span class="text-primary font-weight-medium ml-3">{{ title }}</span>
    </template>

    <span>
      {{ messageBefore }}
      <a
        :href="linkHref"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary text-decoration-underline"
      >
        {{ linkText }}
      </a>
      {{ messageAfter }}
    </span>
  </v-alert>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface Props {
  title?: string;
  messageBefore?: string;
  linkText?: string;
  linkHref?: string;
  messageAfter?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'Note',
  messageBefore: '',
  linkText: '',
  linkHref: '',
  messageAfter: '',
});
</script>

<style scoped>
.note-box {
  border-left: 4px solid #7c4dff;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
}
</style>
