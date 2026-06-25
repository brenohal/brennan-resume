export interface Intent {
  keywords: string[]
  answer: string
}

// Scripted knowledge base. Facts mirror the typed data files (personal / experience
// / education / skills / projects). The matcher scores intents by keyword hits.
export const greeting =
  "Hi! I'm Brennan's assistant. Ask me about his experience, skills, projects, education, or how to get in touch."

export const suggestions = [
  'What are your skills?',
  'Tell me about Henry Schein',
  'Best project?',
  'Are you available?',
]

export const fallback =
  "I'm not sure about that one. Try asking about Brennan's skills, his Henry Schein internships, his projects, education, certifications, or how to reach him."

export const intents: Intent[] = [
  {
    keywords: ['skill', 'tech', 'stack', 'language', 'tool', 'know', 'good at'],
    answer:
      'Brennan works across security and engineering: Python, SQL/T-SQL, Java, and JavaScript for languages; Palo Alto Panorama, Microsoft Entra ID, Burp Suite, OWASP ZAP, Splunk, SentinelOne, and Torq for security & IAM; plus Selenium, Google Cloud Platform, MySQL, OBS Studio, and LLM APIs.',
  },
  {
    keywords: ['henry', 'schein', 'intern', 'internship', 'work', 'job', 'experience', 'cyber'],
    answer:
      'Brennan has interned at Henry Schein three times. Most recently (June 2026 - Present) as a Cybersecurity Intern doing GSOC alert analysis with Torq. In summer 2025 he standardized global firewall rulesets in Palo Alto Panorama, cutting total rules by 14% via Python automation. In 2024 he was a Digital Architecture Intern doing performance and security testing with Selenium, Burp Suite, and OWASP ZAP.',
  },
  {
    keywords: ['firewall', 'panorama', 'palo alto', '14'],
    answer:
      'During his 2025 Cybersecurity internship, Brennan analyzed and standardized global firewall rulesets across core and remote entities using Palo Alto Panorama, reducing total rules by 14% through Python-based automation aligned with least-access principles.',
  },
  {
    keywords: ['project', 'built', 'build', 'portfolio', 'github', 'best', 'favorite'],
    answer:
      'His standout project is an AI-Driven Job Application Engine that uses LLM-based code generation with multi-provider failover across Cerebras, Groq, OpenRouter, and DeepSeek. He has also built a full-stack Java CRUD app, a PHP mobile business card, an advanced T-SQL data warehouse, and a C++ cruise booking system. Code is on GitHub at github.com/brenohal.',
  },
  {
    keywords: ['education', 'school', 'fsu', 'florida', 'degree', 'gpa', 'study', 'college', 'graduate', 'major'],
    answer:
      "Brennan is pursuing a B.S. in Information Technology at Florida State University (graduating May 2026) with a minor in Business Analytics & Computer Science. He holds a 3.86 GPA, Magna Cum Laude, and is on the Dean's / President's List.",
  },
  {
    keywords: ['cert', 'certification', 'security+', 'comptia'],
    answer:
      'Brennan is currently working toward the CompTIA Security+ certification.',
  },
  {
    keywords: ['contact', 'reach', 'email', 'hire', 'available', 'availability', 'opportunit', 'connect', 'get in touch'],
    answer:
      "Brennan is open to new opportunities in cybersecurity and IT. Email him at Brennan.ohal1@gmail.com, connect on LinkedIn (linkedin.com/in/brennan-o-halloran), or use the contact form at the bottom of the page.",
  },
  {
    keywords: ['lacrosse', 'stream', 'av', 'production', 'sport', 'obs', 'broadcast'],
    answer:
      "Outside of tech, Brennan handles streaming & AV production for the Florida State Men's Lacrosse team. He runs the full video production setup with OBS Studio, gives live commentary, manages real-time stats, and updates scoreboard graphics.",
  },
  {
    keywords: ['who', 'about', 'yourself', 'you', 'brennan', 'background'],
    answer:
      "Brennan O'Halloran is an Information Technology student at Florida State University with hands-on cybersecurity, automation, and enterprise-systems experience from three internships at Henry Schein. He focuses on security operations, IAM, and automation.",
  },
  {
    keywords: ['resume', 'cv', 'download'],
    answer:
      'You can view or download his full resume using the "Resume" button in the top navigation.',
  },
]

export function matchAnswer(input: string): string {
  const text = input.toLowerCase()
  let best: { score: number; answer: string } | null = null
  for (const intent of intents) {
    const score = intent.keywords.reduce((n, kw) => (text.includes(kw) ? n + 1 : n), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, answer: intent.answer }
  }
  return best ? best.answer : fallback
}
