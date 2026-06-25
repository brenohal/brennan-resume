import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { experience } from '../../data/experience'

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

export default function Experience() {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = experience[activeIdx]

  return (
    <section
      id="experience"
      style={{
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <FadeIn>
        <h2 className="section-heading" data-number="02.">
          Where I've Worked
        </h2>
      </FadeIn>

      <div
        style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}
        className="exp-layout"
      >
        {/* Tab list */}
        <FadeIn delay={0.1}>
          <div
            role="tablist"
            aria-label="Companies"
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '2px solid hsl(var(--border-col))',
              minWidth: '200px',
              flexShrink: 0,
            }}
            className="exp-tabs"
          >
            {experience.map((job, i) => (
              <button
                key={`${job.company}-${job.dates}`}
                role="tab"
                aria-selected={activeIdx === i}
                onClick={() => setActiveIdx(i)}
                style={{
                  fontFamily: 'Fira Code, monospace',
                  fontSize: '0.8125rem',
                  textAlign: 'left',
                  padding: '0.75rem 1.25rem',
                  background: activeIdx === i ? 'hsl(var(--teal) / 0.1)' : 'none',
                  border: 'none',
                  borderLeft: `2px solid ${activeIdx === i ? 'hsl(var(--teal))' : 'transparent'}`,
                  marginLeft: '-2px',
                  color: activeIdx === i ? 'hsl(var(--teal))' : 'hsl(var(--slate))',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (activeIdx !== i) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))'
                  ;(e.currentTarget as HTMLElement).style.background = 'hsl(var(--teal) / 0.05)'
                }}
                onMouseLeave={(e) => {
                  if (activeIdx !== i) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))'
                  ;(e.currentTarget as HTMLElement).style.background = activeIdx === i ? 'hsl(var(--teal) / 0.1)' : 'none'
                }}
              >
                {job.company}
                <br />
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{job.role}</span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Content panel */}
        <div style={{ flex: 1, paddingLeft: '2.5rem' }} className="exp-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'hsl(var(--slate-light))' }}>
                  {active.role}{' '}
                  <span style={{ color: 'hsl(var(--teal))' }}>@ {active.company}</span>
                  {active.current && (
                    <span
                      style={{
                        marginLeft: '0.75rem',
                        fontFamily: 'Fira Code, monospace',
                        fontSize: '0.7rem',
                        background: 'hsl(var(--teal) / 0.15)',
                        color: 'hsl(var(--teal))',
                        border: '1px solid hsl(var(--teal) / 0.3)',
                        borderRadius: '20px',
                        padding: '0.15rem 0.6rem',
                        verticalAlign: 'middle',
                      }}
                    >
                      Current
                    </span>
                  )}
                </h3>
                <p
                  style={{
                    fontFamily: 'Fira Code, monospace',
                    fontSize: '0.8125rem',
                    color: 'hsl(var(--slate))',
                    marginTop: '0.25rem',
                  }}
                >
                  {active.dates} &bull; {active.location}
                </p>
              </div>

              <ul style={{ listStyle: 'none', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {active.bullets.map((bullet, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'hsl(var(--teal))', flexShrink: 0, marginTop: '3px', fontSize: '0.875rem' }}>▹</span>
                    <span style={{ lineHeight: 1.7, fontSize: '0.9375rem' }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .exp-layout { flex-direction: column !important; }
          .exp-tabs { flex-direction: row !important; border-left: none !important; border-bottom: 2px solid hsl(var(--border-col)) !important; overflow-x: auto; min-width: 0 !important; width: 100%; }
          .exp-tabs button { border-left: none !important; border-bottom: 2px solid transparent; margin-left: 0 !important; margin-bottom: -2px; white-space: nowrap; }
          .exp-tabs button[aria-selected="true"] { border-bottom-color: hsl(var(--teal)) !important; }
          .exp-content { padding-left: 0 !important; padding-top: 1.5rem; }
        }
      `}</style>
    </section>
  )
}
