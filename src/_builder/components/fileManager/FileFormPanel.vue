<!-- src/_builder/modules/files/panels/FileFormPanel.vue -->
<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <span class="text-subtitle-1">
        {{ titleText }}
      </span>
      <v-spacer />
      <v-btn variant="text" @click="() => emit('back')">목록</v-btn>
      <v-divider vertical class="mx-2" />
      <v-btn v-if="readonly && id" variant="text" @click="() => emit('edit', id || '')">수정</v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-form ref="formRef" @submit.prevent="() => onSubmit()">
        <template v-if="id">
          <v-text-field
            v-model="form.name"
            label="파일명"
            :readonly="readonly"
            :rules="[(v) => !!v || '파일명을 입력하세요.']"
            variant="outlined"
            density="comfortable"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="form.url"
            label="다운로드 URL"
            :readonly="readonly"
            :rules="[(v) => !!v || '다운로드 URL을 입력하세요.']"
            variant="outlined"
            density="comfortable"
            required
          />
        </template>
        <template v-else>
          <v-text-field
            v-model="form.name"
            label="파일명"
            :rules="[(v) => !!v || '파일명을 입력하세요.']"
            variant="outlined"
            density="comfortable"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="form.url"
            label="다운로드 URL"
            :rules="[(v) => !!v || '다운로드 URL을 입력하세요.']"
            variant="outlined"
            density="comfortable"
            required
          />
        </template>
        <div class="d-flex align-center gap-2 mt-4">
          <v-row>
            <v-col cols="12" class="d-flex">
              <div class="ma-1">
                <v-btn v-if="!readonly" type="submit" color="primary">
                  {{ id ? '수정' : '등록' }}
                </v-btn>
              </div>
              <div class="ma-1">
                <v-btn v-if="!id && !readonly" variant="tonal" @click="() => onReset()">
                  초기화
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-spacer />
          <FilePreviewPopover v-if="form.url" :url="form.url" :filename="form.name" />
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useFileStore } from '@/_builder/stores/fileStore';
import FilePreviewPopover from '@/_builder/components/fileManager/FilePreviewPopover.vue';

const props = defineProps<{
  id?: string | null;
  readonly?: boolean;
}>();
const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'back'): void;
  (e: 'edit', id: string): void;
}>();

const formRef = ref();
const form = reactive({ name: '', url: '' });
const store = useFileStore();

const titleText = computed(() => {
  if (props.readonly) return '파일 상세';
  return props.id ? '파일 수정' : '파일 등록';
});

const load = async () => {
  if (!props.id) {
    form.name = '';
    form.url = '';
    return;
  }
  const item = await store.getById(props.id);
  if (!item) return;
  form.name = item.name;
  form.url = item.url;
};

const onSubmit = async () => {
  if (props.readonly) return;
  const valid = await formRef.value?.validate();
  if (valid?.valid === false) return;
  if (props.id) {
    await store.update(props.id, { name: form.name, url: form.url });
  } else {
    await store.create({ name: form.name, url: form.url });
  }
  formRef.value?.reset();
  emit('saved');
};

const onReset = () => {
  form.name = '';
  form.url = '';
};

onMounted(load);
watch(() => props.id, load);
</script>
