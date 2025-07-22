<template>
  <div><v-text-field v-bind="{ ...props.attrs }"></v-text-field></div>
</template>

<script setup lang="ts">
const props = defineProps(['attrs']);
</script>
