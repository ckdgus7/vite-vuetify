// stores/useBuilderStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ElementSchema {
  id: string
  type: string
  label: string // Optional, for display purposes
  props: Record<string, any>
  styles: Record<string, any>
  children: any[] // Optional, for nested elements
}

export const useBuilderStore = defineStore('builder', () => {
  const elements = ref<ElementSchema[]>([])
  const selectedElementId = ref<string | null>(null)

  function addElement(type: string, label: string, styles: Record<string, any>) {
    elements.value.push({
      id: crypto.randomUUID(),
      type,
      label,
      styles,
      props: {},
      children: []
    })
  }
  function saveSchema(): string {
    return JSON.stringify(elements.value, null, 2)
  }

  function loadSchema(json: string) {
    try {
      const parsed = JSON.parse(json)
      if (Array.isArray(parsed)) {
        elements.value = parsed
      }
    } catch (e) {
      console.error('Invalid JSON schema', e)
    }
  }
  function selectElement(id: string) {
    selectedElementId.value = id
  }
  function exportToJsonFile(filename: string = 'builder-schema.json') {
    const json = saveSchema()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()

    // 정리
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function exportToHtml(): string {
    return elements.value
      .map((el) => {
        const tag = el.type.replace('v-', '') // 예: v-btn → btn
        const attrs = Object.entries(el.props || {})
          .map(([k, v]) => `${k}="${v}"`)
          .join(' ')

        const style = Object.entries(el.styles || {})
          .map(([k, v]) => `${k}:${v}`)
          .join(';')

        const html = `<${tag} ${attrs} style="${style}">${el.props?.text || ''}</${tag}>`
        return html
      })
      .join('\n')
  }
  function addGroup() {
    elements.value.push({
      id: crypto.randomUUID(),
      type: 'group',
      label: '그룹',
      props: {},
      styles: {
        padding: '20px',
        border: '1px dashed gray'
      },
      children: []
    })
  }
  function addElementToGroup(groupId: string, type: string) {
    const group = elements.value.find((el) => el.id === groupId)
    if (!group || group.type !== 'group') return

    group.children = group.children || []
    group.children.push({
      id: crypto.randomUUID(),
      type,
      props: {},
      styles: {},
    })
  }
  function findElementById(id: string): ElementSchema | null {
    const search = (list: ElementSchema[] | ElementSchema[][]): ElementSchema | null => {
      for (const el of list as ElementSchema[]) {
        if (!el) continue

        if ('id' in el && el.id === id) return el

        if (el.type === 'group' && Array.isArray(el.children)) {
          const found = search(el.children as ElementSchema[])
          if (found) return found
        }

        if (el.type === 'grid-group' && Array.isArray(el.children)) {
          for (const cell of el.children) {
            const found = search(cell)
            if (found) return found
          }
        }
      }
      return null
    }

    return search(elements.value)
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
  }
})
