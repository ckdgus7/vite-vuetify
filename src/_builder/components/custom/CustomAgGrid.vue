<template>
  <div style="margin: 20px">
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="getColumnDefs"
      :defaultColDef="props.defaultColDef"
      :style="props.style || 'height: 200px'"
      @grid-ready="getOnGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
// import type { ColDef } from 'ag-grid-community';
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  // ValidationModule,
} from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  // ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);
const props = defineProps(['apiUrl', 'defaultColDef', 'columnDefs', 'style', 'onGridReady']);
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
const getOnGridReady = computed(() => {
  const func = props?.onGridReady ?? function () {};
  return func;
});
const getColumnDefs = computed(() => {
  const colDefs = props?.columnDefs ?? [];
  if (colDefs.length) {
    return colDefs.map((col: string) => {
      return { field: col };
    });
  } else {
    [{}];
  }
});

const fetchData = async () => {
  const url = props?.apiUrl ?? '';
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

// Fetch data when the component is mounted
onMounted(async () => {
  rowData.value = await fetchData();
});

defineExpose({
  rowData,
  getRowData,
  setRowData,
});
</script>

<style scoped></style>
