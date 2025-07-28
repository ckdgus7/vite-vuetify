<template>
  <div
    class="pa-2"
    :class="{ selected: isSelected, 'selected-outline': isSelected }"
    :data-builder-id="element.id"
    @click.stop="selectElement"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
  >
    <!-- 그룹일 경우 내부 요소 재귀 렌더링 -->
    <div v-if="element.type === 'group'" :style="getGroupStyles">
      <ElementWrapper v-for="child in element.children" :key="child.id" :element="child" />
    </div>

    <!-- 일반 요소 -->
    <template v-else>
      <!-- v-model을 지원하는 컴포넌트인 경우 -->
      <component
        v-if="supportsVModel"
        :is="getComponent"
        v-model="modelValue"
        v-bind="element.props"
        v-on="bindings"
        :style="element.styles"
      />

      <!-- v-model을 지원하지 않는 컴포넌트 -->
      <component
        v-else
        :is="getComponent"
        v-bind="element.props"
        v-on="bindings"
        :style="element.styles"
      >
        {{ element.props?.text }}
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import ElementWrapper from './ElementWrapper.vue';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import { useVmodel } from '@/_builder/utils/isVmodelElement';
import { useFormStore } from '@/_builder/stores/useFormStore';
import { useEventCodeStorage } from '@/_builder/composables/useEventCodeStorage';

const props = defineProps<{ element: any; isPage?: boolean }>();
const formStore = useFormStore();
const builder = useBuilderStore();
const bindings = ref<Record<string, Function>>({});
const { getCode } = useEventCodeStorage();
// const runtimeFns = useRuntimeFunctions();
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
    builder.addElementToGroup(props.element.id, props.element.type, type);
  }
};
const onDragOver = (e: DragEvent) => {
  if (props.element.type === 'group') {
    e.dataTransfer!.dropEffect = 'copy';
  }
};

onMounted(async () => {
  const result: Record<string, Function> = {};
  if (props.element.events) {
    for (const [eventName] of Object.entries(props.element.events)) {
      const code = (await getCode(`${props.element.id}_${eventName}`)) || '';
      console.log(code);
      result[eventName] = (...args: any[]) => {
        try {
          const fn = new Function('event', 'context', code);
          fn(args[0], { console });
        } catch (e) {
          console.error(`이벤트 실행 오류 [${eventName}]`, e);
        }
      };
    }
  }

  bindings.value = result;
});
</script>
<style scoped>
.selected-outline {
  outline: 2px dotted red;
  outline-offset: -2px;
}
</style>
