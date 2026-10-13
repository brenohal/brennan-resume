import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Props {
  src: string
  poster?: string
  label: string
}

/**
 * Demo video that costs nothing until it's seen: no bytes are fetched until the
 * element nears the viewport, it plays only while on screen, and it never
 * autoplays for visitors who prefer reduced motion (the controls still work).
 */
export default function LazyVideo({ src, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto'
          if (!reduce) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25, rootMargin: '200px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reduce])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label={label}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
}
