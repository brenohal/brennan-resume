import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface Props {
  style?: React.CSSProperties
}

export default function ThemeToggle({ style }: Props) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'hsl(var(--slate))',
        display: 'flex',
        padding: '0.25rem',
        transition: 'color 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))'
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
