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
      className="icon-btn"
      style={style}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
