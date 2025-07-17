import {
  isTextAreaEntryEdited,
  TextAreaEntry
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

let getBusinessObject = import.meta.glob("bpmn-js/lib/util/ModelUtil").getBusinessObject;

export default function (element) {
  return [
    {
      id: "descripcion",
      element,
      component: Descripcion,
      isEdited: isTextAreaEntryEdited
    }
  ];
}

function Descripcion(props) {
  const { element, id } = props;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = (element) => {
    let bo = getBusinessObject(element);
    let value = bo.$attrs.descripcion;
    if (value) {
      return value;
    } else {
      return "";
    }
  };

  const setValue = (value) => {
    return modeling.updateProperties(element, {
      descripcion: value
    });
  };

  return (
    <TextAreaEntry
      id={id}
      element={element}
      label={translate("Descripcion")}
      getValue={getValue}
      setValue={setValue}
      debounce={debounce}
    />
  );
}
