import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Folder, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects } from '../../data/projects'

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

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasMedia = project.video || project.image || project.gif

  return (
    <FadeIn delay={index * 0.08}>
      <div className="project-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Media preview */}
        {hasMedia && (
          <div
            style={{
              marginBottom: '1rem',
              borderRadius: '6px',
              overflow: 'hidden',
              background: 'hsl(var(--navy))',
              aspectRatio: '16/9',
              position: 'relative',
            }}
          >
            {project.video && expanded ? (
              <video
                src={project.video}
                controls
                autoPlay
                muted
                loop
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : project.gif ? (
              <img
                src={project.gif}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
            {project.video && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'hsl(var(--navy) / 0.6)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'hsl(var(--teal))',
                }}
              >
                <Play size={32} />
              </button>
            )}
          </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <Folder size={28} style={{ color: 'hsl(var(--teal))' }} />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{ color: 'hsl(var(--slate))', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))' }}
              >
                <ExternalLink size={18} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                style={{ color: 'hsl(var(--slate))', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))' }}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'hsl(var(--slate-light))',
            marginBottom: '0.625rem',
            cursor: project.video ? 'pointer' : 'default',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate-light))' }}
        >
          {project.title}
        </h3>

        <p style={{ fontSize: '0.875rem', lineHeight: 1.7, flex: 1 }}>{project.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'Fira Code, monospace',
                fontSize: '0.75rem',
                color: 'hsl(var(--teal))',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const featured = projects.filter((p) => p.featured)
  const other = projects.filter((p) => !p.featured)
  const visible = showAll ? projects : featured

  return (
    <section
      id="projects"
      style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
    >
      <FadeIn>
        <h2 className="section-heading" data-number="03.">
          Things I've Built
        </h2>
      </FadeIn>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {visible.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>

      {other.length > 0 && (
        <FadeIn delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="btn-outline"
              style={{ gap: '0.5rem' }}
            >
              {showAll ? 'Show Less' : `Show More (${other.length} more)`}
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.3}>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', opacity: 0.6 }}>
          More projects in progress.
        </p>
      </FadeIn>
    </section>
  )
}
