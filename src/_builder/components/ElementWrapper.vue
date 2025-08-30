<template>
  <!-- @dragover.prevent="onDragOver" -->
  <div
    class="pa-1"
    :class="{ selected: isSelected, 'selected-outline': isSelected }"
    :data-builder-id="element.id"
    @click.stop="selectElement"
    @drop="onDrop"
    @dragover.prevent="onDragOver"
    @keydown.delete="removeElement"
    @contextmenu="(e) => onContextMenu(e)"
  >
    <!-- 그룹: CustomGroup(v-sheet)로 렌더 + slot에 재귀 렌더 -->
    <!-- == 'group' (CustomGroup.vue) -->
    <component
      v-if="element.type === 'group'"
      :is="getComponent"
      v-bind="element.props"
      :style="element.styles"
    >
      <ElementWrapper v-for="child in element.children" :key="child.id" :element="child" />
      <!-- 비어있을 때 가이드 텍스트 -->
      <div
        v-if="!element.children || element.children.length === 0"
        class="text-disabled text-caption d-flex align-center justify-center"
        style="height: 60px"
      >
        이 그룹에 컴포넌트를 드롭하세요
      </div>
    </component>
    <!-- 일반 요소 -->
    <template v-else>
      <div
        :style="getGroupStyles"
        :class="supportsVModel ? element.props.wrapClass : element.styles.wrapClass"
      >
        <!-- v-model을 지원하는 컴포넌트인 경우 -->
        <!-- <component
          v-if="supportsVModel"
          :is="getComponent"
          v-model="modelValue"
          v-bind="element.props"
          v-on="bindings"
          :style="element.styles"
          ref="formRef"
        /> -->

        <!-- v-model을 지원하지 않는 컴포넌트 -->
        <!-- <component
          v-else
          :is="getComponent"
          v-bind="element.props"
          v-on="bindings"
          :style="element.styles"
          ref="formRef"
        >
          {{ element.props?.text }}
        </component> -->
        <component
          :is="getComponent"
          v-model="modelValue"
          v-bind="element.props"
          v-on="bindings"
          :style="element.styles"
          ref="formRef"
        ></component>
      </div>
    </template>
    <!-- 우클릭 컨텍스트 메뉴 (my-carousel일 때만) -->
    <div ref="ctxTarget" :style="ctxTargetStyle"></div>
    <v-menu
      v-model="showCtx"
      :activator="ctxTarget"
      :close-on-content-click="false"
      location="bottom"
      offset="8"
    >
      <v-card min-width="320" max-width="420">
        <v-toolbar density="compact" title="이미지 선택 (my-carousel)" />
        <v-text-field
          v-model="q"
          class="px-4 pt-2"
          density="compact"
          clearable
          hide-details
          label="검색(이미지명)"
          prepend-inner-icon="mdi-magnify"
        />
        <v-divider />
        <v-virtual-scroll :items="filteredImages" width="500" height="500" item-height="56">
          <template #default="{ item }">
            <!-- <v-list-item
              :title="item.name"
              :subtitle="item.id"
              @click.stop="() => onPickImage(item.downloadUrl)"
            > -->
            <v-list-item :title="item.name" :subtitle="item.id">
              <template #prepend>
                <v-checkbox
                  v-model="selected"
                  :key="item.id"
                  :value="item.downloadUrl"
                ></v-checkbox>
                <v-avatar size="150" rounded="lg">
                  <v-img :src="item.downloadUrl" :alt="item.name" />
                </v-avatar>
              </template>
              <!-- <template #append>
                <v-btn
                  size="x-small"
                  variant="text"
                  icon="mdi-plus"
                  @click.stop="() => onPickImage(item.downloadUrl)"
                />
              </template> -->
            </v-list-item>
          </template>
        </v-virtual-scroll>
        <v-divider />
        <div class="d-flex justify-end pa-2">
          <v-btn color="success" @click.stop="saveImageMenu">등록</v-btn>
          <v-btn variant="text" @click.stop="closeImageMenu">닫기</v-btn>
        </div>
      </v-card>
    </v-menu>
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
import { useRoute } from 'vue-router';
import { router } from '@/router/index';
import { useImageStore } from '@/_builder/stores/imageStore';

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
          } else {
            selectElement();
          }
          registry.register(props.element.props.id, formRef.value);
        }, 500);
      }
    }
  },
  {
    deep: true,
    immediate: true,
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
const selectElement = () => {
  builder.selectElement(props.element.id);
};
const getComponent = computed(() => {
  const config = ComponentRegistry[props.element.type];
  return config ? config.component : 'CustomGroup';
});
const getGroupStyles = computed(() => {
  if (props.isPage) {
    // 페이지 렌더링 시 그룹 스타일을 제거
    return '';
  }
  return props.element.type === 'group' ? props.element.styles : {};
});
const onDrop = (e: DragEvent) => {
  e.stopPropagation(); // 중복 drop 방지
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

const removeElement = () => {
  if (builder.selectedElementId) {
    builder.removeElement(builder.selectedElementId);
    registry.unregister(builder.selectedElementId);
  } else {
    alert('요소를 선택해 주세요.');
  }
};
watchEffect(() => {
  // 페이지 렌더링 시 이벤트 실행
  // if (props.isPage) {
  const result: Record<string, Function> = {};
  if (props.element.events) {
    // for (const [eventName, eventData] of Object.entries(props.element.events)) {
    for (const evt of Object.entries(props.element.events)) {
      const e: any = evt;
      const eventName = e[0];
      const code = e[1].code;
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
            props,
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
          });
        } catch (e) {
          console.error(`이벤트 실행 오류 [${eventName}]`, e);
        }
      };
    }
  }
  // console.log('bindings', result);
  bindings.value = result;
  // }
});

/* --- 이미지 스토어 로딩 --- */
const imageStore = useImageStore();
onMounted(() => {
  if (!imageStore.items.length) imageStore.fetchAll();
});

/* --- 컨텍스트 메뉴 상태 --- */
const showCtx = ref(false);
const ctxX = ref(0);
const ctxY = ref(0);
const ctxTarget: any = ref<HTMLElement | null>(null);
const ctxTargetStyle: any = computed(() => ({
  position: 'fixed',
  left: ctxX.value + 'px',
  top: ctxY.value + 'px',
  width: '1px',
  height: '1px',
  zIndex: 1,
}));

const selected = ref([]);
const q = ref('');
const filteredImages = computed(() =>
  (imageStore.items || []).filter((it) =>
    !q.value ? true : it.name.toLowerCase().includes(q.value.toLowerCase())
  )
);

/* --- 우클릭 핸들러 --- */
function onContextMenu(e: MouseEvent) {
  // my-carousel에만 컨텍스트 메뉴 제공
  if (props.element?.type !== 'my-carousel') return;

  e.preventDefault();
  ctxX.value = e.clientX;
  ctxY.value = e.clientY;
  showCtx.value = true;
}

/* --- 이미지 선택 시: items[].src 자동 삽입 --- */
function onPickImage(url: string) {
  // builder.setCarouselImage(props.element.id, url, 'auto');
  closeImageMenu();
}

function saveImageMenu() {
  if (!selected.value.length) {
    alert('이미지를 선택 후 저장하세요');
    return;
  }
  const aaa: any = builder.findElementById(props.element.id!);
  selected.value.forEach((imageUrl: string, index: number) => {
    aaa.props.items[index].src = imageUrl;
  });
  closeImageMenu();
}
function closeImageMenu() {
  showCtx.value = false;
}
</script>
<style scoped>
.selected-outline {
  outline: 2px dotted red;
  outline-offset: -2px;
}
</style>
