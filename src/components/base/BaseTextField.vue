<template>
  <div><v-text-field v-model="value" v-bind="{ ...props.options.textField }"></v-text-field></div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
