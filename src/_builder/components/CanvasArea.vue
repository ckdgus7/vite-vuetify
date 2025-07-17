<template>
  <v-sheet
    id="builder-canvas"
    class="ma-4 pa-4"
    height="600"
    elevation="1"
    color="grey-lighten-4"
    @dragover.prevent
    @drop="onDrop"
  >
    <ElementWrapper v-for="el in elements" :key="el.id" :element="el" :data-builder-id="el.id" />
  </v-sheet>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { useElementSelector } from '@/_builder/composables/useElementSelector';

const builder = useBuilderStore();
const elements = builder.elements;

useElementSelector();

onMounted(() => {
  window.addEventListener('element-select', (e: Event) => {
    const id = (e as CustomEvent).detail.id;
    builder.selectElement(id);
  });
});

const onDrop = (e: DragEvent) => {
  const type = e.dataTransfer?.getData('component-type');
  if (type) {
    builder.addElement(type);
  }
};
</script>
