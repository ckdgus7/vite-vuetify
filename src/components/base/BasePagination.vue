<template>
  <div>
    <v-pagination v-model="value" v-bind="props.options.pagination"></v-pagination>
  </div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
