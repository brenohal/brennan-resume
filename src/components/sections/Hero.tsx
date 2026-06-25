import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Starfield from '../ui/Starfield'
import Typewriter from '../ui/Typewriter'
import { personal } from '../../data/personal'

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        overflow: 'hidden',
      }}
    >
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
        >
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline"
          >
            View My Experience <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
