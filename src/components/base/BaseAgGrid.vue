<template>
  <div>
    <!-- The AG Grid component -->
    <ag-grid-vue
      :rowData="props.rowData"
      :columnDefs="props.columnDefs"
      :defaultColDef="props.defaultColDef"
      :style="style"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'; // Vue Data Grid Component

const props = defineProps(['style', 'defaultColDef', 'columnDefs', 'rowData', 'onGridReady']);

// const gridReday = () => (props.onGridReady ? props.onGridReady : null);
</script>
