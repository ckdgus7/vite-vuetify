<template>
  <div>
    <v-sheet v-bind="{ ...props.options.sheet }"></v-sheet>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
