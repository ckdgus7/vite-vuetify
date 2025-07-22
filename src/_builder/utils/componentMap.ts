// componentMap.ts
import MyCard from '@/_builder/components/custom/MyCard.vue'

export const ComponentRegistry: any = {
  'v-btn': {
    label: '버튼',
    component: 'v-btn',
    propsMeta: [
      { key: 'text', label: '버튼 텍스트', type: 'text' },
      { key: 'color', label: '색상', type: 'select', options: ['primary', 'secondary', 'success'] },
    ],
  },
  'v-text-field': {
    label: '텍스트필드',
    component: 'v-text-field',
    propsMeta: [{ key: 'clearable', label: 'Clearable', type: 'radio' }, { key: 'placeholder', label: 'Placeholder', type: 'text' }],
  },
  'group': {
    label: '그룹',
    component: 'group',
    propsMeta: [
      { key: 'display', label: 'Display', type: 'select', options: ['flex', 'grid', 'block'] },
      { key: 'flexDirection', label: 'Flex 방향', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
      { key: 'justifyContent', label: '가로 정렬 (justify)', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] },
      { key: 'alignItems', label: '세로 정렬 (align)', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch'] },
      { key: 'gap', label: '갭 (gap)', type: 'text' },
      { key: 'padding', label: '패딩 (padding)', type: 'text' },
      { key: 'backgroundColor', label: '배경색 (background color)', type: 'text' },
    ],
  },
        // <v-select
        //   v-model="selectedElement.styles.display"
        //   label="Display"
        //   :items="['flex', 'grid', 'block']"
        //   variant="outlined"
        // />

        // <v-select
        //   v-if="selectedElement.styles.display === 'flex'"
        //   v-model="selectedElement.styles.flexDirection"
        //   label="Flex 방향"
        //   :items="['row', 'column', 'row-reverse', 'column-reverse']"
        //   variant="outlined"
        // />

        // <v-select
        //   v-if="selectedElement.styles.display === 'flex'"
        //   v-model="selectedElement.styles.justifyContent"
        //   label="가로 정렬 (justify)"
        //   :items="['flex-start', 'center', 'flex-end', 'space-between', 'space-around']"
        //   variant="outlined"
        // />

        // <v-select
        //   v-if="selectedElement.styles.display === 'flex'"
        //   v-model="selectedElement.styles.alignItems"
        //   label="세로 정렬 (align)"
        //   :items="['flex-start', 'center', 'flex-end', 'stretch']"
        //   variant="outlined"
        // />

        // <v-text-field
        //   v-model="selectedElement.styles.gap"
        //   label="갭 (gap: 8px 등)"
        //   variant="outlined"
        // />

        // <v-text-field
        //   v-model="selectedElement.styles.padding"
        //   label="패딩 (예: 12px)"
        //   variant="outlined"
        // />

        // <v-text-field
        //   v-model="selectedElement.styles.backgroundColor"
        //   label="배경색 (예: #eee)"
        //   variant="outlined"
        // />
  'my-card': {
    label: '카드',
    component: MyCard,
    propsMeta: [
      { key: 'title', label: '제목', type: 'text' },
      { key: 'content', label: '내용', type: 'textarea' },
      { key: 'color', label: '배경색', type: 'select', options: ['primary', 'info', 'warning'] },
    ],
  },
}
