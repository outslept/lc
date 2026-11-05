import {
  getAPCALevel,
  getWCAGLevel,
  getContrastDirection,
  getComparisonNote,
} from '../lib/eval'
import { useColorStore } from '../store/color'

interface ResultsSectionProps {
  contrastScore: number
  wcagScore: number
}

export function ResultsSection({ contrastScore, wcagScore }: ResultsSectionProps) {
  const size = useColorStore((s) => s.size)
  const weight = useColorStore((s) => s.weight)

  const apca = getAPCALevel(contrastScore, size, weight)
  const wcag = getWCAGLevel(wcagScore)
  const percentage = Math.min((Math.abs(contrastScore) / 106) * 100, 100)

  return (
    <section className="panel p-3.5 space-y-3 tabular-nums">
      <header className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--text-primary)]">contrast</span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {getContrastDirection(contrastScore)}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[var(--text-muted)]">APCA</span>
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{ backgroundColor: `${apca.color}1f`, color: apca.color }}
            >
              {apca.level}
            </span>
          </div>
          <div className="text-xl font-medium text-[var(--text-primary)] tracking-tight">
            <span className="text-xs text-[var(--text-muted)] mr-0.5">Lc</span>
            {contrastScore > 0 ? '+' : ''}
            {contrastScore.toFixed(1)}
          </div>
        </div>

        <div className="p-2.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[var(--text-muted)]">WCAG 2.1</span>
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{ backgroundColor: `${wcag.color}1f`, color: wcag.color }}
            >
              {wcag.level}
            </span>
          </div>
          <div className="text-xl font-medium text-[var(--text-primary)] tracking-tight">
            {wcagScore.toFixed(2)}
            <span className="text-xs text-[var(--text-muted)]">:1</span>
          </div>
        </div>
      </div>

      <div>
        <div className="relative w-full h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)]"
            style={{ width: `${percentage}%`, backgroundColor: apca.color }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-[var(--text-muted)]">
          <span>0</span>
          <span>30</span>
          <span>60</span>
          <span>90</span>
          <span>106</span>
        </div>
      </div>

      <p className="px-2.5 py-1.5 rounded bg-[var(--surface-raised)]/60 border border-[var(--border)] text-[10px] text-[var(--text-muted)]">
        {getComparisonNote(contrastScore, wcagScore, size, weight)}
      </p>
    </section>
  )
}
