<template>
  <div>
    <ag-grid-vue
      :theme="myTheme"
      :rowData="rowData"
      :columnDefs="getColumnDefs"
      :defaultColDef="getDefaultColDef"
      :style="getStyles"
      @grid-ready="onGridReady"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';
import { AgGridVue } from 'ag-grid-vue3'; // Vue Data Grid Component

import { AllCommunityModule, ModuleRegistry, themeBalham } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
// Mark all grids as using legacy themes
const myTheme = themeBalham.withParams({ accentColor: 'red' });
const props = defineProps([
  'apiUrl',
  'defaultColDef',
  'columnDefs',
  'gridStyle',
  'style',
  'dataListMapSchema',
]);
const rowData = ref<any[]>([]);

const dataStore = useDataCollectionStore();
watch(
  () => props.dataListMapSchema,
  (val: string) => {
    console.log(val);
    if (val) {
      const dataListMap: any = dataStore.getDataListMap(val);
      if (dataListMap) {
        // console.log(dataListMap);
        rowData.value = dataListMap.datas;
      }
    }
  },
  {
    deep: true,
  }
);
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
// [{ field: 'mission' }, { field: 'company' }, { field: 'location' }, { field: 'date' }, { field: 'price' }, { field: 'successful' }, { field: 'rocket' }]
const getStyles = computed(() => {
  const style = props.gridStyle;
  if (!style) return 'height: 200px';
  else style;
});

const getDefaultColDef = computed(() => {
  const defaultColDef = props?.defaultColDef ?? null;
  console.log(defaultColDef);
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
  // console.log(await refreshData);
  rowData.value = await refreshData;
};

const gridApi = ref<any>(null);

const onGridReady = (params: any) => {
  // console.log(params);
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
