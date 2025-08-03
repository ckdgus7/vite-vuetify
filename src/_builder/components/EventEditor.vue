<template>
  <v-card-title>Event</v-card-title>
  <v-divider class="mb-2" />
  <v-select
    v-model="selectedEvent"
    :items="availableEvents"
    label="이벤트"
    density="compact"
    hide-details
  />
  <v-text-field v-model="handlerName" label="핸들러 이름" hide-details dense />
  <!-- <MonacoEditor v-model="handlerCode" height="200" language="javascript" /> -->
  <v-textarea v-model="handlerCode" height="200" hide-details dense />
  <v-btn @click="onPreview">미리보기</v-btn>
  <v-alert v-if="preview">{{ preview }}</v-alert>
  <v-btn color="primary" @click="onSave">저장</v-btn>
</template>

<script setup lang="ts">
import {
  ref,
  watchEffect,
  reactive,
  watch,
  useTemplateRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  computed,
} from 'vue';
import axios from 'axios';
import store from '@/_builder/stores/index';
// import MonacoEditor from 'monaco-editor-vue3';

const props = defineProps<{ element: any }>();
const emit = defineEmits(['update']);

const selectedEvent = ref('');
const handlerName = ref('');
const handlerCode = ref('');
const preview = ref('');
const availableEvents = ['click', 'input', 'submit'];

const setEventRef = (eventName = '', funcName = '', code = '') => {
  selectedEvent.value = eventName ? eventName : '';
  handlerName.value = funcName ? funcName : '';
  handlerCode.value = code ? code : '';
};
watchEffect(() => {
  // console.log(props.element.events);
  if (props.element.events) {
    let changed = false;
    for (const [key, value] of Object.entries(props.element.events)) {
      const obj: any = value;
      const eventName: string = key;
      setEventRef(eventName, obj.handlerName, obj.code);
      changed = true;
    }
    if (!changed) setEventRef();
  } else {
    setEventRef();
  }
  preview.value = '';
});

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
    fn(
      { type: selectedEvent.value },
      {
        console: fakeConsole,
        ref,
        reactive,
        watch,
        props,
        emit,
        store,
        axios,
        useTemplateRef,
        onMounted,
        onBeforeMount,
        onBeforeUnmount,
        onUnmounted,
        computed,
      }
    );
    preview.value = out || '✅ 실행됨';
  } catch (e: any) {
    preview.value = `오류: ${e.message}`;
  }
};
</script>
