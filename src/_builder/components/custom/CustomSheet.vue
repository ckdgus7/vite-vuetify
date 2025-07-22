<template>
  <div>
    <v-sheet :min-height="minHeight" :width="width" :color="color"></v-sheet>
  </div>
</template>

<script setup lang="ts">
// const props = defineProps(['attrs']);
defineProps<{
  minHeight: string;
  width: string;
  color: string;
}>();
</script>
