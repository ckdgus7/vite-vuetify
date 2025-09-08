<template>
  <v-dialog
    v-model="internalOpen"
    max-width="1200"
    transition="dialog-bottom-transition"
    :persistent="saving"
  >
    <v-card>
      <v-toolbar density="compact" color="primary" title="그리드 헤더 편집">
        <template #append>
          <v-btn
            variant="text"
            @click="() => onAdd()"
            title="행추가"
            alt="행추가"
            icon="mdi-plus"
          />
          <v-btn
            variant="text"
            @click="() => onDuplicate()"
            icon="mdi-content-copy"
            title="복사"
            alt="복사"
            :disabled="!hasSelection"
          />
          <v-btn
            variant="text"
            @click="() => onRemove()"
            icon="mdi-delete"
            title="삭제"
            alt="삭제"
            :disabled="!hasSelection"
          />
        </template>
      </v-toolbar>

      <v-card-text class="pa-0">
        <!-- ag-Grid 영역 -->
        <div class="ag-theme-alpine" style="height: 520px; width: 100%">
          <ag-grid-vue
            ref="gridRef"
            :theme="myTheme"
            :rowData="rows"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowDragManaged="true"
            :animateRows="true"
            :stopEditingWhenCellsLoseFocus="true"
            :domLayout="'normal'"
            :undoRedoCellEditing="true"
            :ensureDomOrder="true"
            :style="'height: 500px'"
            @grid-ready="(e: any) => onGridReady(e)"
            @selection-changed="() => onSelectionChanged()"
            @cell-value-changed="(e: any) => onCellChanged(e)"
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-spacer />
        <v-btn variant="text" :disabled="saving" @click="() => onClose()">취소</v-btn>
        <v-btn color="primary" :loading="saving" @click="() => onSave()">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { AgGridVue } from 'ag-grid-vue3'; // Vue Data Grid Component

import { AllCommunityModule, ModuleRegistry, themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
// Mark all grids as using legacy themes
const myTheme = themeBalham.withParams({ accentColor: 'red' });
// ag-Grid CSS는 전역(예: main.ts)에서 불러두는 것을 권장합니다.
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'

/** 편집 대상 컬럼 타입 */
export type GridHeaderItem = {
  headerName?: string;
  field?: string;
  type?: string;
  width?: number | string;
  maxWidth?: number | string;
  pinned?: 'left' | 'right' | null | string;
  initialWidth?: number | string;
  initialPinned?: 'left' | 'right' | null | string;
  hide?: boolean;
  sort?: 'asc' | 'desc' | null;
  filter?:
    | 'agSetColumnFilter'
    | 'agMultiColumnFilter'
    | 'agNumberColumnFilter'
    | 'agDateColumnFilter'
    | '';
  sortIndex?: number | string;
};

type Props = {
  /** 현재 컬럼 정의 목록 */
  value: GridHeaderItem[];
};
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'save', v: GridHeaderItem[]): void;
}>();

/** 내부 오픈 상태(외부 v-model 동기화) */
const internalOpen = defineModel<boolean>();

/** 편집용 로우 데이터 (깊은 복사) */
const rows = ref<GridHeaderItem[]>([]);

const saving = ref(false);

/** ag-Grid refs */
const gridRef = ref<typeof AgGridVue | null>(null);
const gridApi = shallowRef<any>(null);
const gridColumnApi = shallowRef<any>(null);

/** 선택 상태 */
const selectedIndex = ref<number | null>(null);
const hasSelection = computed(() => selectedIndex.value !== null);
const canMoveUp = computed(() => selectedIndex.value !== null && selectedIndex.value! > 0);

/** 숫자/불리언 캐스팅 도우미 */
function toNumberOrString(v: any) {
  if (v === '' || v === null || v === undefined) return undefined;
  if (typeof v === 'string' && v.trim() === '') return undefined;
  const n = Number(v);
  return isNaN(n) ? v : n;
}
function toBoolean(v: any) {
  if (typeof v === 'boolean') return v;
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return !!v;
}

/** 컬럼 정의(에디터용) */
const columnDefs = ref<any[]>([
  {
    headerName: '',
    field: 'drag',
    rowDrag: true,
    width: 50,
    suppressSizeToFit: true,
    sortable: false,
    filter: false,
    editable: false,
  },
  { headerName: 'headerName', field: 'headerName', width: 120, editable: true },
  { headerName: 'field', field: 'field', width: 120, editable: true },
  { headerName: 'type', field: 'type', width: 60, editable: true },
  {
    headerName: 'width',
    field: 'width',
    width: 60,
    editable: true,
    valueSetter: numberSetter('width'),
  },
  {
    headerName: 'maxWidth',
    field: 'maxWidth',
    width: 80,
    editable: true,
    valueSetter: numberSetter('maxWidth'),
  },
  {
    headerName: 'pinned',
    field: 'pinned',
    editable: true,
    width: 80,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['', 'left', 'right'] },
  },
  // {
  //   headerName: 'initialWidth',
  //   field: 'initialWidth',
  //   width: 110,
  //   editable: true,
  //   valueSetter: numberSetter('initialWidth'),
  // },
  // {
  //   headerName: 'initialPinned',
  //   field: 'initialPinned',
  //   width: 110,
  //   editable: true,
  //   cellEditor: 'agSelectCellEditor',
  //   cellEditorParams: { values: ['', 'left', 'right'] },
  // },
  {
    headerName: 'hide',
    field: 'hide',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    width: 80,
    cellEditorParams: { values: ['false', 'true'] },
    valueSetter: booleanSetter('hide'),
  },
  {
    headerName: 'sort',
    field: 'sort',
    editable: true,
    cellEditor: 'agSelectCellEditor',
    width: 80,
    cellEditorParams: { values: ['', 'asc', 'desc'] },
  },
  {
    headerName: 'filter',
    field: 'filter',
    editable: true,
    width: 160,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: [
        '',
        'agSetColumnFilter',
        'agMultiColumnFilter',
        'agNumberColumnFilter',
        'agDateColumnFilter',
      ],
    },
  },
  {
    headerName: 'sortIndex',
    field: 'sortIndex',
    editable: true,
    width: 77,
    valueSetter: numberSetter('sortIndex'),
  },
]);

/** 모든 컬럼 공통 옵션(성능/편의) */
const defaultColDef = ref({
  resizable: true,
  // sortable: true,
  // filter: true,
  // flex: 1,
});

function numberSetter(field: keyof GridHeaderItem) {
  return (params: any) => {
    const newValue = toNumberOrString(params.newValue);
    params.data[field] = newValue as any;
    return true;
  };
}
function booleanSetter(field: keyof GridHeaderItem) {
  return (params: any) => {
    const v = toBoolean(params.newValue);
    params.data[field] = v as any;
    return true;
  };
}

/** Grid Ready */
function onGridReady(e: any) {
  gridApi.value = e.api;
  gridColumnApi.value = e.columnApi;
  // 화면 크기 변화 시 자동 맞춤
  setTimeout(() => gridApi.value?.sizeColumnsToFit(), 0);
}

/** 선택 변경 */
function onSelectionChanged() {
  const selected = gridApi.value?.getSelectedNodes?.() ?? [];
  if (!selected.length) {
    selectedIndex.value = null;
  } else {
    selectedIndex.value = selected[0].rowIndex ?? null;
  }
}

/** 셀 변경 시 로직(필요시 추가 검증) */
function onCellChanged(_e: any) {
  // 중복 field 방지(간단 예: 비워두면 자동 생성)
  rows.value.forEach((r, idx) => {
    if (!r.field) r.field = `col_${idx + 1}`;
  });
}

/** 행 추가/복제/삭제/이동 */
function onAdd() {
  rows.value.push({
    headerName: 'New Column',
    field: `col_${rows.value.length + 1}`,
    type: '',
    width: undefined,
    maxWidth: undefined,
    pinned: '',
    initialWidth: undefined,
    initialPinned: '',
    hide: false,
    sort: null,
    filter: '',
    sortIndex: undefined,
  });
  gridApi.value?.setRowData(rows.value);
}

function onDuplicate() {
  if (selectedIndex.value === null) return;
  const src = rows.value[selectedIndex.value];
  const copy = JSON.parse(JSON.stringify(src)) as GridHeaderItem;
  copy.field = uniqueField(copy.field ?? `col_${rows.value.length + 1}`);
  rows.value.splice(selectedIndex.value + 1, 0, copy);
  gridApi.value?.setRowData(rows.value);
  gridApi.value?.ensureIndexVisible(selectedIndex.value + 1);
}

function onRemove() {
  if (selectedIndex.value === null) return;
  rows.value.splice(selectedIndex.value, 1);
  gridApi.value?.setRowData(rows.value);
  selectedIndex.value = null;
}

/** field 고유값 보장 */
function uniqueField(base: string) {
  let name = base;
  let k = 1;
  const exists = new Set(rows.value.map((r) => r.field));
  while (exists.has(name)) {
    name = `${base}_${k++}`;
  }
  return name;
}

/** 저장 */
function onSave() {
  saving.value = true;
  // 안전 정제: 공백 → undefined, 문자열 숫자 → number 변환
  const cleaned = rows.value.map((r, idx) => {
    const o: GridHeaderItem = { ...r };
    if (o.width !== undefined) o.width = toNumberOrString(o.width) as any;
    if (o.maxWidth !== undefined) o.maxWidth = toNumberOrString(o.maxWidth) as any;
    if (o.initialWidth !== undefined) o.initialWidth = toNumberOrString(o.initialWidth) as any;
    if (o.sortIndex !== undefined) o.sortIndex = toNumberOrString(o.sortIndex) as any;
    if (o.hide !== undefined) o.hide = toBoolean(o.hide);
    if (!o.field) o.field = `col_${idx + 1}`;
    if (o.pinned === '') o.pinned = null as any;
    if (o.initialPinned === '') o.initialPinned = null as any;
    if (o.sort === null) o.sort = null as any;
    if (o.filter === '') o.filter = '' as any;
    return o;
  });
  // 결과 전달
  emit('save', cleaned);
  saving.value = false;
  internalOpen.value = false;
}

/** 닫기 */
function onClose() {
  internalOpen.value = false;
}

/** 외부 value 변경 → 편집 버퍼 갱신 */
watch(
  () => props.value,
  (v) => {
    // 깊은 복사하여 편집
    // console.log(v);
    if (internalOpen.value) {
    }
    rows.value = JSON.parse(JSON.stringify(v ?? []));
    // console.log(rows.value);
    // 최소 1개 보장(초기 UX)
    if (!rows.value.length) onAdd();
    // 그리드 데이터 반영
    // const gApi = gridApi.value
    // gridApi.value?.setRowData(rows.value);
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  // 필요시 리스너 등록 등
});
onUnmounted(() => {
  // ag-Grid 내부 타이머/리스너 정리
  gridApi.value?.destroy?.();
  gridApi.value = null;
  gridColumnApi.value = null;
});
</script>

<style scoped>
.ag-theme-alpine {
  --ag-foreground-color: rgb(33, 33, 33);
  --ag-background-color: #fff;
  --ag-header-foreground-color: #111;
  --ag-header-background-color: #fafafa;
  --ag-odd-row-background-color: #fbfbfb;
}
</style>
