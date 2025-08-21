<template>
  <v-dialog v-model="dialog" max-width="640">
    <v-card>
      <v-card-title>화면 저장</v-card-title>
      <v-card-text class="pt-2">
        <v-text-field v-model="pageId" label="화면 ID" />
        <v-text-field v-model="pageName" label="화면 이름" />
        <v-text-field v-model="routerPath" label="라우터 경로 (/page/home)" />

        <v-divider class="my-4" />

        <v-textarea
          v-model="onMountedScript"
          label="onMounted 실행 코드"
          hint="PageRenderer가 마운트될 때 실행됩니다. 컨텍스트는 ctx(router, route, axios, stores 등)를 제공합니다."
          persistent-hint
          auto-grow
          rows="8"
          prepend-inner-icon="mdi-script-text-outline"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="() => save()">저장</v-btn>
        <v-btn @click="() => (dialog = false)">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { savePage } from '@/_builder/composables/useIdbPage';

const dialog = ref(false);
const pageId = ref('');
const pageName = ref('');
const routerPath = ref('');

const onMountedScript = ref<string>('');

const builder = useBuilderStore();

// 다이얼로그가 처음 뜰 때 기본 예시 스니펫 주입
const DEFAULT_SNIPPET = `// 예시: 라우트 로그 및 API 호출
console.log('[onMounted] route:', ctx.route.fullPath)
// const res = await ctx.axios.get('/api/ping')
// console.log('ping:', res.data)
`;

onMounted(() => {
  if (!onMountedScript.value) onMountedScript.value = DEFAULT_SNIPPET;
});

const save = async () => {
  await savePage({
    id: pageId.value,
    name: pageName.value,
    routerPath: routerPath.value,
    schema: builder.saveSchema(),
    onMountedScript: onMountedScript.value, // <- 저장
  });
  dialog.value = false;
};

defineExpose({ dialog });
</script>
