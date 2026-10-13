import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Copy, Check } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { personal } from '../../data/personal'
import { site } from '../../site.config'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useScrollReveal()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

interface FormState {
  name: string
  email: string
  message: string
}
type FormErrors = Partial<Record<keyof FormState, string>>
type Status = 'idle' | 'sending' | 'sent' | 'opened-email' | 'failed'

const SOCIAL_LINKS = [
  { href: personal.github, icon: <GithubIcon size={20} />, label: 'GitHub', external: true },
  { href: personal.linkedin, icon: <LinkedinIcon size={20} />, label: 'LinkedIn', external: true },
]

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email)
    } catch {
      // Clipboard API blocked (older browsers / insecure context): fall back to a temporary textarea
      const ta = document.createElement('textarea')
      ta.value = personal.email
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) e.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'That email address doesn’t look right.'
    if (!form.message.trim()) e.message = 'Please write a message.'
    else if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
    return e
  }

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    // Clear a field's error as soon as the visitor starts fixing it
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const formEl = ev.currentTarget
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field so keyboard + screen-reader users land on it
      const first = (['name', 'email', 'message'] as const).find((k) => found[k])
      if (first) (formEl.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    // Bots fill hidden fields; humans never see it
    if ((formEl.elements.namedItem('website') as HTMLInputElement | null)?.value) return

    const payload = { name: form.name.trim(), email: form.email.trim(), message: form.message.trim() }

    if (site.formEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        setStatus(res.ok ? 'sent' : 'failed')
      } catch {
        setStatus('failed')
      }
      return
    }

    // No form service configured: hand the message to the visitor's email client.
    const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
    const body = encodeURIComponent(`Name: ${payload.name}\nReply-to: ${payload.email}\n\n${payload.message}`)
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
    setStatus('opened-email')
  }

  const emailLink = (
    <a href={`mailto:${personal.email}`} style={{ color: 'hsl(var(--teal))' }}>
      {personal.email}
    </a>
  )

  const resultBox = (tone: 'ok' | 'error', content: React.ReactNode, action?: React.ReactNode) => (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      style={{
        background: tone === 'ok' ? 'hsl(var(--teal) / 0.1)' : 'hsl(var(--danger) / 0.08)',
        border: `1px solid ${tone === 'ok' ? 'hsl(var(--teal) / 0.3)' : 'hsl(var(--danger) / 0.4)'}`,
        borderRadius: 'var(--radius)',
        padding: '1.75rem 1.5rem',
        color: 'hsl(var(--slate-light))',
        lineHeight: 1.7,
        textAlign: 'center',
      }}
    >
      {content}
      {action}
    </div>
  )

  const backBtn = (
    <button
      type="button"
      className="btn-outline btn-secondary"
      style={{ marginTop: '1.25rem', fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
      onClick={() => setStatus('idle')}
    >
      Back to the form
    </button>
  )

  return (
    <section
      id="contact"
      style={{ padding: '6rem 2rem 8rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}
    >
      <FadeIn>
        <p style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--teal))', marginBottom: '1rem', fontSize: '0.9rem' }}>
          04. What's Next?
        </p>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', marginBottom: '1.25rem', color: 'hsl(var(--slate-light))' }}>
          Get In Touch
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p style={{ lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 2rem' }}>{personal.contactCopy}</p>
      </FadeIn>

      {/* Fastest paths first: these work on every device, with no form service involved */}
      <FadeIn delay={0.15}>
        <div className="contact-actions">
          <button type="button" className="btn-outline btn-primary" onClick={copyEmail}>
            {copied ? <>Copied <Check size={16} /></> : <>Copy email <Copy size={16} /></>}
          </button>
          <a className="btn-outline btn-secondary" href={`mailto:${personal.email}`}>
            Open in email app <Mail size={16} />
          </a>
          <a className="btn-outline btn-secondary" href={personal.linkedin} target="_blank" rel="noopener noreferrer">
            Message on LinkedIn <LinkedinIcon size={16} />
          </a>
        </div>
        <span className="sr-only" role="status" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="form-divider">or send a message from here</p>

        {status === 'sent' &&
          resultBox(
            'ok',
            <>
              <p style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--teal))', marginBottom: '0.5rem' }}>
                Message sent.
              </p>
              <p style={{ fontSize: '0.9rem' }}>Thanks, I'll reply to {form.email.trim()} soon.</p>
            </>,
            backBtn,
          )}

        {status === 'opened-email' &&
          resultBox(
            'ok',
            <>
              <p style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--teal))', marginBottom: '0.5rem' }}>
                Your email app should be open.
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Hit send there to deliver your message. If nothing opened, copy my address above or email {emailLink}.
              </p>
            </>,
            backBtn,
          )}

        {status === 'failed' &&
          resultBox(
            'error',
            <>
              <p style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--danger))', marginBottom: '0.5rem' }}>
                That didn't go through.
              </p>
              <p style={{ fontSize: '0.9rem' }}>Your message is still here. Try again, or email {emailLink} directly.</p>
            </>,
            backBtn,
          )}

        {(status === 'idle' || status === 'sending') && (
          <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-grid">
              <div>
                <label htmlFor="contact-name" className="field-label">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Jane Smith"
                  className="field"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
                {errors.name && <p id="contact-name-error" role="alert" className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="field-label">Email address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className="field"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
                {errors.email && <p id="contact-email-error" role="alert" className="field-error">{errors.email}</p>}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="contact-message" className="field-label">What would you like to say?</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="Your message..."
                className="field"
                style={{ resize: 'vertical' }}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && <p id="contact-message-error" role="alert" className="field-error">{errors.message}</p>}
            </div>

            {/* Honeypot: invisible to people, tempting to bots */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="submit" className="btn-outline" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : <>Send Message <Send size={15} /></>}
              </button>
            </div>
          </form>
        )}
      </FadeIn>

      <FadeIn delay={0.25}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className="icon-btn lift"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </FadeIn>

    </section>
  )
}
