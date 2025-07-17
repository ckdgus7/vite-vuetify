<template>
  <v-card class="pa-2" elevation="2">
    <v-list dense>
      <v-list-item
        v-for="item in componentList"
        :key="item.type"
        @dragstart="(e: DragEvent) => onDragStart(e, item.type)"
      >
        <div draggable="true" class="w-100">
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
const componentList = [
  { type: 'v-btn', label: '버튼2' },
  { type: 'v-text-field', label: 'input' },
  { type: 'my-card', label: '카드' }, // 사용자 정의 컴포넌트
];

const onDragStart = (e: DragEvent, type: string) => {
  console.log(3);
  e.dataTransfer?.setData('component-type', type);
};
</script>
