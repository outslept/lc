const EMPTY_POSITION = { top: 0, left: 0 }
const PICKER_WIDTH = 280

export function getElementPosition(element: HTMLElement | null): { top: number; left: number } {
  if (!element) return EMPTY_POSITION

  const rect = element.getBoundingClientRect()
  const innerWidth = window.innerWidth

  let left = rect.right + 10
  const top = rect.top

  if (left + PICKER_WIDTH > innerWidth) {
    left = rect.left - PICKER_WIDTH - 10
  }

  if (left < 0) {
    left = (innerWidth - PICKER_WIDTH) / 2
  }

  return { top, left }
}

export function createClickOutsideHandler(
  refs: Array<React.RefObject<HTMLElement | null>>,
  callback: () => void
) {
  return (event: MouseEvent) => {
    const target = event.target as Node
    for (let i = 0; i < refs.length; i++) {
      const current = refs[i].current
      if (current && current.contains(target)) {
        return
      }
    }
    callback()
  }
}
