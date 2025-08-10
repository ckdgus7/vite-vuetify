<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <div
          :style="{
            position: 'fixed',
            width: '15%',
            height: '85%',
            overflow: 'auto',
          }"
        >
          <ComponentLibrary />
        </div>
        <div :style="{ position: 'absolute', top: '90%', width: '230px', 'text-align': 'center' }">
          <v-btn color="primary" @click="openSaveDialog">화면 저장</v-btn>
          <SavePageDialog ref="saveDialogRef" />
        </div>
      </v-col>

      <v-col cols="8">
        <div :style="{ width: '100%', height: '90%' }">
          <CanvasArea />
        </div>
      </v-col>

      <v-col cols="2">
        <div :style="{ position: 'fixed', width: '15%', height: '85%', overflow: 'auto' }">
          <InspectorPanel />
        </div>
        <div :style="{ position: 'absolute', top: '88%', width: '230px', 'text-align': 'center' }">
          <v-btn class="mt-4" color="error" @click="removeElement">객체 삭제</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ComponentLibrary from '@/_builder/components/ComponentLibrary.vue';
import CanvasArea from '@/_builder/components/CanvasArea.vue';
import InspectorPanel from '@/_builder/components/InspectorPanel.vue';
import SavePageDialog from '@/_builder/components/SavePageDialog.vue';
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import store from '@/_builder/stores/index';

const registry = store.useComponentRegistryStore();

const saveDialogRef = ref();
const builder = useBuilderStore();

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
</script>
