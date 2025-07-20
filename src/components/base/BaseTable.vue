<template>
  <v-table>
    <thead>
      <tr>
        <template v-for="(item, i) in props.options.headerItems" :key="i">
          <th v-bind="{ ...item }">
            {{ item.title }}
          </th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, i) in props.options.bodyItems" :key="i">
        <tr>
          <template v-for="(headerItem, k) in props.options.headerItems" :key="k">
            <td>{{ item[headerItem.title] }}</td>
          </template>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
