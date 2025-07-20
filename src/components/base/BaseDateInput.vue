<template>
  <div>
    <v-date-input v-model="value" v-bind="{ ...props.options.dateInput }"></v-date-input>
  </div>
</template>

<script setup lang="ts">
const value: any = defineModel('value');
const props = defineProps(['options']);
</script>
