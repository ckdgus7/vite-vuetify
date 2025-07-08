// composables/useBpmnModeler.ts
import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';

export const useBpmnModeler = () => {
  let modeler: BpmnModeler | null = null

  const initModeler = (container: HTMLElement) => {
    modeler = new BpmnModeler({
      container,
      keyboard: { bindTo: document },
      moddleExtensions: {
        camunda: camundaModdle,
      },
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                      xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="true">
        <bpmn:startEvent id="StartEvent_1"/>
      </bpmn:process>
    </bpmn:definitions>`

    return modeler.importXML(xml)
  }

  const saveXml = async (): Promise<string | undefined> => {
    if (!modeler) throw new Error('모델러가 초기화되지 않았습니다.')
    const { xml } = await modeler.saveXML({ format: true })
    return xml
  }

  return {
    initModeler,
    saveXml,
  }
}
