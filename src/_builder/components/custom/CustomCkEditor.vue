<template>
  <div style="margin: 20px">
    <div>{{ abc }}</div>
    <BaseCkEditor></BaseCkEditor>
  </div>
</template>

<script setup lang="ts">
import BaseCkEditor from '@/components/base/BaseCkEditor.vue';
import { ref } from 'vue';
const abc = ref(1);

defineExpose({ abc });
</script>

<style scoped></style>
