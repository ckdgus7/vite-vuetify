<template>
  <v-card class="pa-4" elevation="2" v-if="selectedElement">
    <v-card-title>속성 편집</v-card-title>
    <v-divider class="mb-2" />

    <template v-for="meta in metaList" :key="meta.key">
      <!-- vuetify component 전용 스타일 속성 -->
      <template v-if="selectedElement.type.startsWith('v-')">
        <v-text-field
          v-if="meta.type === 'text'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          variant="outlined"
        />
        <v-textarea
          v-else-if="meta.type === 'textarea'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          variant="outlined"
          auto-grow
        />
        <v-select
          v-else-if="meta.type === 'select'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          :items="meta.options"
          variant="outlined"
        />
        <v-radio-group
          v-else-if="meta.type === 'radio'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
        >
          <v-radio label="True" :value="true"></v-radio>
          <v-radio label="False" :value="false"></v-radio>
        </v-radio-group>
      </template>
      <!-- vuetify component 외 일반 html 전용 스타일 속성 -->
      <template v-else>
        <v-text-field
          v-if="meta.type === 'text'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          variant="outlined"
        />
        <v-textarea
          v-else-if="meta.type === 'textarea'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          variant="outlined"
          auto-grow
        />
        <v-select
          v-else-if="meta.type === 'select'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          :items="meta.options"
          variant="outlined"
        />
        <v-radio-group
          v-else-if="meta.type === 'radio'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
        >
          <v-radio label="True" :value="true"></v-radio>
          <v-radio label="False" :value="false"></v-radio>
        </v-radio-group>
      </template>
    </template>

    <v-btn class="mt-4" color="error" @click="removeElement">삭제</v-btn>
  </v-card>
  <v-card v-else class="pa-4">
    <v-card-text>선택된 요소가 없습니다.</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { ComponentRegistry } from '@/_builder/utils/componentMap';

const builder = useBuilderStore();

const selectedElement = computed(() => builder.findElementById(builder.selectedElementId!));

const metaList = computed(() => {
  if (!selectedElement.value) return [];
  return ComponentRegistry[selectedElement.value.type]?.propsMeta || [];
});

const removeElement = () => {
  if (selectedElement.value) {
    builder.elements = builder.elements.filter((el) => el.id !== selectedElement.value?.id);
    builder.selectedElementId = null;
  }
};
</script>
