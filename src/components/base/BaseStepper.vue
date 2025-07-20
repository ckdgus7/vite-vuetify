<template>
  <div>
    <v-stepper v-model="value" v-bind="{ ...props.options.stepper.wrap }">
      <v-stepper-header v-bind="{ ...props.options.stepper.header }">
        <template v-for="(item, i) in props.options.stepper.items" :key="i">
          <v-stepper-item v-bind="{ ...item }"></v-stepper-item>
          <v-divider v-if="i < props.options.stepper.items.length - 1"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
