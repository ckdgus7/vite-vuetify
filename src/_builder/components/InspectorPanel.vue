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
          v-if="meta.type === 'text' || meta.type === 'number'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          hide-details
          dense
        />
        <!-- boolean -->
        <v-switch
          v-else-if="meta.type === 'boolean'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
        />
        <v-radio-group
          v-else-if="meta.type === 'radio'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          hide-details
          dense
        >
          <v-radio label="True" :value="true"></v-radio>
          <v-radio label="False" :value="false"></v-radio>
        </v-radio-group>

        <!-- select -->
        <v-select
          v-else-if="meta.type === 'select'"
          v-model="selectedElement.props[meta.key]"
          :items="meta.options"
          :label="meta.label"
          density="compact"
        />

        <!-- color -->
        <v-color-picker
          v-else-if="meta.type === 'color'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          hide-canvas
          mode="hexa"
        />

        <!-- object -->
        <div v-else-if="meta.type === 'object'">
          <label class="text-subtitle-2 mb-1">{{ meta.label }}</label>

          <template v-for="field in meta.fields || []" :key="field.key">
            <v-text-field
              v-model="selectedElement.props[field.key]"
              :label="field.label"
              :type="field.type || 'text'"
              hide-details
              dense
            />
          </template>
        </div>

        <!-- 배열 타입: 객체 항목일 경우 -->
        <div v-else-if="meta.type === 'array' && meta.itemType === 'object'" class="mt-2">
          <label class="text-subtitle-2 mb-1">{{ meta.label }}</label>

          <v-card
            v-for="(item, idx) in selectedElement.props[meta.key]"
            :key="idx"
            class="mb-2 pa-2"
            variant="outlined"
          >
            <div class="d-flex flex-column gap-2">
              <template v-for="field in meta.itemFields" :key="field.key">
                <v-text-field
                  v-model="item[field.key]"
                  :label="`${field.label} (${idx + 1})`"
                  :type="field.type || 'text'"
                  dense
                  hide-details
                />
              </template>
              <v-btn
                icon
                size="small"
                color="error"
                variant="text"
                class="align-self-end"
                @click="() => selectedElement.props[meta.key].splice(idx, 1)"
              >
                <v-icon icon="mdi-delete" />
              </v-btn>
            </div>
          </v-card>

          <!-- ✅ 객체 항목 추가 -->
          <v-btn
            block
            color="primary"
            size="small"
            @click="
              () => {
                if (!Array.isArray(selectedElement.props[meta.key])) {
                  selectedElement.props[meta.key] = [];
                }
                selectedElement.props[meta.key].push('');
              }
            "
          >
            + 옵션 추가
          </v-btn>
        </div>

        <!-- 배열 타입 렌더링 -->
        <div v-else-if="meta.type === 'array'">
          <label class="text-subtitle-2">{{ meta.label }}</label>

          <div
            v-for="(item, idx) in selectedElement.props[meta.key] || []"
            :key="idx"
            class="d-flex align-center mb-1 gap-2"
          >
            <v-text-field
              v-model="selectedElement.props[meta.key][idx]"
              :label="`Item ${idx + 1}`"
              :type="meta.itemType || 'text'"
              hide-details
              dense
              class="flex-1"
            />
            <v-btn icon size="small" @click="() => selectedElement.props[meta.key].splice(idx, 1)">
              <v-icon icon="mdi-delete" />
            </v-btn>
          </div>

          <!-- ✅ push 안전 처리 -->
          <v-btn
            block
            color="primary"
            size="small"
            @click="
              () => {
                if (!Array.isArray(selectedElement.props[meta.key])) {
                  selectedElement.props[meta.key] = [];
                }
                selectedElement.props[meta.key].push('');
              }
            "
          >
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

    <v-divider class="mb-2" />
    <EventEditor v-if="selectedElement" :element="selectedElement" @update="onEventUpdate" />
    <!-- <v-btn class="mt-4" color="error" @click="removeElement">삭제</v-btn> -->
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
  // console.log(builder.findElementById(builder.selectedElementId!));
  return builder.findElementById(builder.selectedElementId!);
});

const metaList = computed(() => {
  if (!selectedElement.value) return [];
  return ComponentRegistry[selectedElement.value.type]?.propsMeta || [];
});

const removeElement = () => {
  builder.removeElement(builder.selectedElementId || '');
};

// 배열 초기화 처리
watchEffect(() => {
  // console.log('metaList.value', metaList.value);
  for (const meta of metaList.value) {
    const key = meta.key;

    // array 초기화
    if (meta.type === 'array' && !Array.isArray(selectedElement.value.props[meta.key])) {
      selectedElement.value.props[meta.key] = [];
    }

    // object 초기화
    if (meta.type === 'object' && !Array.isArray(selectedElement.value.props[meta.key])) {
      // selectedElement.value.props = [];
      // selectedElement.value.props['style'] = {};

      for (const field of meta.fields || []) {
        selectedElement.value.props[field.key] = '';
      }
    }

    // 배열 내부 객체 항목 초기화
    if (
      meta.type === 'array' &&
      meta.itemType === 'object' &&
      !Array.isArray(selectedElement.value[key])
    ) {
      selectedElement.value.props[key].forEach((item: any, idx: number) => {
        if (typeof item !== 'object') selectedElement.value.props[key][idx] = {};
        for (const field of meta.itemFields || []) {
          if (!(field.key in selectedElement.value.props[key][idx])) {
            // selectedElement.value.props[key][idx][field.key] = '';
            selectedElement.value.props[field.key] = '';
          }
        }
      });
    }
  }
});
import EventEditor from './EventEditor.vue';

const onEventUpdate = ({ eventName, handlerName }: { eventName: string; handlerName: string }) => {
  if (!selectedElement) return;
  // console.log(builder.selectedElementId, eventName, handlerName);
  builder.addEventToComponent(builder.selectedElementId, eventName, handlerName);
};
</script>
