<template>
  <v-card class="pa-2" elevation="2">
    <v-list dense>
      <v-list-item
        v-for="item in componentList"
        :key="item.type"
        @dragstart="
          (e: DragEvent) =>
            onDragStart(e, item.type, item.label, item.styles, item.cssClass, item.props)
        "
      >
        <div draggable="true" class="w-100">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useBuilderStore } from '@/_builder/stores/useBuilderStore';
interface CompList {
  type: string;
  label: string;
  cssClass?: string;
  styles?: Record<string, any>;
  props?: Record<string, any>;
}
const builder = useBuilderStore();
const exportsd = () => {
  console.log('Exporting...', builder);
  builder.exportToJsonFile('my-template.json');
};
const componentList: CompList[] = [
  {
    type: 'my-note-box',
    label: 'Note box',
    cssClass: '',
    styles: { border: '1px dashed #ccc', padding: '5px' },
  }, // CKEditor 컴포넌트
  {
    type: 'my-subject-text',
    label: 'Subject Text',
    cssClass: '',
    styles: { border: '1px dashed #ccc', padding: '5px' },
  }, // CKEditor 컴포넌트
  {
    type: 'my-page-title',
    label: 'Page Ttile',
    cssClass: '',
    styles: { border: '1px dashed #ccc', padding: '5px' },
  }, // CKEditor 컴포넌트
  {
    type: 'my-ck-editor',
    label: 'CKEditor',
    cssClass: '',
    styles: { border: '1px dashed #ccc', padding: '5px' },
  }, // CKEditor 컴포넌트
  {
    type: 'my-ag-grid',
    label: 'AG Grid',
    cssClass: '',
    styles: { border: '1px dashed #ccc', padding: '5px' },
  }, // AG Grid 컴포넌트
  // {
  //   type: 'my-card',
  //   label: 'Card',
  //   cssClass: '',
  //   styles: { border: '1px dashed #ccc', padding: '5px' },
  // }, // 사용자 정의 컴포넌트
  { type: 'group', label: '그룹', styles: { border: '1px dashed #ccc', padding: '5px' } },
  { type: 'v-btn', label: 'button', props: { text: '버튼1', color: 'success' } },
  // { type: 'v-btn', label: 'button' },
  { type: 'v-text-field', label: 'input' },
  { type: 'v-textarea', label: 'textarea' },
  { type: 'v-combobox', label: 'combobox' },
  // { type: 'v-checkbox', label: 'checkbox' },
  // { type: 'v-radio-group', label: 'radio' },
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

const onDragStart = (
  e: DragEvent,
  type: string,
  label: string,
  styles: any,
  cssClass: any,
  props: any
) => {
  e.dataTransfer?.setData('component-type', type);
  e.dataTransfer?.setData('component-label', label);
  e.dataTransfer?.setData('component-styles', JSON.stringify(styles || {}));
  e.dataTransfer?.setData('component-class', cssClass);
  e.dataTransfer?.setData('component-props', JSON.stringify(props || {}));
};
</script>
