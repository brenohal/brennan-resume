import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { GraduationCap, Briefcase, ShieldCheck, FolderGit2 } from 'lucide-react'
import { stats, type Stat } from '../../data/stats'

const ICONS: Record<Stat['icon'], React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  gpa: GraduationCap,
  intern: Briefcase,
  firewall: ShieldCheck,
  projects: FolderGit2,
}

function useCountUp(target: number, decimals: number, run: boolean, duration = 1400) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, duration, reduce])

  return value.toFixed(decimals)
}

function StatCard({ stat, run, delay }: { stat: Stat; run: boolean; delay: number }) {
  const display = useCountUp(stat.value, stat.decimals ?? 0, run)
  const Icon = ICONS[stat.icon]
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={run ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Icon size={22} style={{ color: 'hsl(var(--teal))', marginBottom: '0.75rem' }} />
      <div className="stat-value">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section aria-label="Key stats" style={{ padding: '2rem 0 1rem' }}>
      <div className="stats-band" ref={ref}>
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} run={inView} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}
