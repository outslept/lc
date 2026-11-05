import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const SUGGESTED_FONTS = [
  'Inter',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'DM Sans',
  'Outfit',
  'Syne',
  'Playfair Display',
  'Instrument Serif',
  'Newsreader',
  'Lora',
  'JetBrains Mono',
  'Fira Code',
  'Space Mono',
  'IBM Plex Mono',
] as const

export interface TypographyState {
  font: string
  size: number
  weight: number
  leading: number
  tracking: number
}

const DEFAULT_TYPE: TypographyState = {
  font: 'Inter',
  size: 28,
  weight: 500,
  leading: 1.35,
  tracking: -0.01,
}

interface ColorStore extends TypographyState {
  textColor: string
  bgColor: string
  setTextColor: (color: string) => void
  setBgColor: (color: string) => void
  swapColors: () => void
  setType: <K extends keyof TypographyState>(key: K, val: TypographyState[K]) => void
  resetType: () => void
}

export const useColorStore = create<ColorStore>()(
  persist(
    (set) => ({
      textColor: '#0a0a0c',
      bgColor: '#ededef',
      ...DEFAULT_TYPE,
      setTextColor: (textColor) => set({ textColor }),
      setBgColor: (bgColor) => set({ bgColor }),
      swapColors: () => set((s) => ({ textColor: s.bgColor, bgColor: s.textColor })),
      setType: (key, val) => set((s) => (s[key] === val ? s : { [key]: val })),
      resetType: () => set(DEFAULT_TYPE),
    }),
    { name: 'color-storage' }
  )
)
