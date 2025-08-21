<template>
  <v-container class="py-6">
    <ElementWrapper v-for="el in pageElements" :key="el.id" :element="el" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import { getPageByPath } from '@/_builder/stores/usePageStore';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { runUserScript } from '@/_builder/utils/scriptRunner';

const router = useRouter();
const route = useRoute();
const builder = useBuilderStore();

const pageElements = ref<any[]>([]);

onMounted(async () => {
  const fullPath = route.fullPath; // 예: "/page/home"
  const page = await getPageByPath(fullPath);

  if (page) {
    // 1) 화면 요소 렌더링
    pageElements.value = JSON.parse(page.schema || '[]');

    // 2) onMountedScript 실행 (있을 경우)
    if (page.onMountedScript && page.onMountedScript.trim()) {
      try {
        await runUserScript(page.onMountedScript, {
          router,
          route,
          axios,
          stores: { builder },
        });
      } catch (err) {
        console.error('onMountedScript 실행 실패:', err);
      }
    }
  } else {
    console.warn('페이지 데이터 없음');
  }
});
</script>
