<template>
  <v-container :style="props.style">
    <v-card class="pa-6" elevation="3" max-width="900" mx="auto">
      <v-form @submit.prevent="handleSubmit" ref="formRef" class="d-flex flex-column gap-5">
        <div>
          <div class="text-subtitle-1 font-weight-medium mb-2">
            다이어그램 편집기(
            <a v-on:click="resetDiagram">Reset Diagram</a>
            )
          </div>
          <div class="canvas" id="canvas" ref="canvas"></div>
          <div id="properties"></div>
        </div>
        <v-row class="d-flex align-center">
          <v-col cols="12" md="6">
            <v-btn type="submit" color="primary" block class="mt-4">저장</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import 'bpmn-js/dist/assets/diagram-js.css';
// import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import Modeler from 'bpmn-js/lib/Modeler';
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
// import style from 'bpmn-js/dist/assets/diagram-js.css'; // eslint-disable-line no-unused-vars
// import icons from 'bpmn-font/dist/css/bpmn-embedded.css'; // eslint-disable-line no-unused-vars
// // import '../assets/styles.css';
import xml from '@/assets/testXML/bpmn-blank';
import { onMounted, onBeforeUnmount, ref } from 'vue';

interface Props {
  style?: Record<string, any>;
}

const props = defineProps<Props>();
const formRef = ref();
const modeler = ref<any>(null);

const init = () => {
  const canvasContainer = document.getElementById('canvas') as HTMLDivElement;
  modeler.value = new Modeler({
    x: 100,
    container: canvasContainer,
    // propertiesPanel: {
    //   parent: '#properties',
    // },
    // additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
    // needed if you'd like to maintain camunda:XXX properties in the properties panel
    // moddleExtensions: {
    //   camunda: camundaModdleDescriptor,
    // },
  });

  modeler.value.createDiagram();
};
const resetDiagram = (ev: Event) => {
  modeler.value = null;
  modeler.value.createDiagram();
};
onMounted(async () => {
  init();
});
onBeforeUnmount(() => {
  modeler.value?.destroy();
});
const saveXml = async (): Promise<string> => {
  alert('미 구현');
  if (!modeler) throw new Error('모델러가 초기화되지 않았습니다.');
  const { xml } = await modeler.value.saveXML({ format: true });
  return xml;
};
const handleSubmit = async () => {
  // Handle form submission
  alert('미 구현');
  // save code
  // const xml = await saveXml();
};
</script>
<style scoped>
.canvas {
  width: 100%;
  height: 90vh;
  border: 1px solid #ccc;
}
</style>
