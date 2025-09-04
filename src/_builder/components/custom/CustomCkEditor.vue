<template>
  <div :style="props.style">
    <div>{{ abc }}</div>
    <BaseCkEditor></BaseCkEditor>
  </div>
</template>

<script setup lang="ts">
import BaseCkEditor from '@/components/base/BaseCkEditor.vue';
import { ref } from 'vue';
const props = defineProps(['style']);
const abc = ref(1);

defineExpose({ abc });
</script>

<style scoped></style>
