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
      props: {},
      styles: {},
      // props: {
      //   elevation: 1, // v-sheet elevation
      //   rounded: 'xl', // v-sheet rounded
      //   color: undefined, // v-sheet color (선택)
      // },
      // styles: {
      //   padding: '8px',
      //   border: '1px dashed #bdbdbd',
      //   minHeight: '100px',
      // },
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
  // ---------- 스왑 기반 순서 이동 유틸 ----------
  type MoveDir = 'up' | 'down';

  /** 대상 id의 "형제 배열"과 index를 찾아 반환 (루트/중첩 group 모두 지원) */
  // function findParentAndIndex(
  //   targetId: string
  // ): { siblings: ElementSchema[]; index: number; parentId: string | null } | null {
  //   const walk = (
  //     arr: ElementSchema[],
  //     parentId: string | null
  //   ): { siblings: ElementSchema[]; index: number; parentId: string | null } | null => {
  //     for (let i = 0; i < arr.length; i++) {
  //       const node = arr[i];
  //       if (node?.id === targetId) return { siblings: arr, index: i, parentId };
  //       if (Array.isArray(node?.children) && node.children.length) {
  //         const hit = walk(node.children as ElementSchema[], node.id);
  //         if (hit) return hit;
  //       }
  //     }
  //     return null;
  //   };
  //   return walk(elements.value, null);
  // }

  /** in-place 스왑: splice 없이 O(1) */
  function swapInPlace<T>(arr: T[], i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  /** 공통 이동 함수 */
  function moveElement(id: string, dir: MoveDir): boolean {
    const loc = findParentAndIndex(id);
    if (!loc) return false;

    const { siblings, index } = loc;
    const next = dir === 'up' ? index - 1 : index + 1;
    if (next < 0 || next >= siblings.length) return false;

    // *** 핵심: 스왑만 수행 (재할당/재렌더 최소화) ***
    swapInPlace(siblings, index, next);
    return true;
  }

  // 컨텍스트메뉴에서 호출할 API
  const moveElementUp = (id: string) => moveElement(id, 'up');
  const moveElementDown = (id: string) => moveElement(id, 'down');

  // ---------- (추가) 그룹 래핑 관련 유틸 ----------
  type GroupProps = {
    elevation?: number | string;
    rounded?: string;
    color?: string;
    className?: string; // 추가 적용할 CSS 클래스
    minHeight?: string; // 시각적 드롭존 확보용
  };

  function isGroupNode(node: ElementSchema | null | undefined): boolean {
    return !!node && node.type === 'group';
  }

  /** 대상 id의 형제 배열과 index를 찾아 반환 (루트/중첩 group 모두 지원) */
  function findParentAndIndex(
    targetId: string
  ): { siblings: ElementSchema[]; index: number; parentId: string | null } | null {
    const dfs = (arr: ElementSchema[], parentId: string | null): any => {
      for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        if (node?.id === targetId) return { siblings: arr, index: i, parentId };
        if (Array.isArray(node?.children) && node.children.length) {
          const hit = dfs(node.children as ElementSchema[], node.id);
          if (hit) return hit;
        }
      }
      return null;
    };
    return dfs(elements.value, null);
  }

  /** 그룹 노드 생성 (v-sheet 기반) */
  function createGroupNode(children: ElementSchema[], opts?: GroupProps): ElementSchema {
    const {
      elevation = 1,
      rounded = 'xl',
      color = undefined,
      className = '',
      minHeight = '100px',
    } = opts || {};

    return {
      id: crypto.randomUUID(),
      type: 'group', // 렌더러에서 v-sheet로 해석
      label: '그룹',
      // props: { elevation, rounded, color },
      // styles: {
      //   padding: '8px',
      //   border: '1px dashed #bdbdbd',
      //   minHeight,
      // },
      props: {},
      styles: {},
      cssClass: className,
      children: [...children],
      events: {},
    };
  }
  // ---------- (추가) 단일 요소 그룹 래핑 ----------
  /**
   * targetId 요소를 동일한 부모/위치에서 "그룹 노드"로 치환하고,
   * 원 요소는 새 그룹의 children[0]으로 넣습니다.
   * 성공 시 새 그룹 id 반환.
   */
  function wrapElementWithGroup(targetId: string, groupProps?: GroupProps): string | null {
    const loc = findParentAndIndex(targetId);
    if (!loc) return null;

    const { siblings, index } = loc;
    const target = siblings[index];

    // 이미 group이면 중첩 생성 방지: 그대로 반환(원하면 허용 로직으로 변경 가능)
    if (isGroupNode(target)) return target.id;

    // *** 핵심: 배열 재구축 대신 해당 인덱스의 항목만 "치환" (in-place 변경 최소화) ***
    const groupNode = createGroupNode([target], groupProps);
    siblings[index] = groupNode;

    // 선택 포커스를 그룹으로 넘기면 Inspector에서 곧바로 그룹 옵션 수정 가능
    selectedElementId.value = groupNode.id;

    return groupNode.id;
  }
  // ---------- (선택) 다중 선택 구간 래핑 (연속 인덱스일 때 O(1)치환 1회) ----------
  /**
   * 같은 부모 아래에 있는 연속(contiguous) 요소들 ids[]를 하나의 그룹으로 감쌉니다.
   * 연속이 아니면 내부적으로 고정된 순서로 모아 새 그룹을 만들고,
   * 첫 시작 위치에 1회만 splice로 치환합니다.
   */
  function wrapElementsRangeWithGroup(ids: string[], groupProps?: GroupProps): string | null {
    if (!ids?.length) return null;

    // 공통 부모/인덱스 수집
    const locs = ids
      .map((id) => findParentAndIndex(id))
      .filter((v): v is NonNullable<typeof v> => !!v);

    if (!locs.length) return null;

    const baseSiblings = locs[0].siblings;
    if (!locs.every((l) => l.siblings === baseSiblings)) {
      // 부모가 다르면 안전하게 실패 처리(원하시면 자동 이동/병합 로직으로 확장 가능)
      return null;
    }

    // 인덱스 오름차순 정렬
    const indices = locs.map((l) => l.index).sort((a, b) => a - b);
    const start = indices[0];
    const contiguous = indices.every((v, i, arr) => (i === 0 ? true : v === arr[i - 1] + 1));

    // 자식 모으기
    const children = indices.map((i) => baseSiblings[i]);

    const groupNode = createGroupNode(children, groupProps);

    if (contiguous) {
      // *** 핵심: 한 번의 splice로 "N개 삭제 + 그룹 1개 삽입" → 변경 최소화 ***
      baseSiblings.splice(start, indices.length, groupNode);
    } else {
      // 비연속: 상위 배열 파손 최소화를 위해 뒤에서부터 제거 후, 시작 위치에 삽입
      for (let i = indices.length - 1; i >= 0; i--) baseSiblings.splice(indices[i], 1);
      baseSiblings.splice(start, 0, groupNode);
    }

    selectedElementId.value = groupNode.id;
    return groupNode.id;
  }
  // ---------- (추가) 컨텍스트 메뉴 연동용 public API ----------
  const wrapInGroup = (id: string, props?: GroupProps) => wrapElementWithGroup(id, props);

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

    // 추가
    moveElementUp,
    moveElementDown,
    moveElement, // (옵션) 공통함수도 노출

    // ★ 추가 노출
    wrapInGroup,
    wrapElementWithGroup,
    wrapElementsRangeWithGroup,
  };
});
