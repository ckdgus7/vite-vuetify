<template>
  <v-select v-model="selectedEvent" :items="availableEvents" label="이벤트" />
  <v-text-field v-model="handlerName" label="핸들러 이름" />
  <!-- <MonacoEditor v-model="handlerCode" height="200" language="javascript" /> -->
  <v-textarea v-model="handlerCode" height="200" />
  <v-btn @click="onPreview">미리보기</v-btn>
  <v-alert v-if="preview">{{ preview }}</v-alert>
  <v-btn color="primary" @click="onSave">저장</v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import MonacoEditor from 'monaco-editor-vue3';

const props = defineProps<{ element: any }>();
const emit = defineEmits(['update']);

const selectedEvent = ref('');
const handlerName = ref('');
const handlerCode = ref('');
const preview = ref('');
const availableEvents = ['click', 'input', 'submit'];

const onSave = () => {
  emit('update', {
    eventName: selectedEvent.value,
    handlerName: handlerName.value,
    code: handlerCode.value,
  });
};

const onPreview = () => {
  try {
    let out = '';
    const fakeConsole = { log: (...a: any[]) => (out += a.join(' ') + '\n') };
    const fn = new Function('event', 'context', handlerCode.value);
    fn({ type: selectedEvent.value }, { console: fakeConsole });
    preview.value = out || '✅ 실행됨';
  } catch (e: any) {
    preview.value = `오류: ${e.message}`;
  }
};
</script>
