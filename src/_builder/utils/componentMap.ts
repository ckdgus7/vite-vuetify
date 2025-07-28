// componentMap.ts
import MyCustomButton from '@/_builder/components/custom/CustomButton.vue';
import MyCard from '@/_builder/components/custom/MyCard.vue';
import MyAgGrid from '@/_builder/components/custom/CustomAgGrid.vue';
import MyCkEditor from '@/_builder/components/custom/CustomCkEditor.vue';
import MyPageTitle from '@/_builder/components/custom/CustomPageTitle.vue';
import MySubjectText from '@/_builder/components/custom/CustomSubjectText.vue';
import MyNoteBox from '@/_builder/components/custom/CustomNoteBox.vue';
export const ComponentRegistry: any = {
  'v-btn': {
    label: 'btn',
    component: 'v-btn',
    propsMeta: [
      { key: 'class', label: 'css class', type: 'text' },
      { key: 'text', label: '버튼 텍스트', type: 'text' },
      { key: 'color', label: '색상', type: 'select', options: ['primary', 'secondary', 'success'] },
      {
        key: 'style',
        label: '스타일',
        type: 'object',
        fields: [
          { key: 'width', label: '너비', type: 'text' },
          { key: 'height', label: '높이', type: 'text' }
        ],
      },
    ],
  },
  'v-text-field': {
    label: 'text-field',
    component: 'v-text-field',
    propsMeta: [
      { key: 'clearable', label: 'Clearable', type: 'radio' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      {
        key: 'style',
        label: '스타일',
        type: 'object',
        fields: [
          { key: 'width', label: '너비', type: 'text' },
          { key: 'min-height', label: '높이', type: 'text' }
        ]
      },
    ],
  },
  'v-textarea': {
    label: 'textarea',
    component: 'v-textarea',
    propsMeta: [
      { key: 'clearable', label: 'Clearable', type: 'radio' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
    ],
  },
  'v-combobox': {
    label: 'combobox',
    component: 'v-combobox',
    propsMeta: [
      // { key: 'items', label: 'item 목록', type: 'array', itemType: 'text' },
          { key: 'item-title', label: 'label', type: 'text' },
          { key: 'item-value', label: 'value', type: 'text' },
      {
        key: 'items',
        label: '옵션 목록',
        type: 'array',
        itemType: 'object',
        itemFields: [
          { key: 'aaa', label: '라벨', type: 'text' },
          { key: 'bbb', label: '값', type: 'text' },
        ]
      },
    ],
  },
  // { type: 'v-combobox', label: 'combobox' },
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
  group: {
    label: '그룹',
    component: 'group',
    propsMeta: [
      { key: 'width', label: 'width', type: 'text' },
      { key: 'height', label: 'height', type: 'text' },
      { key: 'display', label: 'Display', type: 'select', options: ['flex', 'grid', 'block'] },
      {
        key: 'flexDirection',
        label: 'Flex 방향',
        type: 'select',
        options: ['row', 'column', 'row-reverse', 'column-reverse'],
      },
      {
        key: 'justifyContent',
        label: '가로 정렬 (justify)',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      },
      {
        key: 'alignItems',
        label: '세로 정렬 (align)',
        type: 'select',
        options: ['flex-start', 'center', 'flex-end', 'stretch'],
      },
      { key: 'gap', label: '갭 (gap)', type: 'text' },
      { key: 'padding', label: '패딩 (padding)', type: 'text' },
      { key: 'backgroundColor', label: '배경색 (background color)', type: 'text' },
    ],
  },
  'my-note-box': {
    label: '노트박스',
    component: MyNoteBox,
    propsMeta: [
      { key: 'title', label: 'title', type: 'text' },
      { key: 'messageBefore', label: 'messageBefore', type: 'text' },
      { key: 'linkText', label: 'linkText', type: 'text' },
      { key: 'linkHref', label: 'linkHref', type: 'text' },
      { key: 'messageAfter', label: 'messageAfter', type: 'text' },
    ],
  },
  'my-card': {
    label: '카드',
    component: MyCard,
    propsMeta: [
      { key: 'title', label: '제목', type: 'text' },
      { key: 'content', label: '내용', type: 'textarea' },
      { key: 'color', label: '배경색', type: 'select', options: ['primary', 'info', 'warning'] },
    ],
  },
  'my-subject-text': {
    label: 'subject text',
    component: MySubjectText,
    propsMeta: [
      { key: 'title', label: '타이틀제목', type: 'text' },
      {
        key: 'icon',
        label: '아이콘',
        type: 'text',
      },
      {
        key: 'iconSize',
        label: '아이콘 크기',
        type: 'select',
        options: ['1', '2', '3', '4', '5'],
      },
      {
        key: 'size',
        label: '폰트 사이즈',
        type: 'select',
        options: ['sm', 'md', 'lg', 'xl'],
      },
      {
        key: 'weight',
        label: '폰트 두께',
        type: 'select',
        options: ['normal', 'medium', 'bold'],
      },
      {
        key: 'divider',
        label: '구분선',
        type: 'select',
        options: [true, false],
      },
    ],
  },
  'my-page-title': {
    label: 'Page Title',
    component: MyPageTitle,
    propsMeta: [
      { key: 'title', label: '페이지타이틀', type: 'text' },
      {
        key: 'breadcrumb',
        label: 'breadcrumb',
        type: 'text',
      },
    ],
  },
  'my-ag-grid': {
    label: 'AG GRid',
    component: MyAgGrid,
    propsMeta: [],
  },
  'my-ck-editor': {
    label: 'CKEditor',
    component: MyCkEditor,
    propsMeta: [],
  },
};
