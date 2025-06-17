<template>
  <v-container>
    <v-card class="pa-6" elevation="3" max-width="900" mx="auto">
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
          <v-responsive style="height: 600px; border: 1px solid #e0e0e0; border-radius: 12px">
            <iframe ref="drawioRef" :src="drawioUrl" width="100%" height="100%" frameborder="0" />
          </v-responsive>
        </div>

        <v-row class="d-flex align-center">
          <v-col cols="12" md="6">
            <v-btn type="submit" color="primary" block class="mt-4">저장</v-btn>
          </v-col>
          <v-col cols="12" md="6">
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
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useTemplateDB, type TemplateModel } from '@/composables/sample/useTemplateDB';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref();

const form = ref<TemplateModel>({
  name: '',
  tags: [],
  description: '',
  xml: '',
});

const drawioRef = ref<HTMLIFrameElement | null>(null);
const drawioUrl =
  'https://embed.diagrams.net/?viewbox={"x":0,"y":0,"width":1000,"height":1000}&saveAndExit=0&noSaveBtn=1&noExitBtn=1&proto=json';
const xml = `<mxfile host="app.diagrams.net"><diagram name="Page-1"></diagram></mxfile>`;
const receiveDiagramXml = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);
    if (data.event === 'init') {
      console.log('iframe initialized');
      drawioRef.value?.contentWindow?.postMessage(JSON.stringify({ action: 'load', xml }), '*');
    } else if (data.event === 'save') {
      console.log('iframe save');
      form.value.xml = data.xml;
      // console.log(data.xml);
      saveTemplate();
    } else if (data.event === 'export') {
      console.log('iframe export');
      const xml = decodeURIComponent(data.xml);
      // console.log('[현재 XML 데이터]', xml);
      // 여기서 저장하거나 다른 처리 가능
      form.value.xml = data.xml;
      // console.log(data.xml);
      saveTemplate();
    }
  } catch {}
};
const saveTemplate = async () => {
  const db = await useTemplateDB();
  await db.add(form.value);
  router.push('/admin/diagram/drawio');
};

const handleSubmit = async () => {
  // console.log(await formRef.value?.validate());
  if (!(await formRef.value?.validate())) return;

  // if (!form.value.xml) {
  //   alert('다이어그램을 먼저 작성해주세요.');
  //   return;
  // }
  // draw.io에 저장 요청
  drawioRef.value?.contentWindow?.postMessage(
    JSON.stringify({ action: 'export', format: 'xml', spin: 'Updating…' }),
    '*'
  );
  // await exportXml();
};

onMounted(() => {
  window.addEventListener('message', receiveDiagramXml);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveDiagramXml);
});
</script>
