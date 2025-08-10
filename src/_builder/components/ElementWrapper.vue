<template>
  <div
    class="pa-1"
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
      <div :class="supportsVModel ? element.props.wrapClass : element.styles.wrapClass">
        <!-- v-model을 지원하는 컴포넌트인 경우 -->
        <component
          v-if="supportsVModel"
          :is="getComponent"
          v-model="modelValue"
          v-bind="element.props"
          v-on="bindings"
          :style="element.styles"
          ref="formRef"
        />

        <!-- v-model을 지원하지 않는 컴포넌트 -->
        <component
          v-else
          :is="getComponent"
          v-bind="element.props"
          v-on="bindings"
          :style="element.styles"
          ref="formRef"
        >
          {{ element.props?.text }}
        </component>
      </div>
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
const formRef = ref();

watch(
  () => props.element,
  (val, oldVal) => {
    if (val) {
      if (props.element.props.id) {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          if (oldVal) {
            registry.unregister(props.element.props.id);
          }
          registry.register(props.element.props.id, formRef.value);
        }, 1000);
      }
    }
  },
  {
    deep: true,
  }
);
onUnmounted(() => {
  if (props.element.props.id) {
    registry.unregister(props.element.props.id);
  }
});
const formStore = store.useFormStore();
const builder = store.useBuilderStore();
const bindings = ref<Record<string, Function>>({});
// const runtimeFns = useRuntimeFunctions();
// v-model 연동 지원 여부 확인
const supportsVModel = computed(() => useVmodel.includes(props.element.type));

const modelValue = computed({
  get: () => {
    return formStore.getValue(props.element.props.id);
  },
  set: (val) => {
    formStore.setValue(props.element.props.id, val);
  },
});
const isSelected = computed(() => !props.isPage && builder.selectedElementId === props.element.id);
const selectElement = () => builder.selectElement(props.element.id);
const getComponent = computed(() => {
  const config = ComponentRegistry[props.element.type];
  console.log(config.component);
  return config ? config.component : 'div';
});
const getGroupStyles = computed(() => {
  if (props.isPage) {
    // 페이지 렌더링 시 그룹 스타일을 제거
    return '';
  }
  return props.element.styles || { border: '1px dashed #ccc', padding: '5px' };
});
const onDrop = (e: DragEvent) => {
  e.stopPropagation(); // ✅ 이벤트 전파 방지 (중복 drop 방지)
  const dropObj = {
    type: e.dataTransfer?.getData('component-type'),
    label: e.dataTransfer?.getData('component-label'),
    styles: e.dataTransfer?.getData('component-styles'),
    class: e.dataTransfer?.getData('component-class'),
    props: e.dataTransfer?.getData('component-props'),
  };
  if (props.element.type === 'group' && dropObj.type) {
    builder.addElementToGroup(props.element.id, props.element.type, dropObj);
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
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
            const fn = new AsyncFunction('event', 'context', code);
            // await fn(context, event) // ✅ await 가능
            // const fn = new Function('event', 'context', code);
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
