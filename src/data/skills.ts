export interface SkillCategory {
  label: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    skills: ['HTML', 'CSS', 'Java', 'JavaScript', 'SQL', 'T-SQL', 'Python'],
  },
  {
    label: 'Security & IAM',
    skills: [
      'Kali Linux',
      'Burp Suite',
      'OWASP ZAP',
      'Splunk',
      'SentinelOne',
      'Palo Alto Panorama',
      'Microsoft Entra ID',
      'Torq',
    ],
  },
  {
    label: 'Platforms & Tools',
    skills: [
      'Selenium',
      'MySQL Workbench',
      'Microsoft SQL Server',
      'Google Cloud Platform',
      'OBS Studio',
      'LLM APIs',
      'VS Code',
      'Microsoft Office',
      'Google Workspace',
      'Windows',
      'macOS',
    ],
  },
]

export const allSkills = skillCategories.flatMap((c) => c.skills)
