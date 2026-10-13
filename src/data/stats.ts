export interface Stat {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  icon: 'gpa' | 'roles' | 'firewall' | 'tools'
  /** Section the card links to, as evidence for the number */
  href: string
}

// Every figure comes straight from the resume.
export const stats: Stat[] = [
  { value: 14, suffix: '%', label: 'Fewer firewall rules across global entities (Palo Alto Panorama)', icon: 'firewall', href: '#experience' },
  { value: 4, label: 'Roles at Henry Schein: 3 internships + SOC Analyst', icon: 'roles', href: '#experience' },
  { value: 7, label: 'Security tools used: Splunk, SentinelOne, Torq, Entra ID & more', icon: 'tools', href: '#about' },
  { value: 3.86, decimals: 2, label: 'GPA · Magna Cum Laude, Florida State', icon: 'gpa', href: '#about' },
]
