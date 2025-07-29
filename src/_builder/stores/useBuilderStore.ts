// stores/useBuilderStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface ElementSchema {
  id: string;
  type: string;
  label: string; // Optional, for display purposes
  props: Record<string, any>;
  styles: Record<string, any>;
  cssClass: string;
  children: any[]; // Optional, for nested elements
  events?: {
    [eventName: string]: {
      handlerName: string;
      code: string;
    };
  };
}

export const useBuilderStore = defineStore('builder', () => {
  const elements = ref<ElementSchema[]>([]);
  const selectedElementId = ref<string>('');

  function addElement(
    type: string,
    label: string,
    styles: Record<string, any>,
    cssClass: string,
    props: any
  ) {
    elements.value.push({
      id: crypto.randomUUID(),
      type,
      label,
      styles,
      cssClass,
      props: { ...props },
      children: [],
      events: {},
    });
    console.log(elements.value);
  }
  function saveSchema(): string {
    return JSON.stringify(elements.value, null, 2);
  }

  function loadSchema(json: string) {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        elements.value = parsed;
      }
    } catch (e) {
      console.error('Invalid JSON schema', e);
    }
  }
  function selectElement(id: string) {
    console.log(id);
    selectedElementId.value = id;
  }
  function exportToJsonFile(filename: string = 'builder-schema.json') {
    const json = saveSchema();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // 정리
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportToHtml(): string {
    return elements.value
      .map((el) => {
        const tag = el.type.replace('v-', ''); // 예: v-btn → btn
        const attrs = Object.entries(el.props || {})
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ');

        const style = Object.entries(el.styles || {})
          .map(([k, v]) => `${k}:${v}`)
          .join(';');

        const html = `<${tag} ${attrs} style="${style}">${el.props?.text || ''}</${tag}>`;
        return html;
      })
      .join('\n');
  }
  function addGroup() {
    elements.value.push({
      id: crypto.randomUUID(),
      type: 'group',
      label: '그룹',
      props: {},
      styles: {
        padding: '5px',
        border: '1px dashed gray',
      },
      cssClass: '',
      children: [],
    });
  }
  function addElementToGroup(groupId: string, groupType: string, type: string) {
    const el: any = elements.value;
    // console.log(el)
    const group = elements.value.find((el) => el.id === groupId);
    const group2 = el[0].children.find((el: any) => el.id === groupId);
    // console.log('group', group)
    // console.log('group2', group2)
    // console.log('groupType', groupType)
    // console.log('type', type)
    // if (!group || group.type !== 'group') return;

    // console.log('run');
    if (group) {
      group.children = group.children || [];
      group.children.push({
        id: crypto.randomUUID(),
        type,
        label: '그룹',
        props: {},
        styles: {
          padding: '5px',
          border: '1px dashed gray',
        },
        cssClass: '',
        children: [],
      });
    } else if (group2) {
      group2.children = group2.children || [];
      group2.children.push({
        id: crypto.randomUUID(),
        type,
        label: '그룹',
        props: {},
        styles: {
          padding: '5px',
          border: '1px dashed gray',
        },
        cssClass: '',
        children: [],
      });
    }
  }
  function findElementById(id: string): ElementSchema | null {
    const search = (list: ElementSchema[] | ElementSchema[][]): ElementSchema | null => {
      for (const el of list as ElementSchema[]) {
        if (!el) continue;
        if ('id' in el && el.id === id) return el;

        if (el.type === 'group' && Array.isArray(el.children)) {
          const found = search(el.children as ElementSchema[]);
          if (found) return found;
        }
      }
      return null;
    };

    return search(elements.value);
  }
  function removeElement(id: string) {
    const removeFromList = (list: ElementSchema[]): boolean => {
      const index = list.findIndex((el) => el.id === id);
      if (index !== -1) {
        list.splice(index, 1);
        return true;
      }

      for (const el of list) {
        if (el.type === 'group' && Array.isArray(el.children)) {
          if (removeFromList(el.children)) return true;
        }
      }

      return false;
    };

    removeFromList(elements.value);

    // 선택 해제 처리
    if (selectedElementId.value === id) {
      selectedElementId.value = '';
    }
  }
  function addEventToComponent(id: string, eventName: string, handlerName: string, code: string) {
    const target = elements.value.find((c) => c.id === id);
    if (!target) return;
    if (!target.events) target.events = {};
    target.events[eventName] = { handlerName, code };
  }

  return {
    elements,
    selectedElementId,
    addElement,
    selectElement,
    exportToJsonFile,
    exportToHtml,
    addGroup,
    saveSchema,
    loadSchema,
    addElementToGroup,
    findElementById,
    removeElement,
    addEventToComponent,
  };
});
