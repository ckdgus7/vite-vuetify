<template>
  <v-data-table
    :headers="headers"
    :items="rowData"
    v-bind="{ ...props }"
    density="compact"
    :style="props.style"
  ></v-data-table>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDataCollectionStore } from '@/_builder/stores/useDataCollectionStore';
const props = defineProps([
  'apiUrl',
  'density',
  'fixed-footer',
  'fixed-header',
  'height',
  'hide-default-body',
  'hide-default-footer',
  'hide-default-header',
  'hide-no-data',

  // 'items',
  'headers',
  'items-per-page',
  'loading',
  'sticky',
  'striped',
  'width',
  'dataListMapSchema',
  'style',
]);

const rowData = ref([
  {
    name: 'Fern',
    light: 'Low',
    height: '20cm',
    petFriendly: 'Yes',
    price: 20,
  },
]);
const headers = ref([
  { title: 'Plant', key: 'name' },
  { title: 'Light', key: 'light' },
  { title: 'Height', key: 'height' },
  { title: 'Pet Friendly', key: 'petFriendly' },
  { title: 'Price ($)', key: 'price' },
]);

const dataStore = useDataCollectionStore();
watch(
  () => props.dataListMapSchema,
  (val: string) => {
    console.log('props.dataListMapSchema', val);
    if (val) {
      const dataListMap: any = dataStore.getDataListMap(val);
      const headers = dataStore.getDataTableHeader(val);
      // console.log(headers);
      // console.log(dataListMap);
      if (dataListMap) {
        // console.log(dataListMap);
        headers.value = headers;
        console.log(headers.value);
        console.log(dataListMap.datas);
        rowData.value = dataListMap.datas;
      }
    }
  },
  {
    deep: true,
  }
);

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
