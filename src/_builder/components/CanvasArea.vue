<template>
  <v-sheet
    id="builder-canvas"
    height="auto"
    elevation="1"
    color="grey-lighten-2"
    :style="{ minHeight: '580px' }"
    @dragover.prevent
    @drop="onDrop"
  >
    <draggable :list="elements" itemKey="id" :component-data="{ name: 'fade' }">
      <template #item="{ element }">
        <ElementWrapper :key="element.id" :element="element" :data-builder-id="element.id" />
      </template>
    </draggable>
    <div style="height: 50px" class="pl-2"></div>
  </v-sheet>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { useElementSelector } from '@/_builder/composables/useElementSelector';
import draggable from 'vuedraggable';
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
  const label = e.dataTransfer?.getData('component-label') || '무라벨';
  const cssClass = e.dataTransfer?.getData('component-class') || '';
  const styles = JSON.parse(e.dataTransfer?.getData('component-styles') || '{}');
  const props = JSON.parse(e.dataTransfer?.getData('component-props') || '{}');
  if (!type) return;

  if (type === 'group') {
    builder.addGroup();
  } else {
    builder.addElement(type, label, styles, cssClass, props);
  }
  // builder.addElement(type);
};
</script>
