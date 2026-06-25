import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search,
  CornerDownLeft,
  User,
  Briefcase,
  FolderGit2,
  Mail,
  Home,
  FileText,
  Copy,
  Sun,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { personal } from '../../data/personal'
import { onUI, emitUI } from '../../lib/ui-events'

type IconType = React.ComponentType<{ size?: number }>

interface Command {
  id: string
  label: string
  group: 'Navigation' | 'Actions'
  icon: IconType
  num?: string
  run: () => void
}

function scrollTo(id: string) {
  if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
  else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(() => {
    const close = () => setOpen(false)
    const nav = (id: string) => () => {
      close()
      scrollTo(id)
    }
    return [
      { id: 'home', label: 'Home', group: 'Navigation', icon: Home, num: '00', run: nav('home') },
      { id: 'about', label: 'About', group: 'Navigation', icon: User, num: '01', run: nav('about') },
      { id: 'experience', label: 'Experience', group: 'Navigation', icon: Briefcase, num: '02', run: nav('experience') },
      { id: 'projects', label: 'Projects', group: 'Navigation', icon: FolderGit2, num: '03', run: nav('projects') },
      { id: 'contact', label: 'Contact', group: 'Navigation', icon: Mail, num: '04', run: nav('contact') },
      {
        id: 'resume',
        label: 'Open résumé',
        group: 'Actions',
        icon: FileText,
        run: () => {
          close()
          window.open(personal.resumeUrl, '_blank', 'noopener')
        },
      },
      {
        id: 'theme',
        label: 'Toggle light / dark theme',
        group: 'Actions',
        icon: Sun,
        run: () => {
          emitUI('toggle-theme')
        },
      },
      {
        id: 'chat',
        label: 'Ask the assistant',
        group: 'Actions',
        icon: Sparkles,
        run: () => {
          close()
          emitUI('open-chat')
        },
      },
      {
        id: 'email',
        label: 'Copy email address',
        group: 'Actions',
        icon: Copy,
        run: () => {
          navigator.clipboard?.writeText(personal.email)
          close()
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        group: 'Actions',
        icon: GithubIcon,
        run: () => {
          close()
          window.open(personal.github, '_blank', 'noopener')
        },
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        group: 'Actions',
        icon: LinkedinIcon,
        run: () => {
          close()
          window.open(personal.linkedin, '_blank', 'noopener')
        },
      },
    ]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.id.includes(q))
  }, [query, commands])

  // Open via global event or Cmd/Ctrl+K
  useEffect(() => {
    const off = onUI('open-palette', () => setOpen(true))
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      off()
      window.removeEventListener('keydown', key)
    }
  }, [])

  // Reset + focus + body lock on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      return () => {
        clearTimeout(t)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  if (!open) return null

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      filtered[active]?.run()
    }
  }

  const groups: Command['group'][] = ['Navigation', 'Actions']
  let flatIndex = -1

  return (
    <div
      className="palette-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-search">
          <Search size={18} style={{ color: 'hsl(var(--slate))', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections and actions..."
            aria-label="Search commands"
          />
        </div>

        <div className="palette-list">
          {filtered.length === 0 && (
            <div className="palette-group-label" style={{ padding: '1rem 0.75rem' }}>
              No results
            </div>
          )}
          {groups.map((group) => {
            const items = filtered.filter((c) => c.group === group)
            if (items.length === 0) return null
            return (
              <div key={group}>
                <div className="palette-group-label">{group}</div>
                {items.map((cmd) => {
                  flatIndex++
                  const idx = flatIndex
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      className={`palette-item${idx === active ? ' active' : ''}`}
                      onClick={() => cmd.run()}
                      onMouseEnter={() => setActive(idx)}
                    >
                      <span className="pi-icon">
                        <Icon size={16} />
                      </span>
                      {cmd.label}
                      {cmd.num && <span className="pi-num">{cmd.num}</span>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="palette-footer">
          <span>
            <kbd>↑↓</kbd>navigate
          </span>
          <span>
            <CornerDownLeft size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> select
          </span>
          <span>
            <kbd>esc</kbd>close
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ExternalLink size={11} /> opens in new tab
          </span>
        </div>
      </div>
    </div>
  )
}
