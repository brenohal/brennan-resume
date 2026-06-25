import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'

// Module-level store so any number of useTheme() consumers share one source of
// truth. Crucially, the global 'toggle-theme' event (emitted by the command
// palette) is handled by a SINGLE listener here — registering it per hook
// instance would toggle once per mounted ThemeToggle and cancel itself out.
type Listener = (t: Theme) => void
const listeners = new Set<Listener>()
let initialized = false

function read(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(next))
}

function toggleTheme() {
  applyTheme(read() === 'dark' ? 'light' : 'dark')
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('toggle-theme', toggleTheme)
}

export function useTheme() {
  ensureInit()
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => {
    const l: Listener = (t) => setTheme(t)
    listeners.add(l)
    setTheme(read())
    return () => {
      listeners.delete(l)
    }
  }, [])

  return { theme, toggle: toggleTheme, setTheme: applyTheme }
}
