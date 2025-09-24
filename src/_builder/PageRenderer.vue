<template>
  <v-container fluid class="page-renderer">
    <component
      v-for="el in pageElements"
      :key="el.id"
      :style="getElementStyle(el)"
      :is="getComponent(el.type)"
      v-bind="el.props"
      v-on="bindingEvent(el)"
      class="render-element"
    >
      <!-- 그룹(children) 재귀 렌더링 -->
      <template v-if="el.children && el.children.length">
        <PageRenderer :elements="el.children" />
      </template>
    </component>
  </v-container>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  useTemplateRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  computed,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { getPageByPath } from '@/_builder/composables/useIdbPage';
import store from '@/_builder/stores/index';
import { runUserScript } from '@/_builder/utils/scriptRunner';
import type { ElementSchema } from '@/_builder/stores/useBuilderStore';
import { ComponentRegistry } from '@/_builder/utils/componentMap';

const pageElements = ref<ElementSchema[]>([]);
const router = useRouter();
const route = useRoute();

// ✅ route 변경 시 페이지 데이터 로드 + 스크립트 실행
watch(
  () => route.fullPath,
  async (fullPath: string) => {
    const page = await getPageByPath(fullPath);
    if (page) {
      try {
        pageElements.value = JSON.parse(page.schema);
        if (page.onMountedScript && page.onMountedScript.trim()) {
          await runUserScript(page.onMountedScript, {
            router,
            route,
            axios,
            store,
          });
        }
      } catch (err) {
        console.error('페이지 로드 실패:', err);
      }
    } else {
      console.warn('페이지 데이터 없음');
    }
  },
  { immediate: true }
);

const bindings = ref<Record<string, Function>>({});
const bindingEvent = (element: any) => {
  const result: Record<string, Function> = {};
  if (element.events.length) {
    // for (const [eventName, eventData] of Object.entries(props.element.events)) {
    // for (const evt of Object.entries(props.element.events)) {
    element.events.forEach((evt: any) => {
      const e: any = evt;
      const eventName = e.eventName;
      const code = e.code;
      // console.log(code);
      result[eventName] = (...args: any[]) => {
        try {
          const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
          const fn = new AsyncFunction('event', 'context', code);
          fn(args[0], {
            console,
            ref,
            reactive,
            watch,
            store,
            axios,
            useTemplateRef,
            onMounted,
            onBeforeMount,
            onBeforeUnmount,
            onUnmounted,
            computed,
            router,
            useRoute,
            element,
          });
        } catch (e) {
          console.error(`이벤트 실행 오류 [${eventName}]`, e);
        }
      };
    });
  }
  // console.log('bindings', result);
  bindings.value = result;
};

// ✅ style 계산
const getElementStyle = (el: ElementSchema): any => {
  if (el.layout === 'absolute' && el.position) {
    console.log(el.props);
    const unit = el.position.unit || '%';
    return {
      position: 'absolute',
      left: el.position.x + unit,
      top: el.position.y + unit,
      width: el.position.w || 20,
      height: el.position.h || 10,
    };
  }
  return { position: 'relative' };
};

// ✅ Vuetify 컴포넌트 매핑

const getComponent = (type: string) => {
  const config = ComponentRegistry[type];
  return config ? config.component : 'CustomGroup';
};
const resolveComponent = (type: string) => {
  switch (type) {
    case 'v-btn':
      return 'v-btn';
    case 'v-card':
      return 'v-card';
    case 'v-text-field':
      return 'v-text-field';
    case 'v-container':
      return 'v-container';
    default:
      return 'div';
  }
};
</script>

<style scoped>
.page-renderer {
  position: relative;
  width: 100%;
  min-height: 600px;
  background-color: #f8fafc;
}
.render-element {
  box-sizing: border-box;
}
</style>
