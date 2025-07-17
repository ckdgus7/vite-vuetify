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
    propsMeta: [{ key: 'label', label: 'Label', type: 'text' }],
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
}
