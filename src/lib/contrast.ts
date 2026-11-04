import Color from 'colorjs.io'

export function getContrastScores(textColor: string, bgColor: string) {
  try {
    const fg = new Color(textColor)
    const bg = new Color(bgColor)
    return {
      contrastScore: Number(bg.contrast(fg, 'APCA')) || 0,
      wcagScore: Number(bg.contrast(fg, 'WCAG21')) || 0,
    }
  } catch {
    return { contrastScore: 0, wcagScore: 0 }
  }
}

export function toHex(color: string, fallback = '#000000'): string {
  try {
    return new Color(color).to('srgb').toString({ format: 'hex' })
  } catch {
    return fallback
  }
}
