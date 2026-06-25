import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  delay: number
  duration: number
}

export default function Starfield() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    }))

    container.innerHTML = stars
      .map(
        (s) =>
          `<span style="
            position:absolute;
            left:${s.x}%;
            top:${s.y}%;
            width:${s.r * 2}px;
            height:${s.r * 2}px;
            border-radius:50%;
            background:hsl(220 27% 88%);
            opacity:0.3;
            animation:twinkle ${s.duration}s ${s.delay}s ease-in-out infinite;
          "></span>`
      )
      .join('')
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  )
}
