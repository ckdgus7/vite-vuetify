<template>
  <div><v-textarea v-model="value" v-bind="{ ...props.options.textArea }"></v-textarea></div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
