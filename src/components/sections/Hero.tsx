import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, MessageCircle, Download } from 'lucide-react'
import Starfield from '../ui/Starfield'
import Typewriter from '../ui/Typewriter'
import { personal } from '../../data/personal'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <Starfield />

      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', paddingTop: '70px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: 'Fira Code, monospace', color: 'hsl(var(--teal))', fontSize: '1rem', marginBottom: '1.25rem' }}
        >
          {personal.greeting}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800,
            color: 'hsl(var(--slate-light))',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          {personal.tagline}
        </motion.h1>

        <motion.h2
          className="hero-role"
          aria-label={personal.roles.join(', ')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: 'hsl(var(--slate))',
            marginBottom: '2rem',
            lineHeight: 1.2,
          }}
        >
          <Typewriter words={personal.roles} />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            maxWidth: '520px',
            lineHeight: 1.7,
            fontSize: '1rem',
            marginBottom: '2.5rem',
            color: 'hsl(var(--slate))',
          }}
        >
          {personal.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
        >
          <a
            href={personal.resumeUrl}
            download="Brennan_OHalloran_Resume.pdf"
            className="btn-outline btn-primary"
          >
            Download Resume <Download size={16} />
          </a>
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline btn-secondary"
          >
            View My Experience <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline btn-secondary"
          >
            Get In Touch <MessageCircle size={16} />
          </button>
        </motion.div>
      </div>

      {/* Scroll-down cue */}
      <motion.button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'hsl(var(--slate))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          fontFamily: 'Fira Code, monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          padding: '0.5rem 1rem',
        }}
      >
        Scroll
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ display: 'flex', color: 'hsl(var(--teal))' }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.button>
    </section>
  )
}
