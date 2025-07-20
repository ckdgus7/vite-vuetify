<template>
  <div>
    <v-snackbar v-model="value" v-bind="{ ...props.options.snackbar }"></v-snackbar>
  </div>
</template>

<script setup lang="ts">
const value: any = defineModel('value');
const props = defineProps(['options']);
</script>
