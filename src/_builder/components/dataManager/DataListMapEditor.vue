<template>
  <v-tabs v-model="innerTab" density="comfortable" class="mb-2">
    <v-tab value="column">Column</v-tab>
    <v-tab value="data">Data</v-tab>
  </v-tabs>

  <div class="d-flex align-center justify-space-between mb-2">
    <!-- 좌측: 행 추가/삭제/이동 -->
    <div class="d-flex align-center ga-2">
      <template v-if="innerTab === 'column'">
        <v-btn size="small" variant="text" @click="() => addColRow()">
          <v-icon start>mdi-table-row-plus-after</v-icon>
          행 추가
        </v-btn>
        <v-btn size="small" variant="text" color="error" @click="() => removeSelectedColRows()">
          <v-icon start>mdi-table-row-remove</v-icon>
          선택 삭제
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedColRow('up')">
          <v-icon start>mdi-arrow-up-bold</v-icon>
          위로
        </v-btn>
        <v-btn size="small" variant="text" @click="() => moveSelectedColRow('down')">
          <v-icon start>mdi-arrow-down-bold</v-icon>
          아래로
        </v-btn>
      </template>

      <template v-else>
        <v-checkbox-btn
          v-model="store.dataListMap!.useData"
          label="use data"
          density="compact"
          @update:model-value="() => store.autosaveDataListMap()"
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
    <!-- Column Grid -->
    <v-window-item value="column">
      <div class="ag-theme-quartz" style="height: 340px; width: 100%">
        <ag-grid-vue
          :columnDefs="colColDefs"
          :rowData="store.dataListMap?.columns ?? []"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          suppressRowClickSelection
          :animateRows="false"
          @cellValueChanged="() => onColumnsChanged()"
          @grid-ready="(p: any) => (colApi = p.api)"
          @cellKeyDown="onCellKeyDownCol"
        />
      </div>
    </v-window-item>

    <!-- Data Grid -->
    <v-window-item value="data">
      <div class="ag-theme-quartz" style="height: 340px; width: 100%">
        <ag-grid-vue
          :columnDefs="dataColDefs"
          :rowData="store.dataListMap?.rows ?? []"
          :defaultColDef="defaultColDef"
          rowSelection="multiple"
          suppressRowClickSelection
          :animateRows="false"
          @cellValueChanged="() => store.autosaveDataListMap()"
          @grid-ready="(p: any) => (dataApi = p.api)"
          @cellKeyDown="onCellKeyDownData"
        />
      </div>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, onUnmounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useDataCollectionsStore } from '@/_builder/stores/useDataCollectionsStore';
import { exportDataListMapToXlsx, importDataListMapFromXlsx } from '@/_builder/utils/excel';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

const store = useDataCollectionsStore();
const innerTab = ref<'column' | 'data'>('column');

const defaultColDef = { editable: true, resizable: true, sortable: true, filter: true };

const colColDefs = [
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
    headerName: 'ignoreStatus',
    field: 'ignoreStatus',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: [true, false] },
  },
  { headerName: 'importFormatter', field: 'importFormatter' },
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
  {
    headerName: 'useFilter',
    field: 'useFilter',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: [true, false] },
  },
  { headerName: 'valueType', field: 'valueType' },
];

// let colApi: GridApi | null = null;
// let dataApi: GridApi | null = null;
let colApi: any = null;
let dataApi: any = null;

const dataColDefs = computed(() => {
  const cols = store.dataListMap?.columns ?? [];
  return cols.map((c) => ({ headerName: c.id, field: c.id, editable: true }));
});

// ===== Excel Import/Export =====
const fileInput = ref<HTMLInputElement | null>(null);
const triggerImport = () => fileInput.value?.click();

const onImportFileChange = async (e: Event) => {
  const f = (e.target as HTMLInputElement)?.files?.[0];
  if (!f) return;
  const imported = await importDataListMapFromXlsx(f, store.dataListMap?.key);
  if (store.dataListMap) {
    store.dataListMap.columns = imported.columns;
    store.dataListMap.rows = imported.rows;
    colApi?.setRowData(store.dataListMap.columns);
    dataApi?.setColumnDefs(dataColDefs.value);
    dataApi?.setRowData(store.dataListMap.rows);
    store.autosaveDataListMap();
  }
  (e.target as HTMLInputElement).value = '';
};

const onExport = () => {
  if (!store.dataListMap) return;
  exportDataListMapToXlsx(store.dataListMap);
};

// ===== 행 추가/삭제 =====
const addColRow = () => {
  if (!store.dataListMap) return;
  store.dataListMap.columns.push({
    id: `key${store.dataListMap.columns.length + 1}`,
    name: '',
    dataType: 'text',
  });
  colApi?.setRowData(store.dataListMap.columns);
  onColumnsChanged();
};
const removeSelectedColRows = () => {
  if (!store.dataListMap || !colApi) return;
  const sel = colApi.getSelectedRows();
  store.dataListMap.columns = store.dataListMap.columns.filter((r) => !sel.includes(r));
  colApi.setRowData(store.dataListMap.columns);
  onColumnsChanged();
};

const onColumnsChanged = () => {
  dataApi?.setColumnDefs(dataColDefs.value);
  store.autosaveDataListMap();
};

const addDataRow = () => {
  if (!store.dataListMap) return;
  const row: Record<string, any> = {};
  for (const c of store.dataListMap.columns) row[c.id] = '';
  store.dataListMap.rows.push(row);
  dataApi?.setRowData(store.dataListMap.rows);
  store.autosaveDataListMap();
};
const removeSelectedDataRows = () => {
  if (!store.dataListMap || !dataApi) return;
  const sel = dataApi.getSelectedRows();
  store.dataListMap.rows = store.dataListMap.rows.filter((r) => !sel.includes(r));
  dataApi.setRowData(store.dataListMap.rows);
  store.autosaveDataListMap();
};

// ===== 행 스와프(위/아래) + 단축키 Alt+↑/↓ =====
function swap<T>(arr: T[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
const moveSelectedColRow = (dir: 'up' | 'down') => {
  if (!store.dataListMap || !colApi) return;
  const node = colApi.getSelectedNodes()[0];
  if (!node) return;
  const i = node.rowIndex!;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= store.dataListMap.columns.length) return;
  swap(store.dataListMap.columns, i, j);
  colApi.setRowData(store.dataListMap.columns);
  colApi.ensureIndexVisible(j);
  colApi.deselectAll();
  colApi.selectIndex(j);
  onColumnsChanged();
};
const moveSelectedDataRow = (dir: 'up' | 'down') => {
  if (!store.dataListMap || !dataApi) return;
  const node = dataApi.getSelectedNodes()[0];
  if (!node) return;
  const i = node.rowIndex!;
  const j = dir === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= store.dataListMap.rows.length) return;
  swap(store.dataListMap.rows, i, j);
  dataApi.setRowData(store.dataListMap.rows);
  dataApi.ensureIndexVisible(j);
  dataApi.deselectAll();
  dataApi.selectIndex(j);
  store.autosaveDataListMap();
};

// ===== 단축키: Delete / Ctrl+Backspace / Alt+ArrowUp/Down =====
const handleHotkey = (ev: KeyboardEvent, type: 'column' | 'data') => {
  const inGrid = (ev.target as HTMLElement)?.closest('.ag-root');
  if (!inGrid) return;

  if (ev.altKey && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) {
    ev.preventDefault();
    type === 'column'
      ? moveSelectedColRow(ev.key === 'ArrowUp' ? 'up' : 'down')
      : moveSelectedDataRow(ev.key === 'ArrowUp' ? 'up' : 'down');
    return;
  }
  if (ev.key === 'Delete' || ((ev.ctrlKey || ev.metaKey) && ev.key === 'Backspace')) {
    ev.preventDefault();
    type === 'column' ? removeSelectedColRows() : removeSelectedDataRows();
  }
};

// const onCellKeyDownCol = (e: CellKeyDownEvent) => {
const onCellKeyDownCol = (e: any) => {
  if (e.event instanceof KeyboardEvent) handleHotkey(e.event, 'column');
};
// const onCellKeyDownData = (e: CellKeyDownEvent) => {
const onCellKeyDownData = (e: any) => {
  if (e.event instanceof KeyboardEvent) handleHotkey(e.event, 'data');
};

// ===== 초기 로드 / 정리 =====
watchEffect(() => {
  if (store.isOpen && store.activeTab === 'dataListMap') {
    void store
      .loadDataListMapIndex()
      .then(() => store.loadDataListMap(store.selectedDataListMapKey));
  }
});
onUnmounted(() => {
  colApi?.destroy();
  dataApi?.destroy();
  colApi = null;
  dataApi = null;
});
</script>
