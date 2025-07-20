<template>
  <div>
    <v-breadcrumbs :items="props.options.items" :divider="props.options.divider"></v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
