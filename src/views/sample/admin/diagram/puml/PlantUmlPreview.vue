<template>
  <v-card elevation="2">
    <v-card-title class="d-flex justify-space-between">
      <span>미리보기</span>
      <div>
        <v-btn size="small" @click="copyCode">Copy</v-btn>
        <v-btn size="small" @click="downloadImage">Download</v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="text-center" v-if="src">
        <img ref="imgEl" :src="src" alt="PlantUML preview" style="max-width: 100%" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { encodePlantUML } from '@/utils/plantUml/encode';
import { computed, ref } from 'vue';

const props = defineProps<{ code: string }>();
const imgEl = ref<HTMLImageElement | null>(null);

const src = computed(() => {
  console.log('PlantUmlPreview mounted with code:', encodePlantUML(props.code));
  return props.code?.trim()
    ? `https://www.plantuml.com/plantuml/svg/~1${encodePlantUML(props.code)}`
    : '';
});

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    alert('코드가 복사되었습니다.');
  } catch (err) {
    alert('복사 실패: 권한 거부 또는 브라우저 미지원');
  }
};

const downloadImage = () => {
  if (!imgEl.value) return;

  const link = document.createElement('a');
  link.href = imgEl.value.src;
  link.download = `plantuml-${Date.now()}.svg`;
  link.click();
};
</script>
