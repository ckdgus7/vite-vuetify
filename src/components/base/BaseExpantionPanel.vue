<template>
  <div>
    <v-expansion-panels v-model="value" v-bind="{ ...props.options.panel }">
      <v-expansion-panel
        v-for="(item, i) in props.options.items"
        :key="i"
        v-bind="{ ...item }"
      ></v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<boolean>('value');
const props = defineProps(['options']);
</script>
