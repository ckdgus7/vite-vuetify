<template>
  <div style="margin: 20px">
    <div>
      <h3>기본</h3>
      <BaseAgGrid
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :style="'height: 200px'"
      ></BaseAgGrid>
    </div>
    <!-- <pre>{{ search }}</pre> -->
    <div style="margin-top: 10px">
      <h3>커스텀</h3>
      <BaseAgGrid
        :rowData="rowData2"
        :columnDefs="columnDefs2"
        :defaultColDef="defaultColDef2"
        :onGridReady="onGridReady"
        :style="'height: 500px'"
      ></BaseAgGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import type {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HeaderClassParams,
} from 'ag-grid-community';
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

// Column Definitions: Defines the columns to be displayed.
const columnDefs = ref([
  { field: 'make' },
  { field: 'model' },
  { field: 'price' },
  { field: 'electric' },
]);
const columnDefs2 = ref<(ColDef | ColGroupDef)[]>([
  {
    headerName: 'Athlete Details',
    headerStyle: { color: 'white', backgroundColor: 'cadetblue' },
    children: [
      {
        field: 'athlete',
        headerStyle: { color: 'white', backgroundColor: 'teal' },
      },
      { field: 'age', initialWidth: 120 },
      {
        field: 'country',
        headerStyle: (params: HeaderClassParams) => {
          return {
            color: 'white',
            backgroundColor: params.floatingFilter ? 'cornflowerblue' : 'teal',
          };
        },
      },
    ],
  },
  {
    field: 'sport',
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerName: 'The Sport the athlete participated in',
    headerClass: 'sport-header',
  },
  {
    headerName: 'Medal Details',
    headerStyle: (params) => {
      return {
        color: 'white',
        backgroundColor: params.columnGroup?.isExpanded() ? 'cornflowerblue' : 'orangered',
      };
    },
    children: [
      { field: 'bronze', columnGroupShow: 'open' },
      { field: 'silver', columnGroupShow: 'open' },
      { field: 'gold', columnGroupShow: 'open' },
      {
        columnGroupShow: 'closed',
        field: 'total',
      },
    ],
  },
]);
const defaultColDef2 = ref<ColDef>({
  initialWidth: 200,
  floatingFilter: true,
  filter: true,
});
// Row Data: The data to be displayed.
const rowData2 = ref<any[]>([]);
const gridApi = shallowRef<GridApi | null>(null);
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;

  const updateData = (data: any) => (rowData2.value = data);

  fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    .then((resp) => resp.json())
    .then((data) => updateData(data));
};
</script>

<style scoped></style>
