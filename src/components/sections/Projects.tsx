import { motion } from 'framer-motion'
import { ExternalLink, GitBranch, Sparkles, Folder } from 'lucide-react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects, type Project } from '../../data/projects'

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

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          title="View source on GitHub"
          style={{ color: 'hsl(var(--slate))', transition: 'color 0.2s', display: 'flex' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))' }}
        >
          <GitBranch size={18} />
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View live demo"
          title="View live demo"
          style={{ color: 'hsl(var(--slate))', transition: 'color 0.2s', display: 'flex' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))' }}
        >
          <ExternalLink size={18} />
        </a>
      )}
    </div>
  )
}

function ProjectMedia({ project }: { project: Project }) {
  const media = project.video ? (
    <video
      src={project.video}
      autoPlay
      muted
      loop
      playsInline
      controls
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  ) : project.gif ? (
    <img src={project.gif} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  ) : project.image ? (
    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  ) : null

  if (media) {
    return (
      <div
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid hsl(var(--border-col))',
          aspectRatio: '16 / 10',
          background: 'hsl(var(--navy))',
        }}
      >
        {media}
      </div>
    )
  }

  // Decorative panel for media-less featured projects
  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid hsl(var(--teal) / 0.25)',
        aspectRatio: '16 / 10',
        background:
          'radial-gradient(circle at 30% 30%, hsl(var(--teal) / 0.12), transparent 60%), hsl(var(--navy-light))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1.5rem',
      }}
    >
      <Sparkles size={40} style={{ color: 'hsl(var(--teal))' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
        {project.tech.slice(0, 4).map((t) => (
          <span key={t} className="skill-pill" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function FeaturedRow({ project, index }: { project: Project; index: number }) {
  const mediaRight = index % 2 === 1
  return (
    <FadeIn delay={0.05}>
      <div className={`featured-row${mediaRight ? ' reverse' : ''}`}>
        <div className="featured-media">
          <ProjectMedia project={project} />
        </div>
        <div className="featured-content">
          <p style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.75rem', color: 'hsl(var(--teal))', marginBottom: '0.5rem' }}>
            Featured Project
          </p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'hsl(var(--slate-light))', marginBottom: '1rem' }}>
            {project.title}
          </h3>
          <div
            style={{
              background: 'hsl(var(--navy-light))',
              border: '1px solid hsl(var(--border-col))',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}
          >
            {project.description}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {project.tech.map((t) => (
              <span key={t} className="skill-pill" style={{ fontSize: '0.72rem', padding: '0.22rem 0.55rem' }}>
                {t}
              </span>
            ))}
          </div>
          <ProjectLinks project={project} />
        </div>
      </div>
    </FadeIn>
  )
}

function GridCard({ project, index }: { project: Project; index: number }) {
  return (
    <FadeIn delay={index * 0.08}>
      <div className="project-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <Folder size={28} style={{ color: 'hsl(var(--teal))' }} />
          <ProjectLinks project={project} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'hsl(var(--slate-light))', marginBottom: '0.625rem' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.7, flex: 1 }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
          {project.tech.map((t) => (
            <span key={t} className="skill-pill" style={{ fontSize: '0.72rem', padding: '0.22rem 0.55rem' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const other = projects.filter((p) => !p.featured)

  return (
    <section id="projects" style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <FadeIn>
        <h2 className="section-heading" data-number="03.">
          Things I've Built
        </h2>
      </FadeIn>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {featured.map((project, i) => (
          <FeaturedRow key={project.title} project={project} index={i} />
        ))}
      </div>

      {other.length > 0 && (
        <>
          <FadeIn>
            <h3
              style={{
                fontFamily: 'Fira Code, monospace',
                fontSize: '1.1rem',
                color: 'hsl(var(--slate-light))',
                textAlign: 'center',
                margin: '4rem 0 2rem',
              }}
            >
              Other Noteworthy Projects
            </h3>
          </FadeIn>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {other.map((project, i) => (
              <GridCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </>
      )}

      <style>{`
        .featured-row {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2.5rem;
          align-items: center;
        }
        .featured-row.reverse .featured-media { order: 2; }
        @media (max-width: 800px) {
          .featured-row,
          .featured-row.reverse { grid-template-columns: 1fr; gap: 1.5rem; }
          .featured-row.reverse .featured-media { order: 0; }
        }
      `}</style>
    </section>
  )
}
