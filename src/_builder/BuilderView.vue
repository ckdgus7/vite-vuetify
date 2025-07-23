<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <div :style="{ position: 'fixed', width: '230px' }"><ComponentLibrary /></div>
      </v-col>

      <v-col cols="8">
        <CanvasArea />
      </v-col>

      <v-col cols="2">
        <div :style="{ position: 'fixed', width: '100%' }"><InspectorPanel /></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ComponentLibrary from '@/_builder/components/ComponentLibrary.vue';
import CanvasArea from '@/_builder/components/CanvasArea.vue';
import InspectorPanel from '@/_builder/components/InspectorPanel.vue';
</script>
