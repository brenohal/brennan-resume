import { personal } from '../../data/personal'
import { site } from '../../site.config'

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1.5rem 2rem 2rem',
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
        className="text-link"
        style={{ display: 'inline-block', padding: '0.85rem 0.5rem' }}
      >
        {personal.footer}
      </a>
      {/* Derived from the same config that switches analytics on, so this line can never drift from reality */}
      <p className="site-note">
        {site.goatcounter
          ? 'Static site · strict Content-Security-Policy · no cookies · anonymous, cookie-free page counts (GoatCounter)'
          : 'Static site · strict Content-Security-Policy · self-hosted fonts · no cookies, no trackers'}
      </p>
    </footer>
  )
}
