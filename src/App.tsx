import { useMemo } from 'react'
import { getContrastScores } from './lib/contrast'
import { useColorStore } from './store/color'
import { ColorSection } from './components/color-section'
import { ResultsSection } from './components/results-section'
import { TextPreview } from './components/text-preview'

export default function App() {
  const { textColor, bgColor } = useColorStore()

  const { contrastScore, wcagScore } = useMemo(
    () => getContrastScores(textColor, bgColor),
    [textColor, bgColor]
  )

  return (
    <main className="min-h-svh lg:h-svh lg:overflow-hidden flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-6xl lg:h-[min(680px,calc(100svh-32px))] grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3">
        <div className="flex flex-col gap-3 justify-between">
          <ResultsSection contrastScore={contrastScore} wcagScore={wcagScore} />
          <ColorSection />
        </div>
        <TextPreview contrastScore={contrastScore} />
      </div>
    </main>
  )
}
