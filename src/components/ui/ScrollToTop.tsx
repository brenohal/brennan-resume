import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '40px',
        height: '40px',
        border: '1px solid hsl(var(--teal))',
        borderRadius: '6px',
        background: 'hsl(var(--navy-light))',
        color: 'hsl(var(--teal))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 40,
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(var(--teal) / 0.1)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(var(--navy-light))' }}
    >
      <ArrowUp size={16} />
    </button>
  )
}
