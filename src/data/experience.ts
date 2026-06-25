export interface ExperienceItem {
  company: string
  role: string
  dates: string
  location: string
  bullets: string[]
  current?: boolean
}

export const experience: ExperienceItem[] = [
  {
    company: 'Henry Schein',
    role: 'Cybersecurity Intern',
    dates: 'June 2026 – Present',
    location: 'Remote',
    current: true,
    bullets: [
      'Conducting GSOC alert analysis using Torq to identify over-triggering detection rules; investigating root causes to reduce false positive rates and improve signal fidelity across the security operations environment.',
    ],
  },
  {
    company: 'Henry Schein',
    role: 'Cybersecurity Intern',
    dates: 'May 2025 – August 2025',
    location: 'Remote',
    bullets: [
      'Analyzed and standardized global firewall rulesets across core and remote entities using Palo Alto Panorama; reduced total rules by 14% through Python-based automation aligned with least-access principles.',
      'Assessed and implemented strategies to reduce endpoint risk by restricting access to malicious websites and limiting executable file downloads, mitigating user compromise and minimizing device reimaging.',
      'Co-led analysis of customer authentication and authorization processes across external-facing platforms; supported development of a transition strategy to enable centralized access control via Microsoft Entra ID.',
    ],
  },
  {
    company: 'Henry Schein',
    role: 'Digital Architecture Intern',
    dates: 'May 2024 – August 2024',
    location: 'Remote',
    bullets: [
      'Conducted comprehensive performance testing on a new global e-commerce platform using Selenium to automate test cases, ensuring efficiency and reliability in the software development lifecycle.',
      'Executed security testing using Burp Suite and OWASP ZAP to identify and remove vulnerabilities, enhancing the security of Henry Schein\'s web applications.',
      'Developed and optimized MySQL scripts to convert JSON data into Excel sheets, streamlining data analysis and reporting, improving data visualization and decision-making for leadership.',
    ],
  },
  {
    company: 'Florida State Men\'s Lacrosse',
    role: 'Streaming & AV Production',
    dates: 'September 2024 – May 2026',
    location: 'Tallahassee, FL',
    bullets: [
      'Set up and operated all video production equipment to livestream practices and games using OBS Studio and Adobe Photoshop; provided live commentary, managed real-time statistics, and updated scoreboard graphics.',
    ],
  },
]
