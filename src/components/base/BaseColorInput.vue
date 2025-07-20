<template>
  <div>
    <v-color-input v-model="value" v-bind="{ ...props.options.colorInput }"></v-color-input>
  </div>
</template>

<script setup lang="ts">
const value: any = defineModel('value');
const props = defineProps(['options']);
</script>
