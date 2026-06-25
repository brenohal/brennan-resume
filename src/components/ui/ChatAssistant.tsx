import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send } from 'lucide-react'
import { greeting, suggestions, matchAnswer } from '../../data/chatbot'
import { onUI } from '../../lib/ui-events'

interface Message {
  role: 'bot' | 'user'
  text: string
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: greeting }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => onUI('open-chat', () => setOpen(true)), [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function send(text: string) {
    const q = text.trim()
    if (!q) return
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setTyping(true)
    const answer = matchAnswer(q)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'bot', text: answer }])
    }, 500)
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            className="chat-fab"
            aria-label="Open assistant"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="chat-panel"
            role="dialog"
            aria-label="Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-header">
              <Sparkles size={18} style={{ color: 'hsl(var(--teal))' }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'hsl(var(--slate-light))', fontWeight: 600, fontSize: '0.9rem' }}>
                  Ask about Brennan
                </div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--slate))' }}>Scripted assistant</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--slate))', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="chat-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="chat-bubble bot" style={{ opacity: 0.7 }}>
                  <span className="cursor-blink">...</span>
                </div>
              )}

              <div className="chat-chips">
                {suggestions.map((s) => (
                  <button key={s} className="chat-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="chat-input-row"
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question..."
                aria-label="Message"
              />
              <button type="submit" className="chat-send" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
