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
    <template v-else>
      <!-- v-model을 지원하는 컴포넌트인 경우 -->
      <component
        v-if="supportsVModel"
        :is="getComponent"
        v-model="modelValue"
        v-bind="element.props"
        v-on="parsedEvents"
        :style="element.styles"
      />

      <!-- v-model을 지원하지 않는 컴포넌트 -->
      <component
        v-else
        :is="getComponent"
        v-bind="element.props"
        v-on="parsedEvents"
        :style="element.styles"
      >
        {{ element.props?.text }}
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import ElementWrapper from './ElementWrapper.vue';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import { useVmodel } from '@/_builder/utils/isVmodelElement';
import { useFormStore } from '@/_builder/stores/useFormStore';
import { useRuntimeFunctions } from '@/_builder/composables/useRuntimeFunctions';

const props = defineProps<{ element: any; isPage?: boolean }>();
const formStore = useFormStore();
const builder = useBuilderStore();
const runtimeFns = useRuntimeFunctions();
// v-model 연동 지원 여부 확인
const supportsVModel = computed(() => useVmodel.includes(props.element.type));

const modelValue = computed({
  get: () => formStore.getValue(props.element.id),
  set: (val) => formStore.updateValue(props.element.id, val),
});
const isSelected = computed(() => builder.selectedElementId === props.element.id);
const selectElement = () => builder.selectElement(props.element.id);
const getComponent = computed(() => {
  const config = ComponentRegistry[props.element.type];
  return config ? config.component : 'div';
});
const getGroupStyles = computed(() => {
  if (props.isPage) {
    // 페이지 렌더링 시 그룹 스타일을 제거
    return '';
  }
  return props.element.styles || { border: '1px dashed #ccc', padding: '8px' };
});
const onDrop = (e: DragEvent) => {
  e.stopPropagation(); // ✅ 이벤트 전파 방지 (중복 drop 방지)
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

const parsedEvents = computed(() => {
  const result: Record<string, Function> = {};

  if (props.element.events) {
    for (const [event, code] of Object.entries(props.element.events)) {
      if (typeof code === 'string') {
        if (code in runtimeFns) {
          const fn = runtimeFns[code as keyof typeof runtimeFns];
          if (fn) {
            // apiUrl 정보 전달
            result[event] = () => fn(props.element);
          }
        } else {
          console.warn(`정의되지 않은 이벤트 함수: ${code}`);
        }
      } else if (typeof code === 'function') {
        result[event] = code;
      }
    }
  }

  return result;
});
</script>
