export interface Stat {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  icon: 'gpa' | 'intern' | 'firewall' | 'projects'
}

// All figures are truthful and sourced from the resume / data files.
export const stats: Stat[] = [
  { value: 3.86, decimals: 2, label: 'GPA · Magna Cum Laude', icon: 'gpa' },
  { value: 3, suffix: '×', label: 'Henry Schein Internships', icon: 'intern' },
  { value: 14, suffix: '%', label: 'Firewall Rules Reduced', icon: 'firewall' },
  { value: 5, suffix: '+', label: 'Projects Built', icon: 'projects' },
]
