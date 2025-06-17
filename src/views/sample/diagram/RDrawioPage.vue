<template>
  <v-card class="pa-6" elevation="3" rounded="xl" max-width="1000" mx="auto">
    <v-form @submit.prevent="handleSubmit" ref="formRef" class="d-flex flex-column gap-5">
      <v-text-field
        v-model="title"
        label="제목2"
        required
        :rules="[(v) => !!v || '제목을 입력해주세요']"
        variant="outlined"
        color="primary"
        rounded="lg"
      />

      <v-select
        v-model="type"
        :items="typeOptions"
        label="유형"
        required
        :rules="[(v) => !!v || '유형을 선택해주세요']"
        variant="outlined"
        color="primary"
        rounded="lg"
      />

      <div>
        <div class="text-subtitle-1 font-weight-medium mb-2">템플릿 선택</div>
        <v-row>
          <v-col v-for="tpl in templates" :key="tpl.id" cols="12" sm="6" md="4">
            <v-card
              :elevation="selectedTemplate?.id === tpl.id ? 8 : 2"
              :color="selectedTemplate?.id === tpl.id ? 'primary' : ''"
              class="hoverable"
              @click="() => selectTemplate(tpl)"
            >
              <v-img :src="tpl.thumbnail" height="160" cover />
              <v-card-title class="text-white text-truncate">{{ tpl.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div>
        <div class="text-subtitle-1 font-weight-medium mb-2">다이어그램 편집기</div>
        <v-responsive
          style="height: 600px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden"
        >
          <iframe ref="drawioRef" :src="drawioUrl" width="100%" height="100%" frameborder="0" />
        </v-responsive>
      </div>

      <v-btn type="submit" color="primary" block size="large" rounded="lg" class="mt-4 text-white">
        제출
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const title = defineModel<string>('title');
const type = defineModel<string>('type');

const typeOptions = ['Task', 'Bug', 'Story', 'Epic'];

const formRef = ref();
const drawioRef = ref<HTMLIFrameElement | null>(null);
const selectedTemplate = ref<any>(null);

const drawioUrl = 'https://embed.diagrams.net/?embed=1&ui=min&proto=json';

// ✅ 운영자 등록 템플릿 목록 (실제 환경에선 API 연동도 가능)
const templates = [
  {
    id: 'flowchart',
    name: '기본 순서도',
    thumbnail: '/img/flowchart.png',
    xml: `<mxfile><diagram name="Flowchart">...</diagram></mxfile>`,
  },
  {
    id: 'network',
    name: '네트워크 구성도',
    thumbnail: '/img/network.png',
    xml: `<mxfile><diagram name="Network">...</diagram></mxfile>`,
  },
];

const selectTemplate = (tpl: any) => {
  selectedTemplate.value = tpl;
  sendTemplateToDrawio();
};

const sendTemplateToDrawio = () => {
  if (!drawioRef.value || !selectedTemplate.value) return;

  const message = {
    action: 'load',
    autosave: 1,
    xml: selectedTemplate.value.xml,
  };

  drawioRef.value.contentWindow?.postMessage(JSON.stringify(message), '*');
};

const handleDrawioMessages = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);
    if (data.event === 'init') {
      sendTemplateToDrawio();
    }
  } catch (err) {
    // 무시: draw.io 외 메시지 필터
  }
};

onMounted(() => {
  window.addEventListener('message', handleDrawioMessages);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleDrawioMessages);
});

const handleSubmit = () => {
  if (!formRef.value?.validate()) return;

  console.log('제목:', title.value);
  console.log('유형:', type.value);
  console.log('선택된 템플릿:', selectedTemplate.value?.name);
  // 다이어그램 데이터 저장은 draw.io → postMessage → export action 필요 (추후 구현)
};
</script>

<style scoped>
@media (max-width: 600px) {
  iframe {
    height: 400px !important;
  }
}
</style>
