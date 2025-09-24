<template>
  <!-- absolute 배치 요소 -->
  <vue3-draggable-resizable
    v-if="isAbsolute"
    :x="calcPx(element.position?.x, 'x')"
    :y="calcPx(element.position?.y, 'y')"
    :w="calcPx(element.position?.w, 'w')"
    :h="calcPx(element.position?.h, 'h')"
    :parent="true"
    :active="true"
    :draggable="true"
    :resizable="true"
    @dragging="(left: any, top: any) => updatePosition(element.id, left, top)"
    @resizing="
      (left: any, top: any, width: any, height: any) =>
        updateSize(element.id, left, top, width, height)
    "
  >
    <component :is="getComponent" v-bind="element.props" :style="element.styles" />
  </vue3-draggable-resizable>
  <div
    v-else
    class="pa-1"
    :class="{ selected: isSelected, 'selected-outline': isSelected }"
    :data-builder-id="element.id"
    @click.stop="selectElement"
    @drop="onDrop"
    @dragover.prevent="onDragOver"
    @keydown.delete="removeElement"
    @contextmenu.prevent="(e) => onContextMenu(e)"
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
        style="height: auto"
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
    <!-- 마우스 위치에 생성하는 가상 activator -->
    <div
      ref="menuActivator"
      class="fixed pointer-events-none"
      :style="menuActivatortStyle"
      aria-hidden="true"
    ></div>

    <!-- 컨텍스트 메뉴 -->
    <v-menu
      v-model="menuOpen"
      :activator="menuActivator"
      :close-on-content-click="false"
      location="bottom start"
      transition="fade-transition"
      :open-on-hover="false"
      offset="8"
    >
      <v-list density="compact" min-width="240">
        <v-list-subheader class="text-caption">Actions</v-list-subheader>

        <v-list-item
          prepend-icon="mdi-select-group"
          title="그룹으로 감싸기"
          @click="() => emitWrapInGroup()"
        />
        <v-divider />

        <v-list-item prepend-icon="mdi-arrow-up" title="요소 위로" @click="() => emitMove('up')" />
        <v-list-item
          prepend-icon="mdi-arrow-down"
          title="요소 아래로"
          @click="() => emitMove('down')"
        />
        <v-divider />

        <v-list-item prepend-icon="mdi-cog" title="옵션 수정" @click="() => emitEditOptions()" />
        <v-list-item
          prepend-icon="mdi-code-json"
          title="JSON으로 보기"
          @click="() => emitJsonView()"
        />
        <v-list-item
          prepend-icon="mdi-upload"
          title="Upload JSON"
          @click="() => fileInput?.click()"
        />
        <v-list-item
          prepend-icon="mdi-download"
          title="Download JSON"
          @click="() => downloadJson()"
        />
        <v-divider />

        <v-list-item
          class="text-error"
          prepend-icon="mdi-delete"
          title="요소 삭제"
          @click="() => emitRemoveElement()"
        />
      </v-list>
      <!-- JSON 업로드용 hidden input -->
      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        class="hidden"
        @change="(e) => onUploadJson(e)"
      />
    </v-menu>
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
  inject,
} from 'vue';
import axios from 'axios';
import ElementWrapper from './ElementWrapper.vue';
import { ComponentRegistry } from '@/_builder/utils/componentMap';
import { useVmodel } from '@/_builder/utils/isVmodelElement';
import store from '@/_builder/stores/index';
import { useRoute } from 'vue-router';
import { router } from '@/router/index';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizablE.css';

const props = defineProps<{ element: any; isPage?: boolean; downloadFileName?: string }>();
const registry = store.useComponentRegistryStore();
const position = store.usePositionStore();
const formRef = ref();

const isAbsolute = computed(() => position.getPosition() === 'absolute');
watch(
  () => props.element,
  (val, oldVal) => {
    if (val) {
      if (props.element.id) {
        console.log(props.element.id);
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          // if (oldVal) {
          //   registry.unregister(props.element.props.id);
          // } else {
          //   selectElement();
          // }
          // registry.register(props.element.props.id, formRef.value);
          selectElement();
          if (!registry.get(props.element.id)) {
            registry.register(props.element.id, formRef.value);
          }
        }, 200);
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
  if (props.element.events.length) {
    // for (const [eventName, eventData] of Object.entries(props.element.events)) {
    // for (const evt of Object.entries(props.element.events)) {
    props.element.events.forEach((evt: any) => {
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
            element: props.element,
          });
        } catch (e) {
          console.error(`이벤트 실행 오류 [${eventName}]`, e);
        }
      };
    });
  }
  // console.log('bindings', result);
  bindings.value = result;
  // }
});

// ---- 컨텍스트 메뉴 상태 ----
const menuOpen = ref(false);
type MoveDir = 'up' | 'down';
const cursor = reactive({ x: 0, y: 0 });
const menuActivator: any = ref<HTMLElement | null>(null);
const menuActivatortStyle: any = computed(() => ({
  position: 'fixed',
  left: cursor.x + 'px',
  top: cursor.y + 'px',
  width: '1px',
  height: '1px',
  zIndex: 1,
}));

const emit = defineEmits<{
  (e: 'wrap-in-group', payload: { id: string }): void;
  (e: 'move', payload: { id: string; dir: MoveDir }): void;
  (e: 'edit-options', payload: { id: string }): void;
  (e: 'json-view', payload: { id: string; json: Record<string, any> }): void;
  (e: 'upload-json', payload: { id: string; json: Record<string, any> }): void;
  (e: 'download-json', payload: { id: string; json: Record<string, any> }): void;
  (e: 'remove-element'): void;
}>();

const onContextMenu = (e: MouseEvent) => {
  if (menuOpen.value) menuOpen.value = false;
  // 위치 기억 후 메뉴 오픈
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  // 다음 프레임에 열어 깜빡임 방지
  requestAnimationFrame(() => {
    menuOpen.value = true;
  });
};

// ---- 액션 emit 래퍼 ----
const emitWrapInGroup = () => emit('wrap-in-group', { id: builder.selectedElementId });
const emitMove = (dir: MoveDir) => emit('move', { id: builder.selectedElementId, dir });
const emitEditOptions = () => emit('edit-options', { id: builder.selectedElementId });
const emitJsonView = () =>
  emit('json-view', { id: builder.selectedElementId, json: props.element ?? {} });
const emitRemoveElement = () => emit('remove-element');

// ---- JSON 업로드/다운로드 ----
const fileInput = ref<HTMLInputElement | null>(null);

const onUploadJson = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    emit('upload-json', { id: builder.selectedElementId, json });
  } catch (err) {
    console.error('Invalid JSON file:', err);
  } finally {
    // 같은 파일 재업로드 가능하도록 reset
    if (fileInput.value) fileInput.value.value = '';
  }
};

const downloadJson = () => {
  try {
    const blob = new Blob([JSON.stringify(props.element ?? {}, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // a.download = props.downloadFileName || 'element.json'
    a.download = props.downloadFileName || 'element.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    emit('download-json', { id: builder.selectedElementId, json: props.element ?? {} });
  } catch (err) {
    console.error('Download failed:', err);
  }
};

/* --- 컨텍스트 메뉴 상태 --- */

/* --- 이미지 contextmenu 로직 --- */
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
import { useImageStore } from '@/_builder/stores/imageStore';
/* --- 이미지 스토어 로딩 --- */
const imageStore = useImageStore();
onMounted(() => {
  if (!imageStore.items.length) imageStore.fetchAll();
});
/* --- 이미지 conteextmenu 핸들러 --- */
function onImageContextMenu(e: MouseEvent) {
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

// absolute
const containerRef = inject<any>('canvasContainer');

// ✅ SNAP (%)
const SNAP = 10;

const updatePosition = (id: string, x: number, y: number) => {
  if (!containerRef?.value) return;
  const rect = containerRef.value.$el.getBoundingClientRect();

  let xPercent = (x / rect.width) * 100;
  let yPercent = (y / rect.height) * 100;

  xPercent = snapToGrid(xPercent);
  yPercent = snapToGrid(yPercent);

  builder.updateElement(id, {
    position: { ...getElementById(id)?.position, x: xPercent, y: yPercent, unit: '%' },
  });
};

const updateSize = (id: string, x: number, y: number, w: number, h: number) => {
  if (!containerRef?.value) return;
  const rect = containerRef.value.$el.getBoundingClientRect();

  let xPercent = (x / rect.width) * 100;
  let yPercent = (y / rect.height) * 100;
  let wPercent = (w / rect.width) * 100;
  let hPercent = (h / rect.height) * 100;

  xPercent = snapToGrid(xPercent);
  yPercent = snapToGrid(yPercent);
  wPercent = snapToGrid(wPercent);
  hPercent = snapToGrid(hPercent);

  builder.updateElement(id, {
    position: { x: xPercent, y: yPercent, w: wPercent, h: hPercent, unit: '%' },
  });
};

// 스냅 함수
const snapToGrid = (value: number) => {
  return Math.round(value / SNAP) * SNAP;
};

// store element 조회
const getElementById = (id: string) => builder.elements.find((el) => el.id === id);

// % 값을 px로 변환
const calcPx = (value?: number, type?: 'x' | 'y' | 'w' | 'h') => {
  if (value === undefined || !containerRef?.value) return 0;
  const rect = containerRef.value.$el.getBoundingClientRect();
  switch (type) {
    case 'x':
      return (value / 100) * rect.width;
    case 'w':
      return 0;
    // case 'w':
    //   return (value / 100) * rect.width;
    case 'y':
      return (value / 100) * rect.height;
    case 'h':
      return 0;
    default:
      return value;
  }
};
</script>
<style scoped>
.selected-outline {
  outline: 2px dotted red;
  outline-offset: -2px;
}
.relative {
  position: relative;
}
.hidden {
  display: none;
}
</style>
