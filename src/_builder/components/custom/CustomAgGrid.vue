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
import { ref } from 'vue';
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
// Row Data: The data to be displayed.
const rowData = ref([
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
]);

const getRowData = () => {
  return rowData;
};

const setRowData = () => {
  rowData.value = [
    { make: 'Toyota', model: 'Corolla', price: 64950, electric: true },
    { make: 'Tesla', model: 'Model Y', price: 33850, electric: false },
  ];
};

// Column Definitions: Defines the columns to be displayed.
const columnDefs = ref([
  { field: 'make' },
  { field: 'model' },
  { field: 'price' },
  { field: 'electric' },
]);
defineExpose({
  rowData,
  getRowData,
  setRowData,
});
</script>

<style scoped></style>
