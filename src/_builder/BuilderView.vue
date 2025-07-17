<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <ComponentLibrary />
      </v-col>

      <v-col cols="7">
        <CanvasArea />
      </v-col>

      <v-col cols="3">
        <InspectorPanel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ComponentLibrary from '@/_builder/components/ComponentLibrary.vue';
import CanvasArea from '@/_builder/components/CanvasArea.vue';
import InspectorPanel from '@/_builder/components/InspectorPanel.vue';
</script>
