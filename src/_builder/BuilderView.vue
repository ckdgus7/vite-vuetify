<template>
  <!-- BuilderView with left/right drawers -->
  <div class="builder-root">
    <!-- 상단 바 -->
    <v-app-bar density="comfortable" flat>
      <v-btn
        icon
        class="ml-2"
        :aria-label="'좌측 패널 열기/닫기'"
        @click="() => (leftOpen = !leftOpen)"
      >
        <v-icon>mdi-tune-variant</v-icon>
      </v-btn>
      <!-- <v-btn icon :aria-label="'좌측 패널 열기/닫기'" @click="() => (leftOpen = !leftOpen)">
        <v-icon>mdi-view-sidebar-outline</v-icon>
      </v-btn> -->

      <!-- <v-toolbar-title class="text-subtitle-1 font-weight-600">UI Builder</v-toolbar-title> -->

      <v-spacer />
      <!-- <v-divider vertical inset class="mx-2" /> -->
      <!-- <v-divider
        vertical
        :length="50"
        :thickness="4"
        class="mt-2 border-opacity-100"
        color="info"
      ></v-divider> -->
      <!-- 화면저장 -->
      <v-tooltip text="화면 저장">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-content-save" @click="openSaveDialog"></v-btn>
        </template>
      </v-tooltip>
      <!-- 요소삭제 -->
      <v-tooltip text="요소 삭제">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            color="error"
            icon="mdi-delete-outline"
            @click="removeElement"
          ></v-btn>
        </template>
      </v-tooltip>
      <!-- 데이터관리 -->
      <!-- <v-tooltip text="데이터관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-database-cog-outline" @click="openDataManager"></v-btn>
        </template>
      </v-tooltip> -->
      <!-- 스크립트관리 -->
      <v-tooltip text="화면 스크립트">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-script-text-outline"></v-btn>
        </template>
      </v-tooltip>

      <v-spacer />

      <!-- 메뉴관리 -->
      <v-tooltip text="사용자 관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-account" @click="openUserDialogOpen"></v-btn>
        </template>
      </v-tooltip>
      <!-- 메뉴관리 -->
      <v-tooltip text="메뉴 관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-view-list-outline"></v-btn>
        </template>
      </v-tooltip>
      <!-- 페이지관리 -->
      <v-tooltip text="페이지 관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-book-open-page-variant-outline"></v-btn>
        </template>
      </v-tooltip>
      <!-- 권한관리 -->
      <v-tooltip text="권한 관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-shield-account-outline"></v-btn>
        </template>
      </v-tooltip>
      <!-- 이미지관리 -->
      <v-tooltip text="이미지 관리">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-image-multiple-outline"
            @click="openImageDialogOpen"
          ></v-btn>
        </template>
      </v-tooltip>
      <!-- 파일관리 -->
      <v-tooltip text="파일 관리">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-folder-cog-outline" @click="openFileDialogOpen"></v-btn>
        </template>
      </v-tooltip>
      <!-- <v-btn variant="text" class="mr-2" @click="exportsd">
        <v-icon start>mdi-content-save</v-icon>
        렌터링 코드 다운로드
      </v-btn> -->
      <!-- <v-divider
        vertical
        :length="50"
        :thickness="4"
        class="mt-2 border-opacity-100"
        color="info"
      ></v-divider> -->

      <v-spacer />
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
    <!-- 데이터 관리 다이얼로그 -->
    <!-- <DataManagerDialog ref="dataManagerDialogRef" /> -->
    <!-- 사용자 관리 다이얼로그 -->
    <UserManageDialog v-model="showUserManager" />
    <!-- 이미지관리 다이얼로그 -->
    <ImageManagerDialog v-model="showImageManager" />
    <!-- 파일 관리 팝업 -->
    <FileManagerDialog v-model="showFileManager" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ComponentLibrary from '@/_builder/components/ComponentLibrary.vue';
import CanvasArea from '@/_builder/components/CanvasArea.vue';
import InspectorPanel from '@/_builder/components/InspectorPanel.vue';
import SavePageDialog from '@/_builder/components/SavePageDialog.vue';
import store from '@/_builder/stores/index';
// import DataManagerDialog from '@/_builder/components/dataManager/DataManagerDialog.vue';
import UserManageDialog from '@/_builder/components/userManager/UserManageDialog.vue';
import ImageManagerDialog from '@/_builder/components/imageManager/ImageManagerDialog.vue';
import FileManagerDialog from '@/_builder/components/fileManager/FileManagerDialog.vue';

// 좌/우 Drawer 상태
const leftOpen = ref(true);
const rightOpen = ref(true);
const leftMini = ref(false);
const rightMini = ref(false);
const leftWidth = ref(220);
const rightWidth = ref(300);

const saveDialogRef = ref();
const builder = store.useBuilderStore();
const registry = store.useComponentRegistryStore();
// const dataStore = store.useDataCollectionsStore();

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

// const exportsd = () => {
//   console.log('Exporting...', builder);
//   builder.exportToJsonFile('my-template.json');
// };

// const openDataManager = () => {
//   dataStore.open();
//   dataStore.activeTab = 'dataMap';
// };
const showUserManager = ref(false);
const openUserDialogOpen = () => {
  showUserManager.value = true;
};

const showImageManager = ref(false);
const openImageDialogOpen = () => {
  showImageManager.value = true;
};

const showFileManager = ref(false);
const openFileDialogOpen = () => {
  showFileManager.value = true;
};
</script>
