import { defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { z } from 'astro/zod'

// All site content is validated at build time: a typo in a date, a missing headline, or an empty
// list fails the build instead of shipping a broken page.
const month = z.string().regex(/^\d{4}-\d{2}$/, 'use YYYY-MM')

const experience = defineCollection({
  loader: file('src/content/experience.json'),
  schema: z.object({
    order: z.number(),
    role: z.string(),
    company: z.string(),
    start: month,
    end: z.union([month, z.literal('present')]),
    location: z.string(),
    current: z.boolean(),
    headline: z.string().min(20), // every role leads with its outcome
    bullets: z.array(z.string().min(10)).min(1),
    skills: z.array(z.string()),
    takeaway: z.string().optional(),
    highlight: z.string().optional(),
  }),
})

const projects = defineCollection({
  loader: file('src/content/projects.json'),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    description: z.string().min(40),
    tech: z.array(z.string()).min(1),
    image: z.string(),
    tag: z.string(),
    github: z.url().optional(),
    video: z.string().optional(),
  }),
})

const involvement = defineCollection({
  loader: file('src/content/involvement.json'),
  schema: z.object({ order: z.number(), role: z.string(), org: z.string(), description: z.string(), period: z.string().optional() }),
})

const metrics = defineCollection({
  loader: file('src/content/metrics.json'),
  schema: z.object({ order: z.number(), value: z.string(), label: z.string(), source: z.string(), href: z.string().startsWith('#') }),
})

const credentials = defineCollection({
  loader: file('src/content/credentials.json'),
  schema: z.object({ order: z.number(), icon: z.string(), title: z.string(), detail: z.string() }),
})

const toolbox = defineCollection({
  loader: file('src/content/toolbox.json'),
  schema: z.object({ order: z.number(), label: z.string(), items: z.array(z.object({ name: z.string(), core: z.boolean().default(false) })) }),
})

export const collections = { experience, projects, involvement, metrics, credentials, toolbox }
