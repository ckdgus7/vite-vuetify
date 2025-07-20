<template>
  <div>
    <v-file-upload v-model="value" v-bind="{ ...props.options.fileUpload }"></v-file-upload>
  </div>
</template>

<script setup lang="ts">
const value: any = defineModel('value');
const props = defineProps(['options']);
</script>
