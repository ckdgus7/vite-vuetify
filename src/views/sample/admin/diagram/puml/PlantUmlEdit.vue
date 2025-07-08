<template>
  <v-container>
    <v-card class="pa-6" elevation="3" max-width="960" mx="auto">
      <v-form @submit.prevent="handleSubmit" ref="formRef" class="d-flex flex-column gap-5">
        <v-text-field
          v-model="form.name"
          label="템플릿 명"
          required
          variant="outlined"
          color="primary"
        />

        <v-combobox
          v-model="form.tags"
          label="태그"
          multiple
          chips
          clearable
          variant="outlined"
          color="primary"
        />

        <v-textarea
          v-model="form.description"
          label="상세 내용"
          rows="4"
          variant="outlined"
          color="primary"
        />

        <div>
          <div class="text-subtitle-1 font-weight-medium mb-2">다이어그램 편집기</div>
          <v-responsive style="height: 600px; border: 1px solid #ccc; border-radius: 12px">
            <iframe ref="drawioRef" :src="drawioUrl" width="100%" height="100%" frameborder="0" />
          </v-responsive>
        </div>

        <v-btn type="submit" color="primary" block class="mt-4">수정 저장</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useTemplateDB, type TemplateModel } from '@/composables/sample/useTemplateDB';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const formRef = ref();
const drawioRef = ref<HTMLIFrameElement | null>(null);
const drawioUrl =
  'https://embed.diagrams.net/?viewbox={"x":0,"y":0,"width":1000,"height":1000}&saveAndExit=0&noSaveBtn=1&noExitBtn=1&proto=json';

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

const sendXmlToDrawio = () => {
  if (!drawioRef.value || !form.value.xml) return;

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
      sendXmlToDrawio();
    } else if (data.event === 'save') {
      console.log('iframe save');
      form.value.xml = data.xml;
      saveTemplate();
    } else if (data.event === 'export') {
      console.log('iframe export');
      form.value.xml = data.xml;
      saveTemplate();
    }
  } catch {}
};

const handleSubmit = () => {
  if (!formRef.value?.validate()) return;
  drawioRef.value?.contentWindow?.postMessage(
    JSON.stringify({ action: 'export', format: 'xml', spin: 'Saving...' }),
    '*'
  );
};

const saveTemplate = async () => {
  const db = await useTemplateDB();
  await db.update(form.value);
  router.push('/admin/diagram/drawio');
};

onMounted(() => {
  window.addEventListener('message', receiveDiagramXml);
  loadTemplate();
});

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveDiagramXml);
});
</script>
