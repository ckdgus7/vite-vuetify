<template>
  <v-dialog v-model="visible" :width="props.width" :persistent="props.persistent">
    <v-card>
      <v-card-title>
        {{ props.title }}
        <v-spacer />
        <v-btn icon @click="() => (visible = false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  width?: string;
  persistent?: boolean;
  title: string;
  element?: any;
}>();
const visible = defineModel<boolean>('visible');
</script>
