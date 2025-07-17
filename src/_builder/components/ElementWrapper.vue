<template>
  <div
    class="pa-2"
    :class="{ selected: isSelected }"
    :data-builder-id="element.id"
    @click.stop="selectElement"
  >
    <component :is="getComponent" v-bind="element.props" :style="element.styles">
      {{ element.props?.text || '' }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import { ComponentRegistry } from '@/_builder/utils/componentMap';

const props = defineProps<{ element: any }>();
const builder = useBuilderStore();

const isSelected = computed(() => builder.selectedElementId === props.element.id);
const selectElement = () => builder.selectElement(props.element.id);

const getComponent = computed(() => {
  return ComponentRegistry[props.element.type]?.component || 'div';
});
</script>
