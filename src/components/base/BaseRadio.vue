<template>
  <div>
    <v-radio-group v-model="value" v-bind="{ ...props.options.radioGroup }">
      <template v-for="(list, i) of props.options.items" :key="i">
        <v-radio v-bind="{ ...list }"></v-radio>
      </template>
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
const value = defineModel('value');
const props = defineProps(['options']);
</script>
