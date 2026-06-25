import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { personal } from '../../data/personal'
import { skillCategories } from '../../data/skills'
import { education, certifications } from '../../data/education'
import { GraduationCap, Award, Users } from 'lucide-react'

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

export default function About() {
  return (
    <section
      id="about"
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <FadeIn>
        <h2 className="section-heading" data-number="01.">
          About Me
        </h2>
      </FadeIn>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
          gap: '3rem',
          alignItems: 'start',
        }}
        className="about-grid"
      >
        {/* Bio */}
        <div>
          <FadeIn delay={0.1}>
            <p style={{ lineHeight: 1.8, marginBottom: '1.25rem' }}>{personal.bio}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>{personal.bioExtended}</p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p style={{ marginBottom: '1rem', color: 'hsl(var(--slate-light))' }}>
              Here are some technologies I've been working with:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skillCategories.flatMap((c) => c.skills).map((skill) => (
                <span key={skill} className="skill-pill">{skill}</span>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Headshot */}
          <FadeIn delay={0.15}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '280px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '8px',
                  border: '2px solid hsl(var(--teal))',
                  transform: 'translate(8px, 8px)',
                  zIndex: 0,
                }}
              />
              <img
                src={personal.headshot}
                alt="Brennan O'Halloran"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'grayscale(20%)',
                  transition: 'filter 0.3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'none' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(20%)' }}
              />
            </div>
          </FadeIn>

          {/* Education */}
          <FadeIn delay={0.25}>
            <div
              style={{
                background: 'hsl(var(--navy-light))',
                border: '1px solid hsl(var(--border-col))',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <GraduationCap size={16} style={{ color: 'hsl(var(--teal))' }} />
                <span style={{ color: 'hsl(var(--slate-light))', fontWeight: 600, fontSize: '0.9rem' }}>Education</span>
              </div>
              <p style={{ color: 'hsl(var(--slate-light))', fontSize: '0.875rem', fontWeight: 600 }}>{education.school}</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>{education.degree}</p>
              <p style={{ fontSize: '0.8125rem' }}>{education.minor}</p>
              <p style={{ fontSize: '0.8125rem', color: 'hsl(var(--teal))', marginTop: '0.25rem' }}>GPA: {education.gpa} &bull; {education.honor}</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>{education.dates}</p>
            </div>
          </FadeIn>

          {/* Honors & Activities */}
          <FadeIn delay={0.3}>
            <div
              style={{
                background: 'hsl(var(--navy-light))',
                border: '1px solid hsl(var(--border-col))',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Award size={16} style={{ color: 'hsl(var(--teal))' }} />
                <span style={{ color: 'hsl(var(--slate-light))', fontWeight: 600, fontSize: '0.9rem' }}>Honors & Involvement</span>
              </div>
              {[...education.honors, ...education.activities].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'hsl(var(--teal))', flexShrink: 0, marginTop: '2px' }}>▹</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Certifications */}
          <FadeIn delay={0.35}>
            <div
              style={{
                background: 'hsl(var(--navy-light))',
                border: '1px solid hsl(var(--border-col))',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Users size={16} style={{ color: 'hsl(var(--teal))' }} />
                <span style={{ color: 'hsl(var(--slate-light))', fontWeight: 600, fontSize: '0.9rem' }}>Certifications</span>
              </div>
              {certifications.map((cert) => (
                <div key={cert.name} style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'hsl(var(--slate-light))' }}>{cert.name}</span>
                  <span style={{ color: 'hsl(var(--teal))', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                    ({cert.status})
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
