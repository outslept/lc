import Color from 'colorjs.io'

const MAX_CACHE_SIZE = 64
const colorCache = new Map<string, Color | null>()
const hexCache = new Map<string, string | null>()
const ZERO_SCORES = { contrastScore: 0, wcagScore: 0 }

function isHexChar(code: number): boolean {
  return (
    (code >= 48 && code <= 57) || // 0-9
    (code >= 65 && code <= 70) || // A-F
    (code >= 97 && code <= 102) // a-f
  )
}

function tryNormalizeHex(raw: string): string | null {
  const s = raw.trim()
  const len = s.length
  if (len !== 4 && len !== 7) return null
  if (s.charCodeAt(0) !== 35 /* '#' */) return null

  for (let i = 1; i < len; i++) {
    if (!isHexChar(s.charCodeAt(i))) return null
  }

  const lower = s.toLowerCase()
  if (len === 7) return lower
  return `#${lower[1]}${lower[1]}${lower[2]}${lower[2]}${lower[3]}${lower[3]}`
}

function parseColorCached(input: string): Color | null {
  const key = input.trim()
  if (!key) return null

  const cached = colorCache.get(key)
  if (cached !== undefined) return cached

  let parsed: Color | null = null
  try {
    parsed = new Color(key)
  } catch {
    parsed = null
  }

  if (colorCache.size >= MAX_CACHE_SIZE) {
    const oldest = colorCache.keys().next().value
    if (oldest !== undefined) colorCache.delete(oldest)
  }
  colorCache.set(key, parsed)
  return parsed
}

export function getContrastScores(
  textColor: string,
  bgColor: string
): { contrastScore: number; wcagScore: number } {
  const fg = parseColorCached(textColor)
  const bg = parseColorCached(bgColor)
  if (fg === null || bg === null) return ZERO_SCORES

  return {
    contrastScore: Number(bg.contrast(fg, 'APCA')) || 0,
    wcagScore: Number(bg.contrast(fg, 'WCAG21')) || 0,
  }
}

export function toHex(color: string, fallback = '#000000'): string {
  const fastHex = tryNormalizeHex(color)
  if (fastHex !== null) return fastHex

  const key = color.trim()
  if (!key) return fallback

  const cached = hexCache.get(key)
  if (cached !== undefined) return cached ?? fallback

  const parsed = parseColorCached(key)
  let hex: string | null = null
  if (parsed !== null) {
    try {
      hex = parsed.to('srgb').toString({ format: 'hex' })
    } catch {
      hex = null
    }
  }

  if (hexCache.size >= MAX_CACHE_SIZE) {
    const oldest = hexCache.keys().next().value
    if (oldest !== undefined) hexCache.delete(oldest)
  }
  hexCache.set(key, hex)
  return hex ?? fallback
}
