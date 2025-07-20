<template>
  <div>
    <v-bottom-sheet>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" :text="props.options.btnText"></v-btn>
      </template>

      <v-card v-bind="{ ...props.options.body }"></v-card>
    </v-bottom-sheet>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['options']);
</script>
