import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { personal } from '../../data/personal'

// Fixed vertical social rails (desktop only — hidden < 1024px via CSS).
export default function SocialRail() {
  return (
    <>
      <div className="social-rail left" aria-label="Social links">
        <a href={personal.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GithubIcon size={20} />
        </a>
        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedinIcon size={20} />
        </a>
        <a href={`mailto:${personal.email}`} aria-label="Email">
          <Mail size={20} />
        </a>
      </div>

      <div className="social-rail right">
        <a className="rail-email" href={`mailto:${personal.email}`}>
          {personal.email}
        </a>
      </div>
    </>
  )
}
