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
      <!-- <component
        :is="getComponent"
        v-model="modelValue"
        v-bind="element.props"
        v-on="bindings"
        :style="element.styles"
      /> -->
      <!-- v-model을 지원하는 컴포넌트인 경우 -->
      <component
        v-if="supportsVModel"
        :is="getComponent"
        v-model="modelValue"
        v-bind="element.props"
        v-on="bindings"
        :style="element.styles"
        :ref="formRef"
      />

      <!-- v-model을 지원하지 않는 컴포넌트 -->
      <component
        v-else
        :is="getComponent"
        v-bind="element.props"
        v-on="bindings"
        :style="element.styles"
        :ref="formRef"
      >
        {{ element.props?.text }}
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watchEffect,
  reactive,
  watch,
  useTemplateRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  computed,
} from 'vue';
import axios from 'axios';
import ElementWrapper from './ElementWrapper.vue';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import { useVmodel } from '@/_builder/utils/isVmodelElement';
import store from '@/_builder/stores/index';

const props = defineProps<{ element: any; isPage?: boolean }>();
const registry = store.useComponentRegistryStore();
const formRef = ref(ComponentRegistry[props.element.type].component);

watch(
  () => props.element,
  (val) => {
    if (val) {
      if (props.element.props.exposeId) {
        // console.log('props.element.props.exposeId', props.element.props.exposeId);
        // console.log('formRef', formRef);
        const abc = setTimeout(() => {
          clearTimeout(abc);
          registry.register(props.element.props.exposeId, formRef);
          console.log('watch', props.element.props.exposeId);
          // console.log('formRef', formRef);
        }, 1000);
      }
    }
  },
  {
    deep: true,
  }
);
onUnmounted(() => {
  if (props.element.props.exposeId) {
    console.log('onUnmounted', props.element.props.exposeId);
    registry.unregister(props.element.props.exposeId);
  }
});
const formStore = store.useFormStore();
const builder = store.useBuilderStore();
const bindings = ref<Record<string, Function>>({});
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

watchEffect(() => {
  // 페이지 렌더링 시 이벤트 실행
  if (props.isPage) {
    const result: Record<string, Function> = {};
    if (props.element.events) {
      // for (const [eventName, eventData] of Object.entries(props.element.events)) {
      for (const evt of Object.entries(props.element.events)) {
        const e: any = evt;
        const eventName = e[0];
        const code = e[1].code;
        result[eventName] = (...args: any[]) => {
          try {
            const fn = new Function('event', 'context', code);
            fn(args[0], {
              console,
              ref,
              reactive,
              watch,
              props,
              store,
              axios,
              useTemplateRef,
              onMounted,
              onBeforeMount,
              onBeforeUnmount,
              onUnmounted,
              computed,
            });
          } catch (e) {
            console.error(`이벤트 실행 오류 [${eventName}]`, e);
          }
        };
      }
    }

    bindings.value = result;
  }
});
</script>
<style scoped>
.selected-outline {
  outline: 2px dotted red;
  outline-offset: -2px;
}
</style>
