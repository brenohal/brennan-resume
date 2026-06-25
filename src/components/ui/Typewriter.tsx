import { useState, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseMs?: number
}

export default function Typewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseMs = 1800,
}: Props) {
  const reduce = useReducedMotion()
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    if (reduce) return
    const word = words[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout = setTimeout(
          () => setDisplayed(word.slice(0, displayed.length + 1)),
          typingSpeed
        )
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseMs)
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 300)
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          deletingSpeed
        )
      } else {
        setWordIndex((i) => (i + 1) % words.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout)
  }, [displayed, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseMs, reduce])

  return (
    <span style={{ color: 'hsl(var(--slate-light))', fontSize: 'inherit', fontWeight: 'inherit' }}>
      {reduce ? words[0] : displayed}
      <span className="cursor-blink" style={{ color: 'hsl(var(--teal))' }}>|</span>
    </span>
  )
}
