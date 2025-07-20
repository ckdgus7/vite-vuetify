<template>
  <div>
    <v-btn v-bind="{ ...props.options.button }"></v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
