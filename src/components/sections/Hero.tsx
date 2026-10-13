import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown, MessageCircle, Download, ShieldCheck, Calculator, GraduationCap } from 'lucide-react'
import Starfield from '../ui/Starfield'
import { personal } from '../../data/personal'
import { track } from '../../lib/analytics'

const PROOF = [
  { icon: ShieldCheck, text: '14% fewer firewall rules' },
  { icon: Calculator, text: 'Cyber risk quantified with the FAIR model' },
  { icon: GraduationCap, text: '3.86 GPA · Magna Cum Laude' },
]

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export default function Hero() {
  return (
    <section id="home" className="hero">
      <Starfield />

      <div className="hero-inner">
        <motion.div {...reveal(0.1)}>
          <span className="status-pill">
            <span className="status-dot dot-pulse" aria-hidden="true" />
            {personal.status}
          </span>
        </motion.div>

        <motion.h1
          {...reveal(0.2)}
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800,
            color: 'hsl(var(--slate-light))',
            lineHeight: 1.1,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          {personal.tagline}
        </motion.h1>

        <motion.p
          {...reveal(0.3)}
          style={{
            fontSize: 'clamp(1.35rem, 3.6vw, 2.25rem)',
            fontWeight: 700,
            color: 'hsl(var(--slate))',
            marginBottom: '1.5rem',
            lineHeight: 1.25,
            maxWidth: '22em',
          }}
        >
          {personal.headline}
        </motion.p>

        <motion.p
          {...reveal(0.4)}
          style={{
            maxWidth: '560px',
            lineHeight: 1.7,
            fontSize: '1rem',
            marginBottom: '1.75rem',
            color: 'hsl(var(--slate))',
          }}
        >
          {personal.bio}
        </motion.p>

        <motion.ul {...reveal(0.45)} className="proof-chips" aria-label="Highlights">
          {PROOF.map(({ icon: Icon, text }) => (
            <li key={text} className="proof-chip">
              <Icon size={16} aria-hidden="true" />
              {text}
            </li>
          ))}
        </motion.ul>

        <motion.div {...reveal(0.5)} className="hero-ctas">
          <a href={personal.resumeUrl} download="Brennan_OHalloran_Resume.pdf" onClick={() => track('resume-download-hero', 'Resume download (hero)')} className="btn-outline btn-primary">
            Download Resume <Download size={16} />
          </a>
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline btn-secondary"
          >
            <span className="lg-only">View My&nbsp;</span>Experience <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline btn-secondary"
          >
            <span className="lg-only">Get In Touch</span><span className="sm-only">Contact</span> <MessageCircle size={16} />
          </button>
        </motion.div>
      </div>

      {/* Scroll-down cue */}
      <motion.button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to about"
        className="scroll-cue"
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
