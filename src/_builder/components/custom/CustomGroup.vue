<!-- @/_builder/components/custom/CustomGroup.vue -->
<template>
  <v-sheet
    :elevation="toNumber(props.elevation, 1)"
    :rounded="props.rounded ?? 'xl'"
    :color="props.color || undefined"
    :class="props.class || ''"
    :style="computedStyle"
  >
    <slot />
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * ElementWrapper에서 내려주는 element.props 를 모두 그대로 받습니다.
 * (componentMap의 group propsMeta와 호환)
 */
const props = defineProps([
  'width',
  'height',
  'border',
  'padding',
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'backgroundColor',
  'minHeight',
  'rounded',
  'color',
  'class',
  'elevation',
]);

const toNumber = (val: any, def = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
};

const computedStyle = computed(() => {
  // width/height/border/padding/background 등 스타일은 style로 전달
  const style: Record<string, any> = {
    width: props.width,
    height: props.height,
    border: props.border,
    padding: props.padding ?? '5px',
    display: props.display || 'block',
    flexDirection: props.flexDirection,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    gap: props.gap,
    backgroundColor: props.backgroundColor,
    // 캔버스 가독성 기본값
    minHeight: props.minHeight || '80px',
    boxSizing: 'border-box',
  };
  // falsy 제거
  Object.keys(style).forEach((k) => style[k] == null && delete style[k]);
  return style;
});
</script>
