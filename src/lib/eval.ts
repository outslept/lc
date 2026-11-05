export interface LevelResult {
  level: string
  color: string
}

const WCAG_AAA: LevelResult = { level: 'AAA', color: '#5ce68a' }
const WCAG_AA: LevelResult = { level: 'AA', color: '#38bdf8' }
const WCAG_AA_LARGE: LevelResult = { level: 'AA Large', color: '#f59e0b' }
const WCAG_FAIL: LevelResult = { level: 'Fail', color: '#ef5350' }

const APCA_FLUENT: LevelResult = { level: 'Fluent', color: '#5ce68a' }
const APCA_PASS: LevelResult = { level: 'Pass', color: '#38bdf8' }

function getBaseLc(sizePx: number): number {
  if (sizePx < 14) return 90
  if (sizePx < 16) return 75
  if (sizePx < 18) return 60
  if (sizePx < 21) return 55
  if (sizePx < 24) return 50
  if (sizePx < 30) return 45
  if (sizePx < 36) return 40
  if (sizePx < 48) return 35
  return 30
}

function getWeightOffset(weight: number): number {
  if (weight <= 300) return 15
  switch (weight) {
    case 400:
      return 0
    case 500:
      return -5
    case 600:
      return -10
    default:
      return -15
  }
}

export function getWCAGLevel(ratio: number): LevelResult {
  if (ratio >= 7) return WCAG_AAA
  if (ratio >= 4.5) return WCAG_AA
  if (ratio >= 3) return WCAG_AA_LARGE
  return WCAG_FAIL
}

export function getRequiredLc(sizePx: number, weight: number): number {
  if (sizePx < 14 && weight <= 300) return 100
  const val = getBaseLc(sizePx) + getWeightOffset(weight)
  return val < 30 ? 30 : val > 95 ? 95 : val
}

export function getAPCALevel(score: number, sizePx = 16, weight = 400): LevelResult {
  const abs = Math.abs(score)
  const req = getRequiredLc(sizePx, weight)
  if (abs >= req + 15) return APCA_FLUENT
  if (abs >= req) return APCA_PASS
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
