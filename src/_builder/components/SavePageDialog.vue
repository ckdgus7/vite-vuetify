<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>화면 저장</v-card-title>
      <v-card-text>
        <v-text-field v-model="pageId" label="화면 ID" />
        <v-text-field v-model="pageName" label="화면 이름" />
        <v-text-field v-model="routerPath" label="라우터 경로 (/page/home)" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="save">저장</v-btn>
        <v-btn @click="dialog = false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { savePage } from '@/_builder/composables/usePageStore';

const dialog = ref(false);
const pageId = ref('');
const pageName = ref('');
const routerPath = ref('');

const builder = useBuilderStore();

const save = async () => {
  await savePage({
    id: pageId.value,
    name: pageName.value,
    routerPath: routerPath.value,
    schema: builder.saveSchema(),
  });
  dialog.value = false;
};
defineExpose({ dialog });
</script>
