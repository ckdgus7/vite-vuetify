<template>
  <div>
    <v-tabs v-model="value" v-bind="props.options.tabs">
      <template v-for="(item, i) in props.options.items" :key="i">
        <v-tab v-bind="{ ...item }"></v-tab>
      </template>
    </v-tabs>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<boolean>('value');
const props = defineProps(['options']);
</script>
