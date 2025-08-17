<template>
  <v-card class="pa-4" elevation="2" v-if="selectedElement">
    <v-card-title>Attribute</v-card-title>
    <v-divider class="mb-2" />

    <template v-for="meta in metaList" :key="meta.key">
      <!-- component 전용 스타일 속성 -->
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
          hide-details
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
          :items="getMetaOption(meta)"
          :label="meta.label"
          density="compact"
          hide-details
        />

        <!-- color -->
        <v-color-picker
          v-else-if="meta.type === 'color'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          hide-canvas
          mode="hexa"
          hide-details
        />

        <!-- object -->
        <div v-else-if="meta.type === 'object'">
          <label class="text-subtitle-2 mb-1">{{ meta.label }}</label>

          <template v-for="(field, idx) in meta.itemFields" :key="field.key">
            <v-text-field
              v-if="field.type === 'text' || field.type === 'number'"
              v-model="selectedElement.props[meta.key][field.key]"
              :label="field.label"
              hide-details
              dense
            />
            <!-- boolean -->
            <v-switch
              v-else-if="field.type === 'boolean'"
              v-model="selectedElement.props[meta.key][field.key]"
              :label="field.label"
              hide-details
            />
            <v-radio-group
              v-else-if="field.type === 'radio'"
              v-model="selectedElement.props[meta.key][field.key]"
              :label="field.label"
              hide-details
              dense
            >
              <v-radio label="True" :value="true"></v-radio>
              <v-radio label="False" :value="false"></v-radio>
            </v-radio-group>

            <!-- select -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="selectedElement.props[meta.key][field.key]"
              :items="field.options"
              :label="field.label"
              density="compact"
              hide-details
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

          <!-- 객체 항목 추가 -->
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

          <!-- push 안전 처리 -->
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

      <!-- group 전용 스타일 속성 -->
      <template v-else>
        <v-text-field
          v-if="meta.type === 'text'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          hide-details
          dense
        />
        <v-textarea
          v-else-if="meta.type === 'textarea'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          auto-grow
          hide-details
        />
        <v-select
          v-else-if="meta.type === 'select'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          :items="meta.options"
          hide-details
        />
        <v-switch
          v-else-if="meta.type === 'boolean'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          hide-details
        />
        <v-radio-group
          v-else-if="meta.type === 'radio'"
          v-model="selectedElement.styles[meta.key]"
          :label="meta.label"
          hide-details
        >
          <v-radio label="True" :value="true"></v-radio>
          <v-radio label="False" :value="false"></v-radio>
        </v-radio-group>
      </template>
    </template>

    <div v-if="!isGroup">
      <v-divider class="mb-2" />
      <EventEditor v-if="selectedElement" :element="selectedElement" @update="onEventUpdate" />
    </div>
  </v-card>
  <v-card v-else class="pa-4">
    <v-card-text>선택된 요소가 없습니다.</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import store from '@/_builder/stores/index';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import EventEditor from './EventEditor.vue';

const builder = store.useBuilderStore();
const dataCollection = store.useDataCollectionStore();

const selectedElement: any = computed(() => {
  return builder.findElementById(builder.selectedElementId!);
});
const isGroup = computed((): boolean => {
  return selectedElement.value.type === 'group';
});

const metaList = computed(() => {
  if (!selectedElement.value) return [];
  return ComponentRegistry[selectedElement.value.type]?.propsMeta || [];
});

const getMetaOption = (meta: any) => {
  if (meta.key === 'dataMapSchema') {
    return dataCollection.getDataSchema();
  } else if (meta.key === 'dataMapKey') {
    return dataCollection.getDataKey();
  } else if (meta.key === 'dataListMapSchema') {
    return dataCollection.getDataListSchema();
  } else if (meta.key === 'dataListMapKey') {
    return dataCollection.getDataListKey();
  }
  return meta.options;
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
      selectedElement.value.props[meta.key] = {};

      // for (const key in myObject) {
      //   if (myObject.hasOwnProperty(key)) { // 객체 자신의 속성만 순회하도록 확인
      //     console.log(`Key: ${key}, Value: ${myObject[key]}`);
      //   }
      // }
      for (const field of meta.itemFields) {
        selectedElement.value.props[key][field.key] = '';
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

const onEventUpdate = ({
  eventName,
  handlerName,
  code,
}: {
  eventName: string;
  handlerName: string;
  code: string;
}) => {
  if (!selectedElement.value) return;
  builder.addEventToComponent(selectedElement.value.id, eventName, handlerName, code);
};
</script>
