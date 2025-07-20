<template>
  <div><v-switch v-model="value" v-bind="{ ...props.options.switch }"></v-switch></div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
