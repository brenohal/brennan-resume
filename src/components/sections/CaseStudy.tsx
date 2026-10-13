import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { caseStudy } from '../../data/caseStudy'

export default function CaseStudy() {
  const { ref, isInView } = useScrollReveal(0.1)
  return (
    <motion.article
      ref={ref}
      className="case-study"
      aria-labelledby="case-study-title"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <p className="case-eyebrow">{caseStudy.eyebrow}</p>
      <h3 id="case-study-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--slate-light))', marginBottom: '0.75rem' }}>
        {caseStudy.title}
      </h3>
      <p style={{ lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '62ch' }}>{caseStudy.summary}</p>

      <ol className="case-flow" aria-label="How the system fits together">
        {caseStudy.flow.map((step) => (
          <li key={step.title} className={step.accent ? 'accent' : undefined}>
            <strong>{step.title}</strong>
            {step.detail}
          </li>
        ))}
      </ol>

      <div className="case-cols">
        <div>
          <h4>The problem</h4>
          <p>{caseStudy.problem}</p>
          <h4 style={{ marginTop: '1.5rem' }}>The result</h4>
          <p>{caseStudy.result}</p>
        </div>
        <div>
          <h4>What I built</h4>
          <ul>
            {caseStudy.built.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
        {caseStudy.stack.map((t) => (
          <span key={t} className="skill-pill" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            {t}
          </span>
        ))}
      </div>

      <p className="case-note">{caseStudy.note}</p>
    </motion.article>
  )
}
