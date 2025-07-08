// composables/useBpmnViewer.ts
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';

export const useBpmnViewer = () => {
  let viewer: BpmnViewer | null = null

  const initViewer = async (container: HTMLElement, xml: string) => {
    viewer = new BpmnViewer({
      container,
    })

    await viewer.importXML(xml)
    const canvas: any = viewer.get('canvas')
    canvas.zoom('fit-viewport')
  }

  return {
    initViewer,
  }
}
