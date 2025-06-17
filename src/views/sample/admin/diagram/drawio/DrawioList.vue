<template>
  <v-container>
    <v-card class="pa-4 mb-6" elevation="2">
      <v-row class="d-flex align-center">
        <v-col cols="12" md="5">
          <v-text-field
            v-model="search"
            label="템플릿명 검색"
            clearable
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-combobox
            v-model="tagFilter"
            :items="allTags"
            label="태그 검색"
            multiple
            chips
            clearable
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            color="primary"
            variant="outlined"
            @click="() => router.push('/admin/diagram/drawio/register')"
            class="w-100"
          >
            새 템플릿
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col v-for="tpl in filteredTemplates" :key="tpl.id" cols="12" sm="6" md="4">
        <v-card elevation="3">
          <v-card-title class="text-truncate">
            {{ tpl.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ tpl.tags.join(', ') }}
          </v-card-subtitle>

          <v-card-text>
            <div class="text-truncate" style="max-height: 3em">
              {{ tpl.description }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="() => goDetail(tpl.id!)" variant="text" color="primary">상세</v-btn>
            <v-btn @click="() => goEdit(tpl.id!)" variant="text" color="teal">수정</v-btn>
            <v-btn @click="() => deleteTemplate(tpl.id!)" variant="text" color="error">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useTemplateDB, type TemplateModel } from '@/composables/sample/useTemplateDB';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const templates = ref<TemplateModel[]>([]);
const search = ref('');
const tagFilter = ref<string[]>([]);
const allTags = ref<string[]>([]);
const router = useRouter();

const loadTemplates = async () => {
  const db = await useTemplateDB();
  const all = await db.getAll();
  templates.value = all;
  allTags.value = Array.from(new Set(all.flatMap((t) => t.tags)));
};

const filteredTemplates = computed(() => {
  return templates.value.filter((tpl) => {
    const nameMatch = tpl.name.toLowerCase().includes(search.value.toLowerCase());
    const tagMatch =
      tagFilter.value.length === 0 || tagFilter.value.every((tag) => tpl.tags.includes(tag));
    return nameMatch && tagMatch;
  });
});

const deleteTemplate = async (id: number) => {
  const db = await useTemplateDB();
  await db.remove(id);
  await loadTemplates();
};

const goDetail = (id: number) => {
  router.push(`/admin/diagram/drawio/view/${id}`);
};

const goEdit = (id: number) => {
  router.push(`/admin/diagram/drawio/edit/${id}`);
};

onMounted(loadTemplates);
</script>
