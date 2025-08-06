<template>
  <div style="margin: 20px">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="getColumnDefs"
      :defaultColDef="getDefaultColDef"
      :style="getStyles"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, watchEffect } from 'vue';
import { AgGridVue } from 'ag-grid-vue3'; // Vue Data Grid Component
// import type { ColDef } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  type GridReadyEvent,
  // type GridApi,
  // type Column,
  // ValidationModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  // ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);
const props = defineProps(['apiUrl', 'defaultColDef', 'columnDefs', 'gridStyle', 'style']);
const rowData = ref<any[]>([]);

// const apiUrl = 'https://www.ag-grid.com/example-assets/space-mission-data.json';
// const defaultColDef = ref<ColDef>({
//   flex: 1,
//   editable: true,
// });
// const columnDefs = ref<ColDef[]>([
//   { field: 'mission' },
//   { field: 'company' },
//   { field: 'location' },
//   { field: 'date' },
//   { field: 'price' },
//   { field: 'successful' },
//   { field: 'rocket' },
// ]);

const getStyles = computed(() => {
  const style = props.gridStyle;
  if (!style) return 'height: 200px';
  else style;
});

const getDefaultColDef = computed(() => {
  const defaultColDef = props?.defaultColDef ?? null;
  if (defaultColDef) {
    return defaultColDef;
  } else {
    return {};
  }
});
const getColumnDefs = computed(() => {
  const colDefs = props?.columnDefs ?? [];
  if (colDefs.length && colDefs[0].field) {
    return colDefs.filter((col: any) => {
      if (col.field) {
        return { field: col?.field };
      }
    });
  } else {
    return [];
  }
});

const fetchData = async (api = '') => {
  const url = props?.apiUrl ?? api;
  if (url) {
    const response = await fetch(url);
    return response.json();
  } else {
    return null;
  }
};

const getRowData = () => {
  return rowData;
};

const setRowData = async () => {
  rowData.value = await fetchData();
};

const setExternalApiData = async (refreshData: any) => {
  console.log(await refreshData);
  rowData.value = await refreshData;
};

const gridApi = ref<any>(null);

const onGridReady = (params: GridReadyEvent) => {
  console.log(params);
  gridApi.value = params.api;
};
const timeout = ref<any>(undefined);
watch(
  () => props.apiUrl,
  async (api: string) => {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(async () => {
      rowData.value = await fetchData(api);
    }, 1500);
  }
);
// Fetch data when the component is mounted
onMounted(async () => {
  rowData.value = await fetchData();
});

defineExpose({
  rowData,
  getRowData,
  setRowData,
  setExternalApiData,
});
</script>

<style scoped></style>
