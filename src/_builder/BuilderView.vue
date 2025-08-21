<template>
  <!-- BuilderView with left/right drawers -->
  <div class="builder-root">
    <!-- 상단 바 -->
    <v-app-bar density="comfortable" flat>
      <v-btn icon :aria-label="'좌측 패널 열기/닫기'" @click="() => (leftOpen = !leftOpen)">
        <v-icon>mdi-view-sidebar-outline</v-icon>
      </v-btn>

      <v-toolbar-title class="text-subtitle-1 font-weight-600">UI Builder</v-toolbar-title>

      <v-spacer />

      <v-btn variant="text" class="mr-2" @click="openSaveDialog">
        <v-icon start>mdi-content-save</v-icon>
        화면 저장
      </v-btn>
      <v-btn color="primary" @click="exportsd">렌터링 코드 다운로드</v-btn>
      <v-btn variant="text" color="error" @click="removeElement">
        <v-icon start>mdi-delete-outline</v-icon>
        선택 삭제
      </v-btn>

      <v-btn
        icon
        class="ml-2"
        :aria-label="'우측 패널 열기/닫기'"
        @click="() => (rightOpen = !rightOpen)"
      >
        <v-icon>mdi-tune-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 좌측 Drawer: ComponentLibrary -->
    <v-navigation-drawer
      v-model="leftOpen"
      :rail="leftMini"
      :width="leftWidth"
      location="left"
      class="border-e"
      elevation="1"
      floating
    >
      <div class="d-flex align-center justify-space-between px-3 py-2">
        <!-- <div class="text-caption text-medium-emphasis">Components</div> -->
        <div class="d-flex align-center">
          <v-btn icon size="small" class="mr-1" @click="() => (leftMini = !leftMini)">
            <v-icon>{{ leftMini ? 'mdi-arrow-collapse-right' : 'mdi-arrow-expand-left' }}</v-icon>
          </v-btn>
          <!-- <v-btn icon size="small" @click="() => (leftOpen = false)">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
        </div>
      </div>
      <v-divider />
      <ComponentLibrary class="px-2 py-2" />
    </v-navigation-drawer>

    <!-- 우측 Drawer: InspectorPanel -->
    <v-navigation-drawer
      v-model="rightOpen"
      :rail="rightMini"
      :width="rightWidth"
      location="right"
      class="border-s"
      elevation="1"
      floating
    >
      <div class="d-flex align-center justify-space-between px-3 py-2">
        <!-- <div class="text-caption text-medium-emphasis">Inspector</div> -->
        <div class="d-flex align-center">
          <v-btn icon size="small" class="mr-1" @click="() => (rightMini = !rightMini)">
            <v-icon>{{ rightMini ? 'mdi-arrow-collapse-left' : 'mdi-arrow-expand-right' }}</v-icon>
          </v-btn>
          <!-- <v-btn icon size="small" @click="() => (rightOpen = false)">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
        </div>
      </div>
      <v-divider />
      <InspectorPanel class="px-2 py-2" />
    </v-navigation-drawer>

    <!-- 중앙 캔버스 -->
    <v-main>
      <div class="pa-3 h-100 d-flex flex-column">
        <div class="flex-grow-1 rounded-lg elevation-1 bg-surface">
          <CanvasArea />
        </div>
      </div>
    </v-main>

    <!-- 저장 다이얼로그 -->
    <SavePageDialog ref="saveDialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ComponentLibrary from '@/_builder/components/ComponentLibrary.vue';
import CanvasArea from '@/_builder/components/CanvasArea.vue';
import InspectorPanel from '@/_builder/components/InspectorPanel.vue';
import SavePageDialog from '@/_builder/components/SavePageDialog.vue';
import store from '@/_builder/stores/index';

// 좌/우 Drawer 상태
const leftOpen = ref(true);
const rightOpen = ref(true);
const leftMini = ref(false);
const rightMini = ref(false);
const leftWidth = ref(320);
const rightWidth = ref(360);

const saveDialogRef = ref();
const builder = store.useBuilderStore();
const registry = store.useComponentRegistryStore();

const openSaveDialog = () => {
  saveDialogRef.value.dialog = true;
};

const removeElement = () => {
  if (builder.selectedElementId) {
    builder.removeElement(builder.selectedElementId);
    registry.unregister(builder.selectedElementId);
  } else {
    alert('요소를 선택해 주세요.');
  }
};

const exportsd = () => {
  console.log('Exporting...', builder);
  builder.exportToJsonFile('my-template.json');
};
</script>
