<template>
  <div>
    <v-file-input
      v-model="select"
      :label="props.label"
      :clearable="clearable"
      :multiple="multiple"
    ></v-file-input>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const select = defineModel('select');
const props = defineProps(['clearable', 'label', 'multiple']);

const clearable = computed(() => {
  return props.clearable ? props.clearable : false;
});
const multiple = computed(() => {
  return props.multiple ? props.multiple : false;
});
</script>
