<template>
  <div>
    <v-btn v-bind="{ ...props.attrs }"></v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['attrs']);
</script>
