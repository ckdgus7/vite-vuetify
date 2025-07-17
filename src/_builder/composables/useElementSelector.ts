// composables/useElementSelector.ts
import { onMounted, onUnmounted } from 'vue'

export function useElementSelector(canvasSelector = '#builder-canvas') {
  let overlay: HTMLDivElement | null = null

  const createOverlay = () => {
    overlay = document.createElement('div')
    overlay.style.position = 'absolute'
    overlay.style.border = '2px dashed #1976d2'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '9999'
    document.body.appendChild(overlay)
  }

  const updateOverlay = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    Object.assign(overlay!.style, {
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      display: 'block',
    })
  }

  const hideOverlay = () => {
    if (overlay) overlay.style.display = 'none'
  }

  const onMouseMove = (e: MouseEvent) => {
    const canvas = document.querySelector(canvasSelector)
    if (!canvas) return

    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (!el || !canvas.contains(el)) {
      hideOverlay()
      return
    }
    if (overlay && el !== overlay) updateOverlay(el)
  }

  const onClick = (e: MouseEvent) => {
    const canvas = document.querySelector(canvasSelector)
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (el && canvas?.contains(el)) {
      const wrapper = el.closest('[data-builder-id]') as HTMLElement
      if (wrapper) {
        const id = wrapper.dataset.builderId
        const event = new CustomEvent('element-select', { detail: { id } })
        window.dispatchEvent(event)
      }
    }
  }

  onMounted(() => {
    createOverlay()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('click', onClick)
    if (overlay) overlay.remove()
  })
}
