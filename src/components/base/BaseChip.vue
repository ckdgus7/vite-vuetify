<template>
  <div>
    <v-chip v-bind="{ ...props.options.chip }">
      <v-icon v-bind="{ ...props.options.icon }"></v-icon>
    </v-chip>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
