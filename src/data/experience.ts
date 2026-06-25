export interface ExperienceItem {
  company: string
  role: string
  dates: string
  location: string
  bullets: string[]
  technicalSkills?: string[]
  transferableSkills?: string[]
  keyTakeaway?: string
  highlight?: string
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
    technicalSkills: ['Torq', 'Alert Triage', 'Detection Tuning'],
    transferableSkills: ['Root-Cause Analysis', 'Security Operations'],
  },
  {
    company: 'Henry Schein',
    role: 'Cybersecurity Intern',
    dates: 'May 2025 – August 2025',
    location: 'Remote',
    bullets: [
      'Analyzed and standardized global firewall rulesets across core and remote entities using Palo Alto and Panorama; reduced total rules by 14% through Python-based automation aligned with least-access principles.',
      'Assessed and implemented strategies to reduce endpoint risk by restricting access to malicious websites and limiting executable file downloads, mitigating user compromise and minimizing the need for device reimaging.',
      'Co-led analysis of customer authentication and authorization processes across external-facing digital platforms; supported development of a transition strategy and communication plan to enable centralized access control aligned with enterprise cybersecurity initiatives.',
    ],
    technicalSkills: ['Python', 'Palo Alto', 'Panorama', 'Microsoft Entra ID'],
    transferableSkills: ['Firewall Governance', 'Strategic Planning', 'Cross-Team Collaboration'],
    keyTakeaway:
      "Operating within a global security infrastructure taught me that cybersecurity isn't just about blocking threats; it's about balancing strict access controls with the actual needs of a business. By analyzing firewall rules and reducing endpoint risks, I learned how to scale security across a large company while ensuring technical policies align with daily tasks. I also had the opportunity to help roadmap a centralized authentication and authorization solution with Microsoft, which showed me how to translate complex needs into a clear, effective strategy. This experience gives me the ability to manage complex security projects without losing sight of the organization's goals.",
  },
  {
    company: 'Henry Schein',
    role: 'Digital Architecture Intern',
    dates: 'May 2024 – August 2024',
    location: 'Remote',
    bullets: [
      'Assisted in conducting comprehensive performance testing on a new global e-commerce platform using Selenium to automate test cases, ensuring efficiency and reliability in the software development lifecycle.',
      "Executed security testing using tools like Burp Suite and OWASP ZAP to identify and remove vulnerabilities, enhancing the security of Henry Schein's web applications.",
      'Developed and optimized scripts using MySQL to convert JSON data into Excel sheets, streamlining data analysis and the reporting process, and allowing for a better visualization of the data creating improved decision-making based on the transformed data.',
    ],
    technicalSkills: ['Selenium', 'Burp Suite', 'OWASP ZAP', 'MySQL'],
    transferableSkills: ['QA Testing', 'Data Analysis', 'Process Optimization'],
    keyTakeaway:
      "This role gave me a deep dive into the software lifecycle, from using Selenium for automated performance testing to hunting for vulnerabilities with tools like Burp Suite and OWASP ZAP. I learned that quality assurance and security are inseparable; a platform isn't truly reliable if it isn't secure. By developing custom MySQL scripts to transform complex data into presentable insights, I saw how optimizing the backend of an application directly improves leadership's ability to make informed, data-driven decisions.",
  },
  {
    company: 'AI Strategy Corporation',
    role: 'Intern',
    dates: 'December 2022 – January 2023',
    location: 'Babylon, NY',
    highlight: 'Presented to the United States Department of Defense',
    bullets: [
      'Developed video scripts that explained and demonstrated the use of AI within the company that were then presented in front of the United States Department of Defense.',
      'Collaborated directly with the company CEO and higher-ups to discuss priorities and implement AI-driven solutions, contributing to enhanced data analysis and process automation.',
    ],
    technicalSkills: ['AI/ML', 'Video Production', 'Data Analysis'],
    transferableSkills: ['Executive Communication', 'Stakeholder Management', 'Technical Writing'],
    keyTakeaway:
      'Collaborating directly with the CEO to explore AI-driven solutions taught me that the most powerful technology is only effective if its value is communicated clearly. Having my video scripts and technical demonstrations presented to the United States Department of Defense showed me how to translate complex concepts into high-level explanations for non-technical stakeholders. This experience sets me apart as a communicator who can bridge the gap between highly technical employees and non-technical leadership.',
  },
]
