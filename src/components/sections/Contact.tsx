import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, ExternalLink } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { personal } from '../../data/personal'

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
interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message too short'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // Opens the user's default email client with the form content
    const body = encodeURIComponent(`Name: ${form.name}\n\n${form.message}`)
    window.location.href = `mailto:${personal.email}?subject=Portfolio Contact from ${form.name}&body=${body}`
    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
    }, 500)
  }

  const inputStyle = (error?: string): React.CSSProperties => ({
    width: '100%',
    background: 'hsl(var(--navy-light))',
    border: `1px solid ${error ? '#ff7b7b' : 'hsl(var(--border-col))'}`,
    borderRadius: 'var(--radius)',
    padding: '0.75rem 1rem',
    color: 'hsl(var(--slate-light))',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  })

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
        <p style={{ lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          {personal.contactCopy}
        </p>
      </FadeIn>

      {submitted ? (
        <FadeIn>
          <div
            style={{
              background: 'hsl(var(--teal) / 0.1)',
              border: '1px solid hsl(var(--teal) / 0.3)',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              color: 'hsl(var(--teal))',
              fontFamily: 'Fira Code, monospace',
            }}
          >
            Message sent! I'll get back to you soon.
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.15}>
          <form onSubmit={handleSubmit} noValidate style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-grid">
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.4rem', color: 'hsl(var(--slate-light))' }}>
                  Your name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Brennan O'Halloran"
                  style={inputStyle(errors.name)}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--teal))' }}
                  onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.name ? '#ff7b7b' : 'hsl(var(--border-col))' }}
                />
                {errors.name && <p style={{ color: '#ff7b7b', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.4rem', color: 'hsl(var(--slate-light))' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={inputStyle(errors.email)}
                  onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--teal))' }}
                  onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.email ? '#ff7b7b' : 'hsl(var(--border-col))' }}
                />
                {errors.email && <p style={{ color: '#ff7b7b', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.4rem', color: 'hsl(var(--slate-light))' }}>
                What would you like to say?
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Your message..."
                style={{ ...inputStyle(errors.message), resize: 'vertical' }}
                onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--teal))' }}
                onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = errors.message ? '#ff7b7b' : 'hsl(var(--border-col))' }}
              />
              {errors.message && <p style={{ color: '#ff7b7b', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.message}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-outline"
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Sending...' : 'Send Message'} <Send size={15} />
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {/* Social links */}
      <FadeIn delay={0.2}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
          {[
            { href: personal.github, icon: <ExternalLink size={20} />, label: 'GitHub' },
            { href: personal.linkedin, icon: <ExternalLink size={20} />, label: 'LinkedIn' },
            { href: `mailto:${personal.email}`, icon: <Mail size={20} />, label: 'Email' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              style={{ color: 'hsl(var(--slate))', transition: 'color 0.2s, transform 0.2s', display: 'flex' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))'
                ;(e.currentTarget as HTMLElement).style.transform = 'none'
              }}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </FadeIn>

      <style>{`
        @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
