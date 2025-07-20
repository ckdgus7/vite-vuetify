<template>
  <div>
    <v-autocomplete v-model="value" v-bind="props.options.autocomplate"></v-autocomplete>
  </div>
</template>

<script setup lang="ts">
const value: any = defineModel('value');
const props = defineProps(['options']);
</script>
