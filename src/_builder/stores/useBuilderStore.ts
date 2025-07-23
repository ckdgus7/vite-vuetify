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
}

export const useBuilderStore = defineStore('builder', () => {
  const elements = ref<ElementSchema[]>([]);
  const selectedElementId = ref<string | null>(null);

  function addElement(type: string, label: string, styles: Record<string, any>, cssClass: string) {
    elements.value.push({
      id: crypto.randomUUID(),
      type,
      label,
      styles,
      cssClass,
      props: {},
      children: [],
    });
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
        padding: '20px',
        border: '1px dashed gray',
      },
      cssClass: '',
      children: [],
    });
  }
  function addElementToGroup(groupId: string, type: string) {
    const group = elements.value.find((el) => el.id === groupId);
    if (!group || group.type !== 'group') return;

    group.children = group.children || [];
    group.children.push({
      id: crypto.randomUUID(),
      type,
      props: {},
      styles: {},
      cssClass: '',
    });
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

        if (el.type === 'grid-group' && Array.isArray(el.children)) {
          for (const cell of el.children) {
            const found = search(cell);
            if (found) return found;
          }
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

        if (el.type === 'grid-group' && Array.isArray(el.children)) {
          for (const cell of el.children) {
            if (removeFromList(cell)) return true;
          }
        }
      }

      return false;
    };

    removeFromList(elements.value);

    // 선택 해제 처리
    if (selectedElementId.value === id) {
      selectedElementId.value = null;
    }
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
  };
});
