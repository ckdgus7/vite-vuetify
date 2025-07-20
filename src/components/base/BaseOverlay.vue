<template>
  <v-overlay v-model="value" v-bind="{ ...props.options.overlay }"></v-overlay>
</template>

<script setup lang="ts">
const value = defineModel<boolean>('value');
const props = defineProps(['options']);
</script>
