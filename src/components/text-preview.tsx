import { useState, useEffect } from 'react'
import { useColorStore } from '../store/color'
import { getRequiredLc } from '../lib/eval'
import { toHex } from '../lib/contrast'

const DEFAULT_TEXT =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. 0123456789'

const SCALE_PX = [12, 14, 16, 20, 24]

export function TextPreview({ contrastScore }: { contrastScore: number }) {
  const { textColor, bgColor, font, size, weight, leading, tracking } = useColorStore()
  const [customText, setCustomText] = useState(DEFAULT_TEXT)
  const [copied, setCopied] = useState(false)

  const cleanFont = font.trim() || 'Inter'
  const fontFamily = `"${cleanFont}", system-ui, sans-serif`
  const safeFg = toHex(textColor, '#0a0a0c')
  const safeBg = toHex(bgColor, '#ededef')
  const absLc = Math.abs(contrastScore)

  useEffect(() => {
    const id = setTimeout(() => {
      let link = document.getElementById('gfont-link') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.id = 'gfont-link'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      // shortcut: Google Fonts v1 API ignores missing weights instead of 400-ing
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(cleanFont)}:300,400,500,600,700,800&display=swap`
    }, 250)
    return () => clearTimeout(id)
  }, [cleanFont])

  const copyCss = async () => {
    const css = [
      `color: ${textColor};`,
      `background-color: ${bgColor};`,
      `font-family: ${fontFamily};`,
      `font-size: ${size}px;`,
      `font-weight: ${weight};`,
      `line-height: ${leading};`,
      `letter-spacing: ${tracking}em;`,
    ].join('\n')
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1100)
  }

  return (
    <section className="panel p-3.5 h-full flex flex-col">
      <header className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-medium text-[var(--text-primary)]">specimen</h2>
          <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
            {cleanFont} · {size}px · {weight} · {leading}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copyCss}
            className="btn-press px-2 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[10px] cursor-pointer"
            style={{ color: copied ? '#5ce68a' : 'var(--text-primary)' }}
          >
            {copied ? 'copied ✓' : 'copy css'}
          </button>
          <button
            type="button"
            onClick={() => setCustomText(DEFAULT_TEXT)}
            className="btn-press px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            reset
          </button>
        </div>
      </header>

      <div
        className="flex-1 rounded-lg border border-[var(--border)] p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-hidden transition-colors duration-150"
        style={
          {
            backgroundColor: safeBg,
            color: safeFg,
            '--fg': safeFg,
          } as React.CSSProperties
        }
      >
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full flex-1 bg-transparent resize-none focus:outline-none"
          style={{
            fontFamily,
            fontSize: `${size}px`,
            fontWeight: weight,
            lineHeight: leading,
            letterSpacing: `${tracking}em`,
            color: safeFg,
          }}
          placeholder="Type to test typography and contrast..."
        />

        <div
          className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-3"
          style={{ borderColor: 'color-mix(in srgb, var(--fg) 14%, transparent)' }}
        >
          {SCALE_PX.map((px) => {
            const req = getRequiredLc(px, weight)
            const pass = absLc >= req
            return (
              <div key={px} className="min-w-0">
                <div
                  className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5 tabular-nums"
                  style={{ color: 'color-mix(in srgb, var(--fg) 65%, transparent)' }}
                >
                  <span>{px}px</span>
                  <span>·</span>
                  <span>Lc≥{req}</span>
                  <span>{pass ? '✓' : '✕'}</span>
                </div>
                <p
                  className="truncate"
                  style={{
                    fontFamily,
                    fontSize: `${px}px`,
                    fontWeight: weight,
                    lineHeight: 1.35,
                    letterSpacing: `${tracking}em`,
                    opacity: pass ? 1 : 0.55,
                  }}
                >
                  Aa Bb Cc · The quick brown fox 0123
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
