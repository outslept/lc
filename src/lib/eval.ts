export interface LevelResult {
  level: string
  color: string
}

const BASE_LC: ReadonlyArray<readonly [number, number]> = [
  [14, 90],
  [16, 75],
  [18, 60],
  [21, 55],
  [24, 50],
  [30, 45],
  [36, 40],
  [48, 35],
]

const WEIGHT_OFFSET: Record<number, number> = {
  300: 15,
  400: 0,
  500: -5,
  600: -10,
}

export function getWCAGLevel(ratio: number): LevelResult {
  if (ratio >= 7) return { level: 'AAA', color: '#5ce68a' }
  if (ratio >= 4.5) return { level: 'AA', color: '#38bdf8' }
  if (ratio >= 3) return { level: 'AA Large', color: '#f59e0b' }
  return { level: 'Fail', color: '#ef5350' }
}

export function getRequiredLc(sizePx: number, weight: number): number {
  if (sizePx < 14 && weight <= 300) return 100
  const base = BASE_LC.find(([maxPx]) => sizePx < maxPx)?.[1] ?? 30
  const offset = weight <= 300 ? 15 : (WEIGHT_OFFSET[weight] ?? -15)
  return Math.max(30, Math.min(95, base + offset))
}

export function getAPCALevel(score: number, sizePx = 16, weight = 400): LevelResult {
  const abs = Math.abs(score)
  const req = getRequiredLc(sizePx, weight)
  if (abs >= req + 15) return { level: 'Fluent', color: '#5ce68a' }
  if (abs >= req) return { level: 'Pass', color: '#38bdf8' }
  if (abs >= req - 15) return { level: `Min Lc ${req}`, color: '#f59e0b' }
  return { level: `Fail (<${req})`, color: '#ef5350' }
}

export function getContrastDirection(score: number): string {
  if (score === 0) return 'equal luminance'
  return score > 0 ? 'dark on light' : 'light on dark'
}

export function getComparisonNote(
  apcaScore: number,
  wcagScore: number,
  sizePx = 16,
  weight = 400
): string {
  const apcaPass = Math.abs(apcaScore) >= getRequiredLc(sizePx, weight)
  const wcagPass = wcagScore >= (sizePx >= 24 || (sizePx >= 18.66 && weight >= 700) ? 3 : 4.5)

  if (!wcagPass && !apcaPass) return `Fails both standards at ${sizePx}px / ${weight}.`
  if (wcagPass && apcaPass) return `Passes both APCA and WCAG at ${sizePx}px / ${weight}.`
  if (!wcagPass && apcaPass) return `Passes APCA at ${sizePx}px / ${weight}, but rejected by WCAG.`
  return `Passes WCAG, but below APCA minimum for ${sizePx}px / ${weight}.`
}
