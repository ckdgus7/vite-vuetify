<template>
  <v-card class="pa-4" elevation="2" v-if="selectedElement">
    <!-- <v-card-title>Attribute</v-card-title>
    <v-divider class="mb-2" /> -->

    <template v-for="meta in metaList" :key="meta.key">
      <!-- component 전용 스타일 속성 -->
      <template
        v-if="
          selectedElement.type.startsWith('v-') ||
          selectedElement.type.startsWith('my-') ||
          selectedElement.type.startsWith('group')
        "
      >
        <v-text-field
          v-if="meta.type === 'text' || meta.type === 'number'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          :readonly="meta.key === 'id'"
          hide-details
          dense
        />
        <v-textarea
          v-else-if="meta.type === 'textarea'"
          v-model="selectedElement.props[meta.key]"
          :label="meta.label"
          auto-grow
          hide-details
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
          <span class="pl-3">
            <v-btn
              v-if="isHeaderType"
              size="small"
              color="primary"
              @click="() => (headerDialog = true)"
            >
              그리드 헤더 편집
            </v-btn>
          </span>

          <v-card
            v-for="(item, idx) in selectedElement.props[meta.key]"
            :key="idx"
            class="mb-2 pa-2"
          >
            <div class="d-flex flex-column gap-2">
              <template v-for="field in meta.itemFields" :key="field.key">
                <v-text-field
                  v-if="field.type === 'text' || field.type === 'number'"
                  v-model="item[field.key]"
                  :label="`${field.label} (${idx + 1})`"
                  :type="field.type || 'text'"
                  dense
                  hide-details
                />
                <v-textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="item[field.key]"
                  :label="`${field.label} (${idx + 1})`"
                  auto-grow
                  hide-details
                />
                <!-- boolean -->
                <v-switch
                  v-else-if="field.type === 'boolean'"
                  v-model="item[field.key]"
                  :label="`${field.label} (${idx + 1})`"
                  hide-details
                />
                <v-radio-group
                  v-else-if="field.type === 'radio'"
                  v-model="item[field.key]"
                  :label="`${field.label} (${idx + 1})`"
                  hide-details
                  dense
                >
                  <v-radio label="True" :value="true"></v-radio>
                  <v-radio label="False" :value="false"></v-radio>
                </v-radio-group>

                <!-- select -->
                <v-select
                  v-else-if="field.type === 'select'"
                  v-model="item[field.key]"
                  :items="field.options"
                  :label="`${field.label} (${idx + 1})`"
                  density="compact"
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
    </template>

    <div v-if="!isGroup">
      <v-divider class="mb-2" />
      <div v-for="(ev, i) in eventList" :key="i">
        <EventEditor
          v-if="selectedElement"
          :element="selectedElement"
          :listIndex="i"
          @update="onEventUpdate"
          @delete="onEventDelete"
        />
      </div>
      <v-btn block color="primary" size="small" @click="() => eventList.push('ev')">
        + 이벤트 추가
      </v-btn>
    </div>

    <GridHeaderEditorDialog
      v-model="headerDialog"
      :value="currentColumns"
      @save="(cols) => onSaveHeaders(cols)"
    />
  </v-card>

  <v-sheet v-else class="pt-14">
    <div style="text-align: center">선택된 요소가 없습니다.</div>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import store from '@/_builder/stores/index';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import EventEditor from './EventEditor.vue';
import GridHeaderEditorDialog, {
  type GridHeaderItem,
} from './InspectorPanel/GridHeaderEditorDialog.vue';

const eventList: any = ref([]);

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
// watchEffect(() => {
//   for (const meta of metaList.value) {
//     const key = meta.key;

//     // array 초기화
//     if (meta.type === 'array' && !Array.isArray(selectedElement.value.props[meta.key])) {
//       selectedElement.value.props[meta.key] = [];
//     }

//     // object 초기화
//     if (meta.type === 'object' && !Array.isArray(selectedElement.value.props[meta.key])) {
//       selectedElement.value.props[meta.key] = {};
//       for (const field of meta.itemFields) {
//         selectedElement.value.props[key][field.key] = '';
//       }
//     }

//     // 배열 내부 객체 항목 초기화
//     if (
//       meta.type === 'array' &&
//       meta.itemType === 'object' &&
//       !Array.isArray(selectedElement.value[key])
//     ) {
//       selectedElement.value.props[key].forEach((item: any, idx: number) => {
//         if (typeof item !== 'object') selectedElement.value.props[key][idx] = {};
//         for (const field of meta.itemFields || []) {
//           if (!(field.key in selectedElement.value.props[key][idx])) {
//             selectedElement.value.props[field.key] = '';
//           }
//         }
//       });
//     }
//   }
// });

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

const onEventDelete = ({ eventName, listIndex }: { eventName: string; listIndex: number }) => {
  if (!selectedElement.value) return;
  eventList.value.splice(listIndex, 1);
  builder.deleteEventToComponent(selectedElement.value.id, listIndex);
};

const isHeaderType = computed(() => selectedElement.value.type === 'my-ag-grid');

/** grid header 팝업 */
// grid header 팝업 오픈
const headerDialog = ref(false);
/** 현재 컬럼 정의 가져오기(없으면 빈 배열) */
const currentColumns = computed(() => {
  if (selectedElement.value && isHeaderType.value) {
    const colDefs = selectedElement.value.props['columnDefs'];
    return colDefs;
  } else {
    return [];
  }
});
// 저장 시 반영
const onSaveHeaders = (cols: GridHeaderItem[]) => {
  selectedElement.value.props.columnDefs = [...cols];
};
/** grid header 팝업 */
</script>
