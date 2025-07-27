<template>
  <table-lite
    :max-height="300"
    :is-loading="table.isLoading"
    :columns="table.columns"
    :rows="table.rows"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    :messages="table.messages"
    @do-search="doSearch"
    @is-finished="table.isLoading = false"
  ></table-lite>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import TableLite from 'vue3-table-lite/ts';

interface Data {
  id: number | string;
  name: string;
  email: string;
}
// Fake Data for 'asc' sortable
const sampleData1 = (offst: number, limit: number): Data[] => {
  offst = offst + 1;
  let data = [];
  for (let i = offst; i <= limit; i++) {
    data.push({
      id: i,
      name: 'TEST' + i,
      email: 'test' + i + '@example.com',
    });
  }
  return data;
};

// Fake Data for 'desc' sortable
const sampleData2 = (offst: number, limit: number): Data[] => {
  let data = [];
  for (let i = limit; i > offst; i--) {
    data.push({
      id: i,
      name: 'TEST' + i,
      email: 'test' + i + '@example.com',
    });
  }
  return data;
};

const table: any = reactive({
  isLoading: false,
  isReSearch: false,
  columns: [
    {
      label: 'ID',
      field: 'id',
      width: '3%',
      sortable: true,
      isKey: true,
    },
    {
      label: 'Name',
      field: 'name',
      width: '10%',
      sortable: true,
    },
    {
      label: 'Email',
      field: 'email',
      width: '15%',
      sortable: true,
    },
  ],
  rows: [],
  totalRecordCount: 0,
  sortable: {
    order: 'id',
    sort: 'asc',
  },
});

/**
 * Search Event
 */
const doSearch = (offset: number, limit: number, order: string, sort: string) => {
  table.isLoading = true;
  table.isReSearch = offset == undefined ? true : false;
  if (offset >= 10 || limit >= 20) {
    limit = 20;
  }
  if (sort == 'asc') {
    table.rows = sampleData1(offset, 500);
  } else {
    table.rows = sampleData2(offset, 500);
  }
  table.totalRecordCount = 20;
  table.sortable.order = order;
  table.sortable.sort = sort;
};

// First get data
onMounted(() => {
  doSearch(0, 20, 'id', 'asc');
});
</script>
