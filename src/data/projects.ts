export interface Project {
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
  image?: string
  video?: string
  gif?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    title: 'AI-Driven Job Application Engine',
    description:
      'Engineered an AI-driven automation tool using LLM-based code generation to streamline job application workflows; integrated multi-provider LLM failover across Cerebras, Groq, OpenRouter, and DeepSeek for resilience and speed.',
    tech: ['Python', 'Node.js', 'Cerebras', 'Groq', 'DeepSeek', 'LLM APIs'],
    github: 'https://github.com/brenohal',
    featured: true,
  },
  {
    title: 'Dynamic CRUD Web Application',
    description:
      'A full-stack web application built with Java supporting complete Create, Read, Update, and Delete operations. Features a responsive UI, server-side validation, and a relational MySQL database backend.',
    tech: ['Java', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    github: 'https://github.com/brenohal/web-application-development-java',
    image: '/brennan-resume/assets/webapp.gif',
    video: '/brennan-resume/assets/webapp.mp4',
    gif: '/brennan-resume/assets/webapp.gif',
    featured: true,
  },
  {
    title: 'Interactive Mobile Business Card',
    description:
      'A responsive mobile-first web application functioning as a dynamic digital business card. Built with PHP and designed for seamless cross-device display with interactive contact features.',
    tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'Android Studio'],
    github: 'https://github.com/brenohal/mobile-web-application-development',
    gif: '/brennan-resume/assets/interactive-business-card.gif',
    featured: true,
  },
  {
    title: 'Advanced Database Design',
    description:
      'Designed and implemented a normalized relational database for a legal services firm. Includes a complete data warehouse schema, stored procedures, complex T-SQL queries, and data insertion scripts across multiple related entities.',
    tech: ['T-SQL', 'Microsoft SQL Server', 'MySQL Workbench', 'Data Normalization'],
    github: 'https://github.com/brenohal/advanced-database-design-sql',
    image: '/brennan-resume/assets/data-warehouse.png',
    featured: true,
  },
  {
    title: 'Spudwegian Cruise Booking System',
    description:
      'A CLI-based cruise passenger booking system built in C++. Supports full party and passenger management — add, edit, remove, and persist passenger records to file — with robust input validation and error handling.',
    tech: ['C++', 'CLI Design', 'File I/O', 'Data Structures'],
    image: '/brennan-resume/assets/cruise-booking.png',
    featured: false,
  },
]
