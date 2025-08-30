<!-- src/_builder/modules/files/panels/FileListPanel.vue -->
<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1">파일 리스트</span>
      <v-spacer />
      <v-text-field
        v-model="store.keyword"
        @update:model-value="() => store.fetch()"
        variant="outlined"
        density="comfortable"
        placeholder="파일명 검색"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        style="max-width: 280px"
      />
      <v-btn color="primary" class="ml-2" @click="() => emit('create')">등록</v-btn>
    </v-card-title>

    <v-data-table-virtual
      :items="store.filtered"
      :headers="headers"
      :loading="store.loading"
      item-key="id"
      fixed-header
      height="60vh"
      class="text-no-wrap"
    >
      <template #item.index="{ index }">{{ index + 1 }}</template>

      <template #item.url="{ item }">
        <FilePreviewPopover :url="item.url" :filename="item.name" />
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn size="small" variant="text" @click="() => emit('view', item.id)">상세</v-btn>
        <v-btn size="small" variant="text" @click="() => emit('edit', item.id)">수정</v-btn>
        <v-btn size="small" color="error" variant="text" @click="() => onRemove(item.id)">
          삭제
        </v-btn>
      </template>

      <template #no-data>
        <v-alert type="info" variant="tonal">데이터가 없습니다.</v-alert>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFileStore } from '@/_builder/stores/fileStore';
import FilePreviewPopover from '@/_builder/components/fileManager/FilePreviewPopover.vue';

const emit = defineEmits<{
  (e: 'create'): void;
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
}>();

const store = useFileStore();

const headers: any = ref([
  { title: '번호', key: 'index', width: 80, align: 'center' },
  { title: '파일ID', key: 'id', minWidth: 140 },
  { title: '파일명', key: 'name', minWidth: 220 },
  { title: '다운로드 URL', key: 'url', minWidth: 260 },
  { title: '등록일', key: 'createdAt', minWidth: 160, align: 'center' },
  { title: '작업', key: 'actions', width: 160, sortable: false, align: 'center' },
]);

const onRemove = async (id: string) => {
  await store.remove(id);
};

const formatDate = (ts: number) => new Date(ts).toLocaleString();

onMounted(() => {
  store.fetch();
});
</script>
