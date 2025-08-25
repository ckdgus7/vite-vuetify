<template>
  <v-alert variant="outlined" border="start" class="note-box">
    <template #title>
      <span class="text-primary font-weight-medium ml-3">
        <pre>{{ props.title }}</pre>
      </span>
    </template>

    <span>
      {{ props.messageBefore }}
      <a
        v-if="props.linkHref"
        :href="props.linkHref"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary text-decoration-underline"
      >
        {{ props.linkText }}
      </a>
      <template v-else>{{ props.linkText }}</template>
      {{ props.messageAfter }}
    </span>
  </v-alert>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  messageBefore?: string;
  linkText?: string;
  linkHref?: string;
  messageAfter?: string;
}

const props = defineProps<Props>();
</script>

<style scoped>
.note-box {
  border-left: 4px solid #7c4dff;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
}
</style>
