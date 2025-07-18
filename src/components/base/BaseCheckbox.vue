<template>
  <div v-for="(list, index) of props.checkList" :key="index">
    <v-checkbox v-model="selected" :label="list.label" :value="list.value"></v-checkbox>
  </div>
</template>

<script setup lang="ts">
const selected = defineModel('selected');
const props = defineProps(['checkList']);
</script>
