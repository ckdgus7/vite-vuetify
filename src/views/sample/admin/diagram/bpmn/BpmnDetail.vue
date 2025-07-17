<template>
  <v-container>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card class="pa-6" max-width="960" mx="auto" elevation="2">
      <v-card-title>{{ form?.name }}</v-card-title>
      <v-card-subtitle class="mb-4">
        <v-chip
          v-for="tag in form?.tags"
          :key="tag"
          class="ma-1"
          color="primary"
          variant="outlined"
        >
          {{ tag }}
        </v-chip>
      </v-card-subtitle>

      <v-card-text class="mb-4">
        {{ form?.description }}
      </v-card-text>

      <div>
        <div class="text-subtitle-1 font-weight-medium mb-2">다이어그램 보기</div>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <div class="canvas" id="canvas" ref="canvas"></div>
      </div>

      <v-row class="d-flex align-center">
        <v-col cols="12" md="12">
          <v-btn
            type="button"
            color="primary"
            block
            class="mt-4"
            @click="() => router.push('/admin/diagram/bpmn')"
          >
            목록
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useTemplateDB, type TemplateModel } from '@/composables/sample/useBpmnDB';
import { useBpmnViewer } from '@/composables/sample/useBpmnViewer';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const loading = ref(true);

const { initViewer } = useBpmnViewer();
const form = ref<TemplateModel>({
  id,
  name: '',
  tags: [],
  description: '',
  xml: '',
});

const loadTemplate = async () => {
  const db = await useTemplateDB();
  const data = await db.get(id);
  if (data) {
    form.value = { ...data };
  }
};
onMounted(async () => {
  try {
    await loadTemplate();
    const viewerContainer = document.querySelector('.canvas') as HTMLElement;
    if (!viewerContainer) {
      throw new Error('다이어그램 컨테이너를 찾을 수 없습니다.');
    }
    if (form.value && viewerContainer) {
      await initViewer(viewerContainer, form.value.xml);
    }
  } catch (e) {
    console.error('상세 다이어그램 불러오기 실패:', e);
  } finally {
    loading.value = false;
  }
});

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
const page = ref({ title: 'BPMN Editor' });
const breadcrumbs = ref([
  {
    title: 'Diagram Editor',
    disabled: false,
    href: '#',
  },
  {
    title: 'BPMN',
    disabled: true,
    href: '#',
  },
]);
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 500px;
  border: 2px solid #1e88e5;
  border-radius: 8px;
  background-color: white;
}
</style>
