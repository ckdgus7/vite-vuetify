<template>
  <div
    class="pa-2"
    :class="{ selected: isSelected }"
    :data-builder-id="element.id"
    @click.stop="selectElement"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
  >
    <!-- 그룹일 경우 내부 요소 재귀 렌더링 -->
    <div v-if="element.type === 'group'" :style="getGroupStyles">
      <ElementWrapper v-for="child in element.children" :key="child.id" :element="child" />
      <!-- <div class="text-disabled text-center text-caption pa-2">
        이 영역에 컴포넌트를 드래그하여 추가
      </div> -->
    </div>

    <!-- 일반 요소 -->
    <component v-else :is="element.type" v-bind="element.props" :style="element.styles">
      {{ element.props?.text || '' }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import ElementWrapper from './ElementWrapper.vue';

const props = defineProps<{ element: any; isPage?: boolean }>();
const builder = useBuilderStore();

const isSelected = computed(() => builder.selectedElementId === props.element.id);
const selectElement = () => builder.selectElement(props.element.id);

const getGroupStyles = computed(() => {
  if (props.isPage) {
    // 페이지 렌더링 시 그룹 스타일을 제거
    return '';
  }
  return props.element.styles || { border: '1px dashed #ccc', padding: '8px' };
});
const onDrop = (e: DragEvent) => {
  e.stopPropagation(); // ✅ 이벤트 전파 방지 (중복 drop 방지)
  console.log(e.dataTransfer?.getData('styles'));
  const type = e.dataTransfer?.getData('component-type');
  if (props.element.type === 'group' && type) {
    builder.addElementToGroup(props.element.id, type);
  }
};
const onDragOver = (e: DragEvent) => {
  if (props.element.type === 'group') {
    e.dataTransfer!.dropEffect = 'copy';
  }
};
</script>
