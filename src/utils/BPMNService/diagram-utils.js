import { compress, decompress } from "lz-string";
import blankDiagram from "../../assets/testXML/bpmn-blank";

export function openDiagram(modeler, diagramXml) {
  console.log(modeler);
  modeler.importXML(diagramXml, function(err) {
    if (!err) {
      alert(1);
      console.log("success!");
      //modeler.get('canvas').zoom('fit-viewport');
      console.log(modeler.get("canvas").zoom);
    } else {
      alert(2);
      console.log("something went wrong:", err);
    }
  });
}

export function openLocalDiagram(modeler) {
  let localDiagram = sessionStorage.getItem("diagram");
  let diagram = localDiagram ? decompress(localDiagram) : blankDiagram;
  return openDiagram(modeler, diagram);
}

export function resetDiagramToBlank(modeler) {
  return openDiagram(modeler, blankDiagram);
}

export function saveDiagram(modeler) {
  return new Promise(resolve => {
    modeler.saveXML({ format: true }, function(err, xml) {
      sessionStorage.setItem("diagram", compress(xml));
      resolve(getDownloadUrl(xml));
    });
  });
}

export function getDownloadUrl(xml) {
  return `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(xml)}`;
}

export function getBlankDiagramDownloadUrl() {
  return getDownloadUrl(blankDiagram);
}

export function parseBPMNJson({ rootElements }) {
  console.log(rootElements);
  const steps = rootElements
    .filter(el => el.$type === "bpmn:Process")
    .reduce((acc, curr) => curr.flowElements);

  /*.map(el => el.flowElements)
    .map(el => ({
      type: el.$type,
      name: el.name
    }))
    .forEach(console.log);
    */
  console.log(steps);
}
