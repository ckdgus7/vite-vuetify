<template>
  <div>
    <v-number-input v-model="value" v-bind="{ ...props.options.numberInput }"></v-number-input>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<number>('value');
const props = defineProps(['options']);
</script>
