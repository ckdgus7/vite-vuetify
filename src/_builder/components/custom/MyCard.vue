<template>
  <v-card :color="color" class="pa-4">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>{{ content }}</v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
  color: string;
}>();
</script>
