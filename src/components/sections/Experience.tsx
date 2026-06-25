import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Quote } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { experience } from '../../data/experience'
import { involvement } from '../../data/involvement'

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

function SkillTag({ label, variant }: { label: string; variant: 'tech' | 'soft' }) {
  if (variant === 'tech') {
    return (
      <span className="skill-pill" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
        {label}
      </span>
    )
  }
  return (
    <span
      style={{
        fontFamily: 'Fira Code, monospace',
        fontSize: '0.75rem',
        padding: '0.25rem 0.6rem',
        borderRadius: '0.25rem',
        color: 'hsl(var(--slate))',
        border: '1px solid hsl(var(--border-col))',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function SkillGroup({ label, items, variant }: { label: string; items: string[]; variant: 'tech' | 'soft' }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'Fira Code, monospace',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: variant === 'tech' ? 'hsl(var(--teal))' : 'hsl(var(--slate))',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {items.map((s) => (
          <SkillTag key={s} label={s} variant={variant} />
        ))}
      </div>
    </div>
  )
}

function ExperienceCard({ job, isOpen, onToggle }: {
  job: typeof experience[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        background: 'hsl(var(--navy-light))',
        border: `1px solid ${isOpen ? 'hsl(var(--teal) / 0.35)' : 'hsl(var(--border-col))'}`,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'hsl(var(--slate-light))' }}>
              {job.role} <span style={{ color: 'hsl(var(--teal))' }}>@ {job.company}</span>
            </h3>
            {job.current && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'Fira Code, monospace',
                  fontSize: '0.7rem',
                  background: 'hsl(var(--teal) / 0.15)',
                  color: 'hsl(var(--teal))',
                  border: '1px solid hsl(var(--teal) / 0.5)',
                  borderRadius: '20px',
                  padding: '0.15rem 0.55rem',
                }}
              >
                <span
                  className="dot-pulse"
                  style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(var(--teal))', display: 'inline-block' }}
                />
                Current
              </span>
            )}
            {job.highlight && (
              <span
                title={job.highlight}
                style={{
                  fontFamily: 'Fira Code, monospace',
                  fontSize: '0.7rem',
                  color: '#ffd479',
                }}
              >
                ★ DoD
              </span>
            )}
          </div>
          <p style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.8125rem', color: 'hsl(var(--slate))', marginTop: '0.3rem' }}>
            {job.dates} &bull; {job.location}
          </p>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ color: 'hsl(var(--teal))', display: 'flex', flexShrink: 0 }}>
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {job.highlight && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'hsl(var(--teal) / 0.08)',
                    border: '1px solid hsl(var(--teal) / 0.25)',
                    borderRadius: 'var(--radius)',
                    padding: '0.6rem 0.9rem',
                    color: '#ffd479',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  <span aria-hidden="true">★</span> {job.highlight}
                </div>
              )}

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {job.bullets.map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'hsl(var(--teal))', flexShrink: 0, marginTop: '3px', fontSize: '0.875rem' }}>▹</span>
                    <span style={{ lineHeight: 1.7, fontSize: '0.9375rem' }}>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {job.technicalSkills && <SkillGroup label="Technical Skills" items={job.technicalSkills} variant="tech" />}
                {job.transferableSkills && <SkillGroup label="Transferable Skills" items={job.transferableSkills} variant="soft" />}
              </div>

              {job.keyTakeaway && (
                <div
                  style={{
                    borderLeft: '2px solid hsl(var(--teal))',
                    paddingLeft: '1rem',
                  }}
                >
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontFamily: 'Fira Code, monospace',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'hsl(var(--teal))',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Quote size={13} /> Key Takeaway
                  </p>
                  <p style={{ lineHeight: 1.75, fontSize: '0.9rem', color: 'hsl(var(--slate))' }}>{job.keyTakeaway}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Experience() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="experience" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <FadeIn>
        <h2 className="section-heading" data-number="02.">
          Where I've Worked
        </h2>
      </FadeIn>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {experience.map((job, i) => (
          <FadeIn key={`${job.company}-${job.dates}`} delay={i * 0.06}>
            <ExperienceCard job={job} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
          </FadeIn>
        ))}
      </div>

      {/* Leadership & Involvement */}
      <FadeIn>
        <h3
          style={{
            fontFamily: 'Fira Code, monospace',
            fontSize: '1.1rem',
            color: 'hsl(var(--slate-light))',
            margin: '3.5rem 0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ color: 'hsl(var(--teal))', fontSize: '0.9rem' }}>03.5</span>
          Leadership &amp; Involvement
        </h3>
      </FadeIn>

      <div className="involvement-grid">
        {involvement.map((item, i) => (
          <FadeIn key={item.org} delay={i * 0.08}>
            <div
              style={{
                background: 'hsl(var(--navy-light))',
                border: '1px solid hsl(var(--border-col))',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(var(--slate-light))' }}>{item.role}</h4>
              <p style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.78rem', color: 'hsl(var(--teal))', marginTop: '0.2rem' }}>
                {item.org}
              </p>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.75rem', flex: 1 }}>{item.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                {item.tags.map((t) => (
                  <SkillTag key={t} label={t} variant="soft" />
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <style>{`
        .involvement-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 860px) { .involvement-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}
