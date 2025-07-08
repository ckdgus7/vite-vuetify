import props from "./parts/props";

import { is } from "bpmn-js/lib/util/ModelUtil";

const LOW_PRIORITY = 500;

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function PropertiesProvider(propertiesPanel, translate) {
  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  // @ts-ignore
  this.getGroups = function (element) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function (groups) {
      if (is(element, "bpmn:Task")) {
        groups.push(createGroup(element, translate));
      }

      return groups;
    };
  };

  // registration ////////

  // @ts-ignore
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

PropertiesProvider.$inject = ["propertiesPanel", "translate"];

// Create the custom group
function createGroup(element, translate) {
  // create a group called "Properties".
  const Group = {
    id: "property",
    label: translate("Properties"),
    entries: props(element)
  };

  return Group;
}
