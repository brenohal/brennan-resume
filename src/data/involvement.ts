export interface Involvement {
  role: string
  org: string
  description: string
  tags: string[]
}

export const involvement: Involvement[] = [
  {
    role: 'Streaming & AV Production',
    org: "FSU Men's Club Lacrosse",
    description:
      'Set up and operated all video production equipment to livestream practices and games with OBS Studio and Adobe Photoshop; provided live commentary, managed real-time stats, and updated scoreboard graphics (Sept 2024 – May 2026).',
    tags: ['OBS Studio', 'Adobe Photoshop', 'Live Streaming', 'Real-Time Operations'],
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
