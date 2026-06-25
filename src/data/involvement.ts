export interface Involvement {
  role: string
  org: string
  description: string
  tags: string[]
}

export const involvement: Involvement[] = [
  {
    role: 'Streaming Assistant',
    org: "FSU Men's Club Lacrosse",
    description:
      'Manage live broadcasts and technical operations for game-day streams, ensuring reliable audio/video delivery and real-time troubleshooting.',
    tags: ['Live Streaming', 'Technical Operations', 'Teamwork', 'Problem Solving'],
  },
  {
    role: 'Member',
    org: 'Association for Information Systems',
    description:
      'Engage with peers and professionals in information systems, attending workshops and events focused on IT trends and career development.',
    tags: ['Networking', 'Professional Development', 'IT Strategy'],
  },
  {
    role: 'Member',
    org: 'Lambda Pi Eta Honor Society',
    description:
      'Recognized for academic excellence and commitment to the study of communication, maintaining a high GPA and contributing to scholarly discussions.',
    tags: ['Academic Excellence', 'Communication', 'Leadership'],
  },
]
