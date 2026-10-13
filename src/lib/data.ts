import personal from '../data/personal.json'
import education from '../data/education.json'
import caseStudy from '../data/caseStudy.json'
import { getCollection } from 'astro:content'

export { personal, education, caseStudy }

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order
export const getExperience = async () => (await getCollection('experience')).sort(byOrder)
export const getMetrics = async () => (await getCollection('metrics')).sort(byOrder)
export const getCredentials = async () => (await getCollection('credentials')).sort(byOrder)
export const getToolbox = async () => (await getCollection('toolbox')).sort(byOrder)
export const getProjects = async () => (await getCollection('projects')).sort(byOrder)
export const getInvolvement = async () => (await getCollection('involvement')).sort(byOrder)

/** Pages and anchors shared by the nav, the mobile menu, and the command palette. */
export const sections = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'work', label: 'Work', num: '02' },
  { id: 'projects', label: 'Projects', num: '03' },
  { id: 'contact', label: 'Contact', num: '04' },
] as const
