const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return { y, m: MONTHS[m - 1] }
}

/** '2026-06', '2026-09' -> 'Jun – Sep 2026';  '2026-09', 'present' -> 'Sep 2026 – Present' */
export function formatRange(start: string, end: string): string {
  const a = parse(start)
  if (end === 'present') return `${a.m} ${a.y} – Present`
  const b = parse(end)
  return a.y === b.y ? `${a.m} – ${b.m} ${b.y}` : `${a.m} ${a.y} – ${b.m} ${b.y}`
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
