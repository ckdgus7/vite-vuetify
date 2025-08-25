<template>
  <v-container>
    <v-card class="pa-6" elevation="3" max-width="900" mx="auto">
      <v-form @submit.prevent="handleSubmit" ref="formRef" class="d-flex flex-column gap-5">
        <v-text-field
          v-model="form.name"
          label="템플릿 명"
          required
          variant="outlined"
          color="primary"
        />

        <v-combobox
          v-model="form.tags"
          label="태그"
          multiple
          chips
          clearable
          variant="outlined"
          color="primary"
        />

        <v-textarea
          v-model="form.description"
          label="상세 내용"
          rows="4"
          variant="outlined"
          color="primary"
        />

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
          <v-col cols="12" md="6">
            <v-btn
              type="button"
              color="primary"
              block
              class="mt-4"
              @click="() => router.push('/admin/diagram/bpmn')"
            >
              목록
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useTemplateDB, type TemplateModel } from '@/composables/sample/useBpmnDB';
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formRef = ref();
const modeler = ref<any>(null);
const form = ref<TemplateModel>({
  name: '',
  tags: [],
  description: '',
  xml: '',
});

const init = () => {
  const canvasContainer = document.getElementById('canvas') as HTMLDivElement;
  modeler.value = new Modeler({
    x: 100,
    container: canvasContainer,
    // propertiesPanel: {
    //   parent: '#properties',
    // },
    // additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
    // // needed if you'd like to maintain camunda:XXX properties in the properties panel
    // moddleExtensions: {
    //   camunda: camundaModdleDescriptor,
    // },
  });

  // this.modeler.on('element.changed', function (event) {
  //   let element = event.element;
  //   if (event.gfx) {
  //     console.log(event.gfx.textContent);
  //   }
  //   // the element got changed by the users
  // });

  // let self = this;
  // this.modeler.on('commandStack.changed', () => {
  //   var definitions = modeler.get('canvas').getRootElement().businessObject.$parent;
  //   parseBPMNJson(definitions);
  //   // console.log(JSON.stringify(definitions));
  //   saveDiagram(modeler).then((url) => {
  //     self.diagramUrl = url;
  //   });
  //   modeler.saveSVG(function (err, svg) {
  //     self.svgUrl = `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  //   });
  // });
  createNewDiagram();
};
const createNewDiagram = async () => {
  // Convierte la cadena en un gráfico y muéstralo
  try {
    const result = await modeler.value.importXML(xml);
    //this.addEventBusListener();
    //this.addBpmnListener();
    //const { warnings } = result;
    //console.log(warnings);
  } catch (err: any) {
    console.log(err.message, err.warnings);
  }
};
const resetDiagram = (ev: Event) => {
  ev.preventDefault();
  // this.modeler = null;
  createNewDiagram();
};
onMounted(async () => {
  init();
});
const saveXml = async (): Promise<string> => {
  if (!modeler) throw new Error('모델러가 초기화되지 않았습니다.');
  const { xml } = await modeler.value.saveXML({ format: true });
  return xml;
};
const saveTemplate = async () => {
  const db = await useTemplateDB();
  await db.add(form.value);
  router.push('/admin/diagram/bpmn');
};
const handleSubmit = async () => {
  // Handle form submission
  // save code
  const xml = await saveXml();
  form.value.xml = xml;
  // console.log(form.value);
  saveTemplate();
};
</script>
<style scoped>
.canvas {
  width: 100%;
  height: 90vh;
  border: 1px solid #ccc;
}
</style>
