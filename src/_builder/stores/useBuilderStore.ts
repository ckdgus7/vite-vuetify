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
    const propsId = `v_${Date.now()}`;
    elements.value.push({
      id: crypto.randomUUID(),
      type,
      label,
      styles,
      cssClass,
      props: { ...props, id: propsId },
      children: [],
      events: {},
    });
    console.log(elements.value);
  }
  function saveSchema(): string {
    console.log(elements.value);
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
    // console.log(id);
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
      props: {
        elevation: 1, // v-sheet elevation
        rounded: 'xl', // v-sheet rounded
        color: undefined, // v-sheet color (선택)
      },
      styles: {
        padding: '8px',
        border: '1px dashed #bdbdbd',
        minHeight: '100px',
      },
      cssClass: '',
      children: [],
    });
  }

  function addElementToGroup(groupId: string, _groupType: string, dropObj: any) {
    // 1) 그룹 찾기 (루트/자식 트리 재귀 탐색)
    const findById = (list: any[], id: string): any | null => {
      for (const el of list) {
        if (el.id === id) return el;
        if (Array.isArray(el.children) && el.children.length) {
          const found = findById(el.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const group = findById(elements.value as any[], groupId);
    if (!group || group.type !== 'group') return;

    // 2) payload 정규화
    let styles: any = {};
    let props: any = {};
    try {
      styles = JSON.parse(dropObj.styles || '{}');
    } catch {}
    try {
      props = JSON.parse(dropObj.props || '{}');
    } catch {}

    // 3) 자식 요소 추가
    group.children = group.children || [];
    group.children.push({
      id: crypto.randomUUID(),
      type: dropObj.type,
      label: dropObj.label || '',
      styles: styles || {},
      cssClass: dropObj.class || '',
      props: { ...props },
      children: [],
      events: {},
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
      }
      return null;
    };

    return search(elements.value);
  }
  function updateSelectedElement(id: string, updateElementObject: ElementSchema) {
    let fEl: any = elements.value.find((el: ElementSchema) => el.id === id);
    fEl = { ...updateElementObject };
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
    updateSelectedElement,
  };
});
