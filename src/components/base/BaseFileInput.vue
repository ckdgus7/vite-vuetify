<template>
  <div>
    <v-file-input v-model="value" v-bind="{ ...props.options.fileInput }"></v-file-input>
  </div>
</template>
<script setup>
const value = defineModel('value');
const props = defineProps(['options']);
</script>
