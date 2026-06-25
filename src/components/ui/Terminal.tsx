import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
  onNavigate: (section: string) => void
}

interface Line {
  type: 'input' | 'output' | 'error'
  text: string
}

const HELP_TEXT = [
  'Available commands:',
  '  goto <section>   — navigate to a section',
  '  sections         — list all sections',
  '  clear            — clear terminal',
  '  help             — show this message',
  '',
  'Sections: home, about, experience, projects, contact',
]

const SECTIONS: Record<string, string> = {
  home: 'home',
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  contact: 'contact',
}

export default function Terminal({ onClose, onNavigate }: Props) {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: 'Welcome to brennan@portfolio:~$' },
    { type: 'output', text: 'Type "help" for available commands.' },
    { type: 'output', text: '' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function runCommand(cmd: string) {
    const parts = cmd.trim().split(/\s+/)
    const verb = parts[0]?.toLowerCase()
    const arg = parts[1]?.toLowerCase()

    const output: Line[] = [{ type: 'input', text: `$ ${cmd}` }]

    if (!verb) {
      setLines((l) => [...l, ...output])
      return
    }

    if (verb === 'help') {
      HELP_TEXT.forEach((t) => output.push({ type: 'output', text: t }))
    } else if (verb === 'clear') {
      setLines([])
      return
    } else if (verb === 'sections') {
      output.push({ type: 'output', text: Object.keys(SECTIONS).join(', ') })
    } else if (verb === 'goto') {
      const section = SECTIONS[arg]
      if (section) {
        output.push({ type: 'output', text: `Navigating to ${section}...` })
        setTimeout(() => onNavigate(section), 300)
      } else {
        output.push({ type: 'error', text: `Section "${arg}" not found. Try: ${Object.keys(SECTIONS).join(', ')}` })
      }
    } else {
      output.push({ type: 'error', text: `Command not found: ${verb}. Type "help".` })
    }

    setLines((l) => [...l, ...output, { type: 'output', text: '' }])
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (input.trim()) setHistory((h) => [input, ...h])
      setHistoryIdx(-1)
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = historyIdx + 1
      if (next < history.length) {
        setHistoryIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = historyIdx - 1
      if (next < 0) { setHistoryIdx(-1); setInput('') }
      else { setHistoryIdx(next); setInput(history[next]) }
    }
  }

  return (
    <div
      className="terminal-window"
      style={{ width: 'min(560px, 90vw)', maxHeight: '380px', display: 'flex', flexDirection: 'column' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-bar">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--slate))' }}>
          brennan@portfolio:~
        </span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--slate))', display: 'flex' }}>
          <X size={14} />
        </button>
      </div>
      <div style={{ padding: '0.75rem 1rem', overflowY: 'auto', flex: 1, fontSize: '0.8125rem', lineHeight: 1.6 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.type === 'input'
                  ? 'hsl(var(--teal))'
                  : line.type === 'error'
                  ? '#ff7b7b'
                  : 'hsl(var(--slate))',
              whiteSpace: 'pre',
            }}
          >
            {line.text || ' '}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--teal))' }}>
          <span>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Terminal input"
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'hsl(var(--slate-light))',
              fontFamily: 'Fira Code, monospace',
              fontSize: '0.8125rem',
              flex: 1,
              caretColor: 'hsl(var(--teal))',
            }}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
