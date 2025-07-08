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

          <!-- <MonacoEditor
            v-model:value="form.xml"
            language="plaintext"
            theme="vs"
            :options="{
              colorDecorators: true,
              lineHeight: 24,
              tabSize: 2,
            }"
            :height="200"
            @change="updatePreview"
          /> -->
          <!-- 좌측: 에디터 -->
          <!-- 우측: 미리보기 -->
          <v-row>
            <v-col cols="12" md="6">
              <MonacoEditor
                v-model:value="form.xml"
                language="plaintext"
                theme="vs"
                :options="{
                  colorDecorators: true,
                  lineHeight: 24,
                  tabSize: 2,
                }"
                :height="500"
                @change="updatePreview"
              />
            </v-col>

            <v-col cols="12" md="6">
              <PlantumlPreview :code="previewCode" />
            </v-col>
          </v-row>
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
              @click="() => router.push('/admin/diagram/plant-uml')"
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
import { useTemplateDB, type TemplateModel } from '@/composables/sample/usePlantUMLDB';
import { debounce } from 'lodash-es';
import MonacoEditor from 'monaco-editor-vue3';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PlantumlPreview from './PlantUmlPreview.vue';

const router = useRouter();
const formRef = ref();
const form = ref<TemplateModel>({
  name: '',
  tags: [],
  description: '',
  xml: '',
});
const previewCode = ref('');
const saveTemplate = async () => {
  const db = await useTemplateDB();
  await db.add(form.value);
  router.push('/admin/diagram/plant-uml');
};

const updatePreview = debounce(() => {
  previewCode.value = form.value.xml || '';
}, 300);

const handleSubmit = async () => {
  await saveTemplate();
};
// @startuml
// actor User
// participant "Frontend" as FE
// participant "Backend" as BE

// User -> FE: 입력
// FE -> BE: 요청
// BE --> FE: 응답
// @enduml
</script>
