// Generates the 1200x630 share image from the site's own data, so it can never drift from the content.
// Runs before every build (see package.json "prebuild"). Output: public/og-image.jpg (git-ignored).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { site } from '../src/site.config.ts'

const root = new URL('../', import.meta.url)
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'))
const personal = read('src/data/personal.json')
const education = read('src/data/education.json')
const jobs = read('src/content/experience.json')
const current = jobs.find((j) => j.current) ?? jobs[0]

const font = (file) => readFileSync(fileURLToPath(new URL(`scripts/fonts/${file}`, root)))
const fonts = [
  { name: 'Inter', data: font('Inter-400.woff'), weight: 400, style: 'normal' },
  { name: 'Inter', data: font('Inter-700.woff'), weight: 700, style: 'normal' },
  { name: 'Fira Code', data: font('FiraCode-500.woff'), weight: 500, style: 'normal' },
]

// Head-and-shoulders crop of the portrait for the right-hand panel.
const PW = 470, H = 630
const portrait = await sharp(fileURLToPath(new URL('src/assets/images/portrait.jpg', root)))
  .extract({ left: 90, top: 0, width: 800, height: Math.round((800 * H) / PW) })
  .resize(PW, H).jpeg({ quality: 88 }).toBuffer()
const portraitUri = `data:image/jpeg;base64,${portrait.toString('base64')}`

const NAVY = '#0b1729', TEAL = '#64ffda', LIGHT = '#e8edf6', SLATE = '#aab6cc', DIM = '#8493ae'
const el = (type, style, children, extra = {}) => ({ type, props: { style: { display: 'flex', ...style }, children, ...extra } })
const [first, ...rest] = personal.name.split(' ')

const tree = el('div', { width: 1200, height: H, backgroundColor: NAVY, fontFamily: 'Inter', position: 'relative',
  backgroundImage: 'linear-gradient(rgba(120,160,220,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,220,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }, [
  el('div', { flexDirection: 'column', justifyContent: 'center', width: 730, padding: '0 0 0 70px' }, [
    el('div', { fontFamily: 'Fira Code', fontWeight: 500, fontSize: 28, color: TEAL, marginBottom: 18 }, '> whoami'),
    el('div', { fontSize: 92, fontWeight: 700, color: LIGHT, lineHeight: 1.02, letterSpacing: -2 }, first),
    el('div', { fontSize: 92, fontWeight: 700, color: LIGHT, lineHeight: 1.02, letterSpacing: -2 }, rest.join(' ')),
    el('div', { width: 90, height: 5, backgroundColor: TEAL, margin: '30px 0 28px 0' }, ''),
    el('div', { fontSize: 30, color: SLATE }, `${current.role.replace(' (Contract)', '')} · Cybersecurity & Automation`),
    el('div', { fontSize: 27, color: DIM, marginTop: 14 }, `${current.company}  |  ${education.school.replace('Florida State University', 'FSU')} ${education.degree}`),
    el('div', { fontSize: 27, color: DIM, marginTop: 6 }, `${education.honor} · ${education.gpa.split(' ')[0]} GPA`),
    el('div', { fontFamily: 'Fira Code', fontWeight: 500, fontSize: 25, color: TEAL, marginTop: 30 }, `${new URL(site.origin).host}${site.base.replace(/\/$/, '')}`),
  ]),
  el('div', { position: 'absolute', right: 0, top: 0, width: PW + 4, height: H, backgroundColor: TEAL }, ''),
  { type: 'img', props: { src: portraitUri, width: PW, height: H, style: { position: 'absolute', right: 0, top: 0, width: PW, height: H } } },
])

const svg = await satori(tree, { width: 1200, height: H, fonts })
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
const jpg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer() // ~4x smaller than PNG; plenty for a link preview
mkdirSync(new URL('public/', root), { recursive: true })
writeFileSync(new URL('public/og-image.jpg', root), jpg)
console.log(`og-image.jpg ${(jpg.length / 1024).toFixed(0)} KB  (${current.role}, ${current.company})`)
