// stores/useBuilderStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ElementSchema {
  id: string
  type: string
  props: Record<string, any>
  styles: Record<string, any>
}

export const useBuilderStore = defineStore('builder', () => {
  const elements = ref<ElementSchema[]>([])
  const selectedElementId = ref<string | null>(null)

  function addElement(type: string) {
    elements.value.push({
      id: crypto.randomUUID(),
      type,
      props: {},
      styles: {},
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
  return {
    elements,
    selectedElementId,
    addElement,
    selectElement,
    exportToHtml,
    saveSchema,
    loadSchema,
  }
})
