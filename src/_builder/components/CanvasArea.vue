<template>
  <v-container
    ref="containerRef"
    class="canvas-container py-0 px-0"
    id="builder-canvas"
    color="grey-lighten-5"
    :style="{ minHeight: '580px' }"
    @dragover.prevent
    @drop="onDrop"
  >
    <!-- 스크롤 가능한 캔버스 -->
    <div class="canvas-scroll">
      <div class="canvas-content">
        <ElementWrapper
          v-for="element in elements"
          :key="element.id"
          :element="element"
          :data-builder-id="element.id"
          @removeElement="emit('removeElement')"
          @move="
            ({ id, dir }) =>
              dir === 'up' ? builder.moveElementUp(id) : builder.moveElementDown(id)
          "
          @wrap-in-group="({ id }) => builder.wrapInGroup(id, { elevation: 1, rounded: 'xl' })"
        />
        <div style="height: 100vh" class="pl-2"></div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, provide } from 'vue';
import ElementWrapper from '@/_builder/components/ElementWrapper.vue';
import store from '@/_builder/stores/index';
import { useElementSelector } from '@/_builder/composables/useElementSelector';

const emit = defineEmits(['removeElement']);
function runEmit() {
  emit('removeElement');
}
const builder = store.useBuilderStore();
const position = store.usePositionStore();
const elements = computed(() => builder.elements);

// const collection = store.useDataCollectionStore();
// 컬렉션 데이터 설정 (테스트는 임시 지정)
// collectionApi rest api 호출 후 store에 데이터 설정
// collection.setDataMap(elements);
// collection.setDataListMap(elements);

useElementSelector();

onMounted(() => {
  window.addEventListener('element-select', (e: Event) => {
    const id = (e as CustomEvent).detail.id;
    builder.selectElement(id);
  });
});

const containerRef = ref<any>(null);
const onDrop = (e: DragEvent) => {
  const type = e.dataTransfer?.getData('component-type') || '';
  const label = e.dataTransfer?.getData('component-label') || '무라벨';
  const cssClass = e.dataTransfer?.getData('component-class') || '';
  const styles = JSON.parse(e.dataTransfer?.getData('component-styles') || '{}');
  const props = JSON.parse(e.dataTransfer?.getData('component-props') || '{}');
  if (!type) return;

  if (type === 'group') {
    builder.addGroup(); // ← 그룹 v-sheet 생성
  } else {
    const rect = containerRef.value?.$el?.getBoundingClientRect?.();
    if (!rect) return;

    let xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    let yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    xPercent = snapToGrid(xPercent);
    yPercent = snapToGrid(yPercent);
    builder.addElement(type, label, styles, cssClass, props, position.getPosition(), {
      x: xPercent,
      y: yPercent,
      w: 20,
      h: 10,
      unit: '%',
    });
  }
};

// 하위 ElementWrapper에서 container 크기 참조 가능
provide('canvasContainer', containerRef);

// 스냅 함수
const snapToGrid = (value: number) => {
  return Math.round(value / 10) * 10;
};
</script>
<style lang="css" scoped>
.canvas-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 580px;
  /* padding-left: 28px;
  padding-top: 28px; */
  overflow: auto;
  background:
    linear-gradient(#fff, #fff) padding-box,
    #eee border-box;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
}

.canvas-content {
  position: relative;
  transform-origin: 0 0;
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px) 0 0 / 20px 20px,
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px) 0 0 / 20px 20px,
    #fff;
  box-shadow: inset 0 0 0 1px #f0f0f0;
}
.canvas-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px dashed #aaa;
  overflow: hidden;
}
</style>
