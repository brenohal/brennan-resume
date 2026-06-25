import { personal } from '../../data/personal'

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1.5rem 2rem',
        fontFamily: 'Fira Code, monospace',
        fontSize: '0.8125rem',
        color: 'hsl(var(--slate))',
        borderTop: '1px solid hsl(var(--border-col))',
      }}
    >
      <a
        href={personal.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'inherit',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--teal))' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'hsl(var(--slate))' }}
      >
        {personal.footer}
      </a>
    </footer>
  )
}
