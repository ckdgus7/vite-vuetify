<template>
  <div>
    <v-combobox
      v-model="select"
      :items="props.items"
      :label="props.label"
      :multiple="multiple"
    ></v-combobox>
  </div>
</template>
<script setup>
import { computed } from 'vue';

const select = defineModel('select');
const props = defineProps(['items', 'label', 'multiple']);

const multiple = computed(() => {
  return props.multiple ? props.multiple : false;
});
</script>
