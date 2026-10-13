import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { personal } from '../../data/personal'
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

const SOCIAL_LINKS = [
  { href: personal.github, icon: <GithubIcon size={20} />, label: 'GitHub', external: true },
  { href: personal.linkedin, icon: <LinkedinIcon size={20} />, label: 'LinkedIn', external: true },
  { href: `mailto:${personal.email}`, icon: <Mail size={20} />, label: 'Email', external: false },
]

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

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

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field so keyboard + screen-reader users land on it
      const first = (['name', 'email', 'message'] as const).find((k) => found[k])
      if (first) (ev.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }
    // No backend: hand the message to the visitor's email client.
    const subject = encodeURIComponent(`Portfolio contact from ${form.name.trim()}`)
    const body = encodeURIComponent(`Name: ${form.name.trim()}\nReply-to: ${form.email.trim()}\n\n${form.message.trim()}`)
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

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
        <p style={{ lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          {personal.contactCopy}
        </p>
      </FadeIn>

      {submitted ? (
        <FadeIn>
          <div
            role="status"
            style={{
              background: 'hsl(var(--teal) / 0.1)',
              border: '1px solid hsl(var(--teal) / 0.3)',
              borderRadius: 'var(--radius)',
              padding: '1.75rem 1.5rem',
              color: 'hsl(var(--slate-light))',
              lineHeight: 1.7,
            }}
          >
            <p style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--teal))', marginBottom: '0.5rem' }}>
              Your email app should be open.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Hit send there to deliver your message. If nothing opened, email me directly at{' '}
              <a href={`mailto:${personal.email}`} style={{ color: 'hsl(var(--teal))' }}>
                {personal.email}
              </a>
              .
            </p>
            <button
              type="button"
              className="btn-outline btn-secondary"
              style={{ marginTop: '1.25rem', fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
              onClick={() => setSubmitted(false)}
            >
              Back to the form
            </button>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.15}>
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

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button type="submit" className="btn-outline">
                Send Message <Send size={15} />
              </button>
            </div>
          </form>
        </FadeIn>
      )}

      {/* Social links */}
      <FadeIn delay={0.2}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={link.label}
              title={link.label}
              className="icon-btn lift"
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
