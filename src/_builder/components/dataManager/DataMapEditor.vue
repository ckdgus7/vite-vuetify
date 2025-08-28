<template>
  <v-tabs v-model="innerTab" density="comfortable" class="mb-2">
    <v-tab value="key">Key</v-tab>
    <v-tab value="data">Data</v-tab>
  </v-tabs>

  <div class="d-flex align-center justify-space-between mb-2">
    <!-- 좌측: 행 추가/삭제/이동 -->
    <div class="d-flex align-center ga-2">
      <template v-if="innerTab === 'key'">
        <v-btn size="small" variant="text" @click="() => addKeyRow()">
          <v-icon start>mdi-table-row-plus-after</v-icon>
          행 추가
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="() => removeSelectedKeyRows()">
          <v-icon start>mdi-table-row-remove</v-icon>
          선택 삭제
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedKeyRow('up')">
          <v-icon start>mdi-arrow-up-bold</v-icon>
          위로
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedKeyRow('down')">
          <v-icon start>mdi-arrow-down-bold</v-icon>
          아래로
        </v-btn>
      </template>

      <template v-else>
        <v-checkbox-btn
          v-model="store.dataMap!.useData"
          label="use data"
          density="compact"
          @update:model-value="() => store.autosaveDataMap()"
        />
        <v-btn size="small" variant="text" @click="() => addDataRow()">
          <v-icon start>mdi-table-row-plus-after</v-icon>
          행 추가
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="() => removeSelectedDataRows()">
          <v-icon start>mdi-table-row-remove</v-icon>
          선택 삭제
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedDataRow('up')">
          <v-icon start>mdi-arrow-up-bold</v-icon>
          위로
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedDataRow('down')">
          <v-icon start>mdi-arrow-down-bold</v-icon>
          아래로
        </v-btn>
      </template>
    </div>

    <!-- 우측: Excel Import/Export -->
    <div class="d-flex align-center ga-2">
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        class="d-none"
        @change="onImportFileChange"
      />
      <v-btn size="small" variant="text" @click="() => triggerImport()">
        <v-icon start>mdi-file-import-outline</v-icon>
        Import
      </v-btn>
      <v-btn size="small" variant="text" @click="() => onExport()">
        <v-icon start>mdi-file-export-outline</v-icon>
        Export
      </v-btn>
    </div>
  </div>

  <v-window v-model="innerTab">
    <!-- Key Grid -->
    <v-window-item value="key">
      <div class="ag-theme-quartz" style="height: 340px; width: 100%">
        <ag-grid-vue
          :columnDefs="keyColDefs"
          :rowData="store.dataMap?.columns ?? []"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          suppressRowClickSelection
          @cellValueChanged="() => store.autosaveDataMap()"
          @grid-ready="(p: any) => (keyApi = p.api)"
          @cellKeyDown="onCellKeyDownKey"
        />
      </div>
    </v-window-item>

    <!-- Data Grid -->
    <v-window-item value="data">
      <div class="ag-theme-quartz" style="height: 340px; width: 100%">
        <ag-grid-vue
          :columnDefs="dataColDefs"
          :rowData="store.dataMap?.rows ?? []"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          suppressRowClickSelection
          @cellValueChanged="() => store.autosaveDataMap()"
          @grid-ready="(p: any) => (dataApi = p.api)"
          @cellKeyDown="onCellKeyDownData"
        />
      </div>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watchEffect } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useDataCollectionsStore } from '@/_builder/stores/useDataCollectionsStore';
import { exportDataMapToXlsx, importDataMapFromXlsx } from '@/_builder/utils/excel';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

const store = useDataCollectionsStore();
const innerTab = ref<'key' | 'data'>('key');

const defaultColDef = { editable: true, resizable: true, sortable: true, filter: true };

const keyColDefs = [
  { headerName: 'id', field: 'id' },
  { headerName: 'name', field: 'name' },
  {
    headerName: 'dataType',
    field: 'dataType',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['text', 'number', 'date', 'boolean'] },
  },
  { headerName: 'defaultValue', field: 'defaultValue' },
  {
    headerName: 'encYN',
    field: 'encYN',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: [true, false] },
  },
  {
    headerName: 'length',
    field: 'length',
    valueParser: (p: any) => Number(p.newValue) || undefined,
  },
  {
    headerName: 'nullYN',
    field: 'nullYN',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: [true, false] },
  },
];

const dataColDefs = [
  { headerName: 'id', field: 'id' },
  { headerName: 'value', field: 'value' },
];

// let keyApi: GridApi | null = null;
// let dataApi: GridApi | null = null;
let keyApi: any = null;
let dataApi: any = null;

const fileInput = ref<HTMLInputElement | null>(null);
const triggerImport = () => fileInput.value?.click();

const onImportFileChange = async (e: Event) => {
  const f = (e.target as HTMLInputElement)?.files?.[0];
  if (!f) return;
  const imported = await importDataMapFromXlsx(f, store.dataMap?.key);
  // 현재 dataMap의 key는 유지, 시트 데이터만 교체
  if (store.dataMap) {
    store.dataMap.columns = imported.columns;
    store.dataMap.rows = imported.rows;
    keyApi?.setRowData(store.dataMap.columns);
    dataApi?.setRowData(store.dataMap.rows);
    store.autosaveDataMap();
  }
  (e.target as HTMLInputElement).value = '';
};

const onExport = () => {
  if (!store.dataMap) return;
  exportDataMapToXlsx(store.dataMap);
};

// ===== 행 추가/삭제 =====
const addKeyRow = () => {
  if (!store.dataMap) return;
  store.dataMap.columns.push({
    id: `key${store.dataMap.columns.length + 1}`,
    name: '',
    dataType: 'text',
  });
  keyApi?.setRowData(store.dataMap.columns);
  store.autosaveDataMap();
};
const removeSelectedKeyRows = () => {
  if (!store.dataMap || !keyApi) return;
  const sel = keyApi.getSelectedRows();
  store.dataMap.columns = store.dataMap.columns.filter((r) => !sel.includes(r));
  keyApi.setRowData(store.dataMap.columns);
  store.autosaveDataMap();
};
const addDataRow = () => {
  if (!store.dataMap) return;
  store.dataMap.rows.push({ id: '', value: '' });
  dataApi?.setRowData(store.dataMap.rows);
  store.autosaveDataMap();
};
const removeSelectedDataRows = () => {
  if (!store.dataMap || !dataApi) return;
  const sel = dataApi.getSelectedRows();
  store.dataMap.rows = store.dataMap.rows.filter((r) => !sel.includes(r));
  dataApi.setRowData(store.dataMap.rows);
  store.autosaveDataMap();
};

// ===== 행 스와프(위/아래) + 단축키 Alt+↑/↓ =====
function swap<T>(arr: T[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
const moveSelectedKeyRow = (dir: 'up' | 'down') => {
  if (!store.dataMap || !keyApi) return;
  const node = keyApi.getSelectedNodes()[0];
  if (!node) return;
  const i = node.rowIndex!;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= store.dataMap.columns.length) return;
  swap(store.dataMap.columns, i, j);
  keyApi.setRowData(store.dataMap.columns);
  keyApi.ensureIndexVisible(j);
  keyApi.deselectAll();
  keyApi.selectIndex(j);
  store.autosaveDataMap();
};
const moveSelectedDataRow = (dir: 'up' | 'down') => {
  if (!store.dataMap || !dataApi) return;
  const node = dataApi.getSelectedNodes()[0];
  if (!node) return;
  const i = node.rowIndex!;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= store.dataMap.rows.length) return;
  swap(store.dataMap.rows, i, j);
  dataApi.setRowData(store.dataMap.rows);
  dataApi.ensureIndexVisible(j);
  dataApi.deselectAll();
  dataApi.selectIndex(j);
  store.autosaveDataMap();
};

// ===== 단축키: Delete / Ctrl+Backspace / Alt+ArrowUp/Down =====
const handleHotkey = (ev: KeyboardEvent, type: 'key' | 'data') => {
  const inGrid = (ev.target as HTMLElement)?.closest('.ag-root');
  if (!inGrid) return;

  if (ev.altKey && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) {
    ev.preventDefault();
    type === 'key'
      ? moveSelectedKeyRow(ev.key === 'ArrowUp' ? 'up' : 'down')
      : moveSelectedDataRow(ev.key === 'ArrowUp' ? 'up' : 'down');
    return;
  }
  if (ev.key === 'Delete' || ((ev.ctrlKey || ev.metaKey) && ev.key === 'Backspace')) {
    ev.preventDefault();
    type === 'key' ? removeSelectedKeyRows() : removeSelectedDataRows();
  }
};

// const onCellKeyDownKey = (e: CellKeyDownEvent) => {
const onCellKeyDownKey = (e: any) => {
  // ag-grid 내부 이벤트에서 Delete도 오지만, 통일을 위해 전역핸들러와 동일 동작
  if (e.event instanceof KeyboardEvent) handleHotkey(e.event, 'key');
};
// const onCellKeyDownData = (e: CellKeyDownEvent) => {
const onCellKeyDownData = (e: any) => {
  if (e.event instanceof KeyboardEvent) handleHotkey(e.event, 'data');
};

// ===== 초기 로드 / 정리 =====
watchEffect(() => {
  if (store.isOpen && store.activeTab === 'dataMap') {
    void store.loadDataMapIndex().then(() => store.loadDataMap(store.selectedDataMapKey));
  }
});
onUnmounted(() => {
  keyApi?.destroy();
  dataApi?.destroy();
  keyApi = null;
  dataApi = null;
});
</script>
