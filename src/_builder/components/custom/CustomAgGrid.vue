<template>
  <div style="margin: 20px">
    <BaseAgGrid
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :style="'height: 200px'"
    ></BaseAgGrid>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ColDef } from 'ag-grid-community';
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
import BaseAgGrid from '@/components/base/BaseAgGrid.vue';
const defaultColDef = ref<ColDef>({
  flex: 1,
  editable: true,
});

const rowData = ref<any[]>([]);

const columnDefs = ref<ColDef[]>([
  { field: 'mission' },
  { field: 'company' },
  { field: 'location' },
  { field: 'date' },
  { field: 'price' },
  { field: 'successful' },
  { field: 'rocket' },
]);

// Fetch data when the component is mounted
onMounted(async () => {
  rowData.value = await fetchData();
});

const fetchData = async () => {
  const response = await fetch('https://www.ag-grid.com/example-assets/space-mission-data.json');
  return response.json();
};

const getRowData = () => {
  return rowData;
};

const setRowData = () => {
  rowData.value = [
    { make: 'Toyota', model: 'Corolla', price: 64950, electric: true },
    { make: 'Tesla', model: 'Model Y', price: 33850, electric: false },
  ];
};

defineExpose({
  rowData,
  getRowData,
  setRowData,
});
</script>

<style scoped></style>
