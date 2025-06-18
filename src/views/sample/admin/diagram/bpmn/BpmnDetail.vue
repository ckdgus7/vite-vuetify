<template>
  <v-container>
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
        <v-responsive style="height: 600px; border: 1px solid #e0e0e0; border-radius: 12px">
          <iframe
            ref="drawioRef"
            :src="drawioViewerUrl"
            width="100%"
            height="100%"
            frameborder="0"
          />
        </v-responsive>
      </div>

      <v-row class="d-flex align-center">
        <v-col cols="12" md="12">
          <v-btn
            type="button"
            color="primary"
            block
            class="mt-4"
            @click="() => router.push('/admin/diagram/drawio')"
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const form = ref<TemplateModel>({
  id,
  name: '',
  tags: [],
  description: '',
  xml: '',
});
const drawioRef = ref<HTMLIFrameElement | null>(null);

const drawioViewerUrl =
  'https://embed.diagrams.net/?embed=1&proto=json&ui=min&readonly=1&fit=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1';

const sendXmlToViewer = () => {
  if (!drawioRef.value || !form.value) return;

  const message = {
    action: 'load',
    xml: form.value.xml,
  };

  drawioRef.value.contentWindow?.postMessage(JSON.stringify(message), '*');
};

const receiveDiagramXml = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);
    if (data.event === 'init') {
      sendXmlToViewer();
    }
  } catch {}
};

const loadTemplate = async () => {
  const db = await useTemplateDB();
  const data = await db.get(id);
  if (data) {
    form.value = { ...data };
  }
};
onMounted(async () => {
  window.addEventListener('message', receiveDiagramXml);
  loadTemplate();
});

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveDiagramXml);
});
</script>
