import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useColorStore, SUGGESTED_FONTS } from '../store/color'
import { toHex } from '../lib/contrast'

const SLIDERS = [
  { key: 'size', min: 12, max: 64, step: 1, unit: 'px' },
  { key: 'weight', min: 300, max: 800, step: 100 },
  { key: 'leading', min: 1, max: 2, step: 0.05 },
  { key: 'tracking', min: -0.06, max: 0.15, step: 0.01, unit: 'em' },
] as const

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const hexValue = toHex(value)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  return (
    <div className="leva-row">
      <span className="text-[11px] text-[var(--text-muted)] truncate">{label}</span>
      <div ref={wrapRef} className="relative flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="btn-press w-[26px] h-[26px] rounded-[5px] border border-[var(--border-hover)] shrink-0 cursor-pointer"
          style={{ backgroundColor: hexValue }}
          aria-label={`Pick ${label}`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="leva-input w-full"
          placeholder="#000000"
        />

        {open && (
          <div className="absolute bottom-full left-0 mb-2 z-50 p-3 bg-[var(--surface-raised)] border border-[var(--border-hover)] rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
            <HexColorPicker color={hexValue} onChange={onChange} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-press mt-2 w-full py-1 text-[11px] font-medium text-[#0a0a0c] bg-[var(--text-primary)] rounded cursor-pointer"
            >
              done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ColorSection() {
  const state = useColorStore()
  const { textColor, bgColor, setTextColor, setBgColor, swapColors, font, setType, resetType } =
    state

  return (
    <section className="panel p-3.5 space-y-3.5">
      <div>
        <header className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
          <span className="text-[11px] font-medium text-[var(--text-primary)]">colors</span>
          <button
            type="button"
            onClick={swapColors}
            className="btn-press px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[10px] text-[var(--text-primary)] cursor-pointer"
            title="Swap foreground & background"
          >
            ⇄ swap
          </button>
        </header>
        <div className="space-y-1.5">
          <ColorRow label="fg" value={textColor} onChange={setTextColor} />
          <ColorRow label="bg" value={bgColor} onChange={setBgColor} />
        </div>
      </div>

      <div>
        <header className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
          <span className="text-[11px] font-medium text-[var(--text-primary)]">typography</span>
          <button
            type="button"
            onClick={resetType}
            className="btn-press px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            reset
          </button>
        </header>

        <div className="space-y-1.5">
          <div className="leva-row">
            <span className="text-[11px] text-[var(--text-muted)]">family</span>
            <input
              type="text"
              list="gfonts"
              value={font}
              onChange={(e) => setType('font', e.target.value)}
              placeholder="Any Google Font..."
              className="leva-input w-full"
            />
            <datalist id="gfonts">
              {SUGGESTED_FONTS.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          {SLIDERS.map(({ key, min, max, step, ...rest }) => {
            const unit = 'unit' in rest ? rest.unit : ''
            const val = state[key]
            return (
              <div key={key} className="leva-row">
                <span className="text-[11px] text-[var(--text-muted)] truncate">{key}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={(e) => setType(key, parseFloat(e.target.value))}
                    className="leva-slider"
                  />
                  <span className="leva-input inline-flex items-center justify-end min-w-[52px] text-[11px] select-none">
                    {val}
                    {unit && <span className="text-[var(--text-muted)] ml-0.5">{unit}</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
