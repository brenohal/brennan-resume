import { useState, useEffect } from 'react'
import { Menu, X, SquareTerminal } from 'lucide-react'
import { useActiveSection } from '../../hooks/useActiveSection'
import Terminal from '../ui/Terminal'
import { personal } from '../../data/personal'

const NAV_ITEMS = [
  { label: 'About', id: 'about', num: '01' },
  { label: 'Experience', id: 'experience', num: '02' },
  { label: 'Projects', id: 'projects', num: '03' },
  { label: 'Contact', id: 'contact', num: '04' },
]

function scrollTo(id: string) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [termOpen, setTermOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(['about', 'experience', 'projects', 'contact'])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  function handleNavClick(id: string) {
    scrollTo(id)
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className="glass-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: scrolled ? '0 10px 30px -15px hsl(217 53% 5% / 0.7)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <nav
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 2rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo('home')}
            aria-label="Go to top"
            style={{
              fontFamily: 'Fira Code, monospace',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'hsl(var(--teal))',
              background: 'none',
              border: '2px solid hsl(var(--teal))',
              borderRadius: '6px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(var(--teal) / 0.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            B
          </button>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            <ol style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="nav-link"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: active === item.id ? 'hsl(var(--teal))' : undefined,
                      padding: 0,
                    }}
                  >
                    <span className="num">{item.num}.</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ol>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setTermOpen((v) => !v)}
                aria-label="Toggle terminal"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: termOpen ? 'hsl(var(--teal))' : 'hsl(var(--slate))',
                  display: 'flex',
                  transition: 'color 0.2s',
                  padding: '0.25rem',
                }}
                title="Toggle terminal"
              >
                <SquareTerminal size={18} />
              </button>

              <a
                href={personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
              >
                Resume
              </a>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="show-mobile">
            <button
              onClick={() => setTermOpen((v) => !v)}
              aria-label="Toggle terminal"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: termOpen ? 'hsl(var(--teal))' : 'hsl(var(--slate))',
                display: 'flex',
              }}
            >
              <SquareTerminal size={18} />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--teal))', display: 'flex' }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Terminal overlay */}
      {termOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
          }}
        >
          <Terminal onClose={() => setTermOpen(false)} onNavigate={(id) => { scrollTo(id); setTermOpen(false) }} />
        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'hsl(var(--navy-light))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    fontFamily: 'Fira Code, monospace',
                    fontSize: '1.25rem',
                    color: 'hsl(var(--slate-light))',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span style={{ color: 'hsl(var(--teal))', fontSize: '0.875rem' }}>{item.num}.</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            onClick={() => setMenuOpen(false)}
          >
            Resume
          </a>
        </div>
      )}

      {/* Hide/show helpers — inline style approach for TS */}
      <style>{`
        .hidden-mobile { display: flex !important; }
        .show-mobile { display: none !important; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
