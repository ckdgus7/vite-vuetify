<!-- src/_builder/components/dialogs/FileManagerDialog.vue -->
<template>
  <v-dialog v-model="model" max-width="1200" :scrim="true" persistent>
    <v-card rounded="xl">
      <v-toolbar density="comfortable" flat>
        <v-toolbar-title class="text-subtitle-1">파일 관리</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="() => onClose()" />
      </v-toolbar>

      <v-divider />

      <v-window v-model="view">
        <!-- 리스트 -->
        <v-window-item value="list">
          <FileListPanel
            @create="() => goCreate()"
            @view="(id: string) => goDetail(id)"
            @edit="(id: string) => goEdit(id)"
          />
        </v-window-item>

        <!-- 상세보기 (읽기 전용) -->
        <v-window-item value="detail">
          <FileFormPanel
            :id="selectedId"
            :readonly="true"
            @back="() => goList()"
            @edit="(id) => goEdit(id)"
          />
        </v-window-item>

        <!-- 등록/수정 -->
        <v-window-item value="form">
          <FileFormPanel
            :id="selectedId"
            :readonly="false"
            @saved="() => goListAndRefresh()"
            @back="() => goList()"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FileListPanel from '@/_builder/components/fileManager/FileListPanel.vue';
import FileFormPanel from '@/_builder/components/fileManager/FileFormPanel.vue';

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>();

const model = ref(props.modelValue);
watch(
  () => props.modelValue,
  (v) => (model.value = v)
);
watch(model, (v) => emit('update:modelValue', v));

// 내부 이동 상태
const view = ref<'list' | 'detail' | 'form'>('list');
const selectedId = ref<string | null>(null);

const goList = () => {
  view.value = 'list';
  selectedId.value = null;
};
const goCreate = () => {
  view.value = 'form';
  selectedId.value = null;
};
const goDetail = (id: string) => {
  selectedId.value = id;
  view.value = 'detail';
};
const goEdit = (id: string) => {
  selectedId.value = id;
  view.value = 'form';
};
const goListAndRefresh = () => {
  goList(); /* 리스트 패널 내부 fetch 자동 반영 */
};

const onClose = () => {
  model.value = false;
};
</script>
