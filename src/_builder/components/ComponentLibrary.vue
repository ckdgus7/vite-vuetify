<template>
  <v-card class="pa-2" elevation="2">
    <v-list dense>
      <v-list-item
        v-for="item in componentList"
        :key="item.type"
        @dragstart="(e: DragEvent) => onDragStart(e, item.type, item.label, item.styles)"
      >
        <div draggable="true" class="w-100">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
    <v-divider class="my-2" />
    <div>
      <v-btn color="primary" @click="openSaveDialog">화면 저장</v-btn>
      <SavePageDialog ref="saveDialogRef" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
import SavePageDialog from '@/_builder/components/SavePageDialog.vue';
import { ref } from 'vue';
const builder = useBuilderStore();
const exportsd = () => {
  console.log('Exporting...', builder);
  builder.exportToJsonFile('my-template.json');
};
const componentList = [
  { type: 'my-card', label: '카드' }, // 사용자 정의 컴포넌트
  { type: 'group', label: '그룹', styles: { border: '1px dashed #ccc', padding: '8px' } },
  { type: 'v-btn', label: 'button' },
  { type: 'v-text-field', label: 'input' },
  // { type: 'v-combobox', label: 'combobox' },
  // { type: 'v-checkbox', label: 'checkbox' },
  // { type: 'v-radio-group', label: 'radio' },
  // { type: 'v-textarea', label: 'textarea' },
  // { type: 'v-switch', label: 'switch' },
  // { type: 'v-dialog', label: 'dialog' },
  // { type: 'v-tooltip', label: 'tooltip' },
  // { type: 'v-snackbar', label: 'snackbar' },
  // { type: 'v-alert', label: 'alert' },
  // { type: 'v-card', label: 'card' },
  // { type: 'v-tabs', label: 'tabs' },
  // { type: 'v-expansion-panels', label: 'expansion panels' },
  // { type: 'v-data-table', label: 'data table' },
  // { type: 'v-list', label: 'list' },
  // { type: 'v-treeview', label: 'treeview' },
  // { type: 'v-stepper', label: 'stepper' },
  // { type: 'v-pagination', label: 'pagination' },
  // { type: 'v-progress-circular', label: 'progress circular' },
  // { type: 'v-sheet', label: 'sheet' },
];

const onDragStart = (e: DragEvent, type: string, label: string, styles: any) => {
  e.dataTransfer?.setData('component-type', type);
  e.dataTransfer?.setData('component-label', label);
  e.dataTransfer?.setData('component-styles', JSON.stringify(styles || {}));
};
const saveDialogRef = ref();
const openSaveDialog = () => {
  saveDialogRef.value.dialog = true;
};
</script>
