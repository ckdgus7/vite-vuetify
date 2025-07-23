<template>
  <v-card class="pa-4" elevation="2" v-if="selectedElement">
    <v-card-title>속성 편집</v-card-title>
    <v-divider class="mb-2" />

    <template v-for="meta in metaList" :key="meta.key">
      <!-- vuetify component 전용 스타일 속성 -->
      <template
        v-if="selectedElement.type.startsWith('v-') || selectedElement.type.startsWith('my-')"
      >
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
        <!-- 배열 -->
        <div v-else-if="meta.type === 'array'" class="mb-4">
          <label class="text-subtitle-2">{{ meta.label }}</label>
          <div
            v-for="(item, idx) in targetProps[meta.key]"
            :key="idx"
            class="d-flex align-center mb-1 gap-2"
          >
            <v-text-field
              v-model="targetProps[meta.key][idx]"
              :label="`Item ${idx + 1}`"
              :type="meta.itemType || 'text'"
              hide-details
              dense
              class="flex-1"
            />
            <v-btn icon size="small" @click="() => targetProps[meta.key].splice(idx, 1)">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </div>
          <v-btn block color="primary" size="small" @click="() => targetProps[meta.key].push('')">
            + 항목 추가
          </v-btn>
        </div>
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
import { computed, watchEffect } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { ComponentRegistry } from '@/_builder/utils/componentMap';

const builder = useBuilderStore();

const selectedElement: any = computed(() => {
  console.log(builder.findElementById(builder.selectedElementId!));
  return builder.findElementById(builder.selectedElementId!);
});

const metaList = computed(() => {
  if (!selectedElement.value) return [];
  return ComponentRegistry[selectedElement.value.type]?.propsMeta || [];
});

const removeElement = () => {
  builder.removeElement(builder.selectedElementId || '');
};
const targetProps = computed(() => {
  if (selectedElement?.props) {
    return selectedElement.props;
  }
  return {};
});

// ✅ 배열 기반 propsMeta 파싱
const rawPropsMeta = computed(() => {
  const type = selectedElement?.type;
  if (type && ComponentRegistry[type]) {
    return ComponentRegistry[type].propsMeta || [];
  }
  return [];
});

/**
 * propsMeta 항목을 배열 형태에서 [{ key, ...meta }] 형식으로 정규화
 */
const normalizedPropsMeta = computed(() => {
  return rawPropsMeta.value.map((item: any) => {
    if ('key' in item) return item;
    const key = Object.keys(item)[0];
    return { key, ...item[key] };
  });
});

// 배열 초기화 처리
watchEffect(() => {
  for (const meta of normalizedPropsMeta.value) {
    const key = meta.key;
    if (meta.type === 'array' && !Array.isArray(targetProps.value[key])) {
      targetProps.value[key] = [];
    }
  }
});
</script>
