<template>
  <v-dialog v-model="model" :fullscreen="isXs" min-height="500">
    <v-card>
      <v-toolbar density="compact" color="primary" class="text-white">
        <v-toolbar-title class="text-subtitle-1">
          이미지 관리
          <span class="text-white/80 ms-2">— {{ titleByMode }}</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" class="text-white" @click="() => (model = false)" />
      </v-toolbar>

      <v-card-text class="pt-4">
        <!-- 목록 -->
        <template v-if="mode === 'list'">
          <v-row class="mb-3" align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="q"
                label="이미지명 검색"
                density="compact"
                clearable
                hide-details
                prepend-inner-icon="mdi-magnify"
              />
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-end">
              <v-btn color="primary" prepend-icon="mdi-plus" @click="() => toCreate()">등록</v-btn>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="filtered"
            :loading="store.loading"
            item-key="id"
            density="comfortable"
            hover
            class="elevation-1"
          >
            <template #item.index="{ index }">
              {{ index + 1 }}
            </template>

            <template #item.downloadUrl="{ item }">
              <v-menu open-on-hover location="bottom" :close-on-content-click="false" offset="8">
                <template #activator="{ props }">
                  <a
                    v-bind="props"
                    :href="item.downloadUrl"
                    target="_blank"
                    rel="noopener"
                    class="text-primary"
                  >
                    {{ item.downloadUrl }}
                  </a>
                </template>
                <div style="max-width: 280px; max-height: 280px">
                  <v-img :src="item.downloadUrl" :alt="item.name" cover aspect-ratio="1" />
                </div>
              </v-menu>
            </template>

            <template #item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template #item.actions="{ item }">
              <v-row>
                <v-col cols="12" class="d-flex">
                  <div>
                    <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-pencil"
                      @click="() => toEdit(item.id)"
                    />
                  </div>
                  <div>
                    <v-btn
                      size="small"
                      variant="text"
                      icon="mdi-delete"
                      color="error"
                      @click="() => onRemove(item.id)"
                    />
                  </div>
                </v-col>
              </v-row>
            </template>

            <template #no-data>
              <div class="py-10 text-medium-emphasis">데이터가 없습니다.</div>
            </template>
          </v-data-table>
        </template>

        <!-- 등록/수정 폼 -->
        <template v-else>
          <v-form ref="formRef" v-model="isValid" @submit.prevent="() => onSubmit()">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.trim="name"
                  label="이미지명"
                  :rules="[rRequired]"
                  maxlength="200"
                  counter
                  clearable
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.trim="downloadUrl"
                  label="다운로드 URL"
                  :rules="[rRequired, rUrl]"
                  clearable
                  required
                  hint="리스트에서 마우스오버 미리보기 대상"
                  persistent-hint
                />
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="12" class="d-flex gap-2">
                <div class="ma-2">
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="saving"
                    prepend-icon="mdi-content-save"
                  >
                    저장
                  </v-btn>
                </div>
                <div class="ma-2">
                  <v-btn variant="tonal" @click="() => toList()">취소</v-btn>
                </div>
                <v-spacer />
                <v-menu open-on-hover v-if="previewable">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" variant="text" prepend-icon="mdi-eye">미리보기</v-btn>
                  </template>
                  <div style="max-width: 320px; max-height: 320px">
                    <v-img :src="downloadUrl" :alt="name || 'preview'" cover aspect-ratio="1" />
                  </div>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useImageStore } from '@/_builder/stores/imageStore';
import type { ImageItem } from '@/_builder/composables/useImageDB';

type Mode = 'list' | 'create' | 'edit';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

/** dialog v-model 양방향 바인딩 */
const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const { xs } = useDisplay();
const isXs = computed(() => xs.value);

const store = useImageStore();
const { items } = storeToRefs(store);

const mode = ref<Mode>('list');
const selectedId = ref<string | null>(null);

const q = ref('');
const headers: any = ref([
  { title: '번호', key: 'index', width: 80, align: 'center' },
  { title: '이미지ID', key: 'id', minWidth: 220 },
  { title: '이미지명', key: 'name', minWidth: 220 },
  { title: '다운로드 URL', key: 'downloadUrl', minWidth: 260 },
  { title: '등록일', key: 'createdAt', width: 180, align: 'center' },
  { title: '작업', key: 'actions', align: 'center', width: 80 },
]);

const filtered = computed<ImageItem[]>(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter((i) => i.name.toLowerCase().includes(term));
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
    .getDate()
    .toString()
    .padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

/* ---------- 폼 상태 ---------- */
const formRef = ref();
const isValid = ref(false);
const saving = ref(false);

const name = ref<string>('');
const downloadUrl = ref<string>('');

const rRequired = (v: string) => (!!v && v.length > 0) || '필수 항목입니다.';
const rUrl = (v: string) => {
  try {
    new URL(v);
    return true;
  } catch {
    return '유효한 URL이 아닙니다.';
  }
};
const previewable = computed(() => {
  try {
    new URL(downloadUrl.value);
    return true;
  } catch {
    return false;
  }
});

const titleByMode = computed(() => {
  switch (mode.value) {
    case 'create':
      return '등록';
    case 'edit':
      return '수정';
    default:
      return '목록';
  }
});

/* ---------- 화면 전환 ---------- */
function toList() {
  mode.value = 'list';
  selectedId.value = null;
  // 폼 클리어
  name.value = '';
  downloadUrl.value = '';
}
function toCreate() {
  mode.value = 'create';
  selectedId.value = null;
  name.value = '';
  downloadUrl.value = '';
}
function toEdit(id: string) {
  const it = items.value.find((i) => i.id === id);
  if (!it) return;
  selectedId.value = id;
  name.value = it.name;
  downloadUrl.value = it.downloadUrl;
  mode.value = 'edit';
}

/* ---------- CRUD ---------- */
async function onSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid?.valid) return;
  saving.value = true;
  try {
    if (mode.value === 'create') {
      await store.createOne({ name: name.value, downloadUrl: downloadUrl.value });
      toList();
    } else if (mode.value === 'edit' && selectedId.value) {
      await store.updateOne(selectedId.value, { name: name.value, downloadUrl: downloadUrl.value });
      toList();
    }
  } finally {
    saving.value = false;
  }
}

async function onRemove(id: string) {
  await store.removeOne(id);
}

/* ---------- 라이프사이클 ---------- */
onMounted(() => {
  if (!items.value.length) store.fetchAll();
});

/* 다이얼로그가 닫힐 때 폼 초기화로 메모리/상태 누수 최소화 */
watch(
  () => model.value,
  (open) => {
    if (!open) {
      toList();
      q.value = '';
    }
  }
);
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(.v-data-table) {
    font-size: 0.9rem;
  }
}
</style>
