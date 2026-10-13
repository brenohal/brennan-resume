import { personal } from './personal'
import { experience } from './experience'
import { education, certifications } from './education'
import { skillCategories } from './skills'
import { projects } from './projects'
import { caseStudy } from './caseStudy'
import { involvement } from './involvement'

export interface Intent {
  keywords: string[]
  answer: string
}

// Quick answers, not an AI: a keyword matcher over text that is BUILT from the same data files
// that render the page (experience, education, skills, projects...). Edit those files and these
// answers change with them, so the assistant can never contradict the site.
const list = (xs: string[]) => (xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1]}`)
const lower = (s: string) => `${s.charAt(0).toLowerCase()}${s.slice(1)}`

const current = experience.find((job) => job.current)
const earlierAtCurrent = experience.filter((job) => job.company === current?.company && job !== current)
const firewallJob = experience.find((job) => /firewall/i.test(job.headline))
const lacrosse = involvement.find((item) => /lacrosse/i.test(item.org))

export const greeting =
  "Hi! These are quick answers about Brennan, built from this site's own content (scripted, not an AI). Ask about his experience, skills, projects, education, or how to get in touch."

export const suggestions = ['What are your skills?', 'Tell me about Henry Schein', 'Best project?', 'Are you available?']

export const fallback =
  "I'm not sure about that one. Try asking about Brennan's skills, his Henry Schein work, his projects, education, certifications, or how to reach him."

export const intents: Intent[] = [
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'tool', 'know', 'good at'],
    answer: `Brennan's skills: ${skillCategories.map((c) => `${c.label}: ${list(c.skills)}`).join('. ')}.`,
  },
  {
    keywords: ['henry', 'schein', 'intern', 'internship', 'work', 'job', 'experience', 'cyber', 'soc', 'role'],
    answer: current
      ? `Brennan is currently ${current.role} at ${current.company} (${current.dates}): ${lower(current.headline)} Earlier at ${current.company}: ${earlierAtCurrent
          .map((job) => `${job.role} (${job.dates}), ${lower(job.headline)}`)
          .join(' ')}`
      : `Brennan's most recent role: ${experience[0].role} at ${experience[0].company}.`,
  },
  {
    keywords: ['firewall', 'panorama', 'palo alto', '14'],
    answer: firewallJob?.bullets[0] ?? 'Ask about his Henry Schein internships for details on his firewall work.',
  },
  {
    keywords: ['project', 'built', 'build', 'portfolio', 'github', 'best', 'favorite', 'career'],
    answer: `His flagship project is the ${caseStudy.title}: ${caseStudy.summary} Other projects: ${list(projects.map((p) => p.title))}. The flagship's repository is private, so Brennan is happy to walk through it on request; other code is at github.com/brenohal.`,
  },
  {
    keywords: ['education', 'school', 'fsu', 'florida', 'degree', 'gpa', 'study', 'college', 'graduate', 'major'],
    answer: `Brennan graduated in ${education.graduated} with a ${education.degree} from ${education.school} (${education.minor.replace('Minor: ', 'minor in ')}). GPA ${education.gpa}, ${education.honor}. Honors: ${list(education.honors)}.`,
  },
  {
    keywords: ['cert', 'certification', 'security+', 'comptia'],
    answer: certifications.length
      ? `Certifications: ${list(certifications.map((c) => `${c.name} (${c.status})`))}.`
      : 'Brennan has no certifications listed yet.',
  },
  {
    keywords: ['contact', 'reach', 'email', 'hire', 'available', 'availability', 'opportunit', 'connect', 'get in touch'],
    answer: `${personal.status}. Email him at ${personal.email}, connect on LinkedIn (${personal.linkedin.replace('https://www.', '')}), or use the contact section at the bottom of the page.`,
  },
  {
    keywords: ['lacrosse', 'stream', 'av', 'production', 'sport', 'obs', 'broadcast'],
    answer: lacrosse
      ? `Outside of tech: ${lacrosse.role} for ${lacrosse.org}. ${lacrosse.description}`
      : 'Ask about his involvement outside of tech.',
  },
  {
    keywords: ['who', 'about', 'yourself', 'you', 'brennan', 'background'],
    answer: `${personal.name}: ${personal.bio}`,
  },
  {
    keywords: ['resume', 'cv', 'download'],
    answer: 'You can download his full resume with the "Download Resume" button at the top of the page.',
  },
]

export function matchAnswer(input: string): string {
  const text = input.toLowerCase()
  let best: { score: number; answer: string } | null = null
  for (const intent of intents) {
    // Longer keywords are more specific ("firewall" should beat "work"), so weight hits by length
    const score = intent.keywords.reduce((n, kw) => (text.includes(kw) ? n + kw.length : n), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, answer: intent.answer }
  }
  return best ? best.answer : fallback
}
