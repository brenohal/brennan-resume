// All client-side behavior for the site. Plain DOM code, no framework: everything here
// enhances markup that already works without JavaScript.

type Goat = { count?: (v: { path: string; title?: string; event?: boolean }) => void }
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)]
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- Theme ----------
function setTheme(next: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', next)
  try { localStorage.setItem('theme', next) } catch { /* private mode */ }
}
const toggleTheme = () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme))

// ---------- Clipboard ----------
async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text) } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text, readOnly: true })
    ta.className = 'hp'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
  }
}
let copyTimer = 0
function flashCopied(btn?: HTMLElement | null) {
  const label = btn && $('[data-copy-label]', btn), live = $('[data-copy-live]')
  if (label) { const old = label.dataset.old ?? label.textContent ?? ''; label.dataset.old = old; label.textContent = 'Copied ✓' }
  if (live) live.textContent = 'Email address copied to clipboard'
  clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => { if (label?.dataset.old) label.textContent = label.dataset.old; if (live) live.textContent = '' }, 1900)
}
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => { await copyText(b.dataset.copy ?? ''); flashCopied(b) }))

// ---------- Privacy-friendly event counting (no-op unless analytics is configured) ----------
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
  const name = el?.dataset.track
  if (name) (window as unknown as { goatcounter?: Goat }).goatcounter?.count?.({ path: name, title: name, event: true })
})

// ---------- Scroll progress + current-section highlight ----------
const bar = $('.progress')
let ticking = false
const paint = () => {
  const max = document.documentElement.scrollHeight - innerHeight
  bar?.style.setProperty('--p', String(max > 0 ? Math.min(1, scrollY / max) : 0))
  ticking = false
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint) } }, { passive: true })
// Reading layout during startup would force an early reflow; wait until the browser is idle.
;(window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 200)))(() => paint())

const spyLinks = $$<HTMLAnchorElement>('[data-spy]')
if (spyLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(spyLinks.map((a) => [a.dataset.spy!, a]))
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue
      byId.forEach((a, id) => (id === en.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')))
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s) })
}

// Close the mobile menu after choosing a link
const menu = $('#menu')
menu?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) (menu as HTMLElement & { hidePopover?: () => void }).hidePopover?.() })

// ---------- Command palette ----------
const dialog = $<HTMLDialogElement>('#palette')
if (dialog) {
  const input = $<HTMLInputElement>('[data-palette-input]', dialog)!
  const list = $('[data-palette-list]', dialog)!
  const empty = $('[data-palette-empty]', dialog)!
  const items = $$<HTMLButtonElement>('.palette__item', dialog)
  const groups = $$('.palette__group', dialog)
  let active = 0
  const visible = () => items.filter((i) => !i.parentElement!.hidden)
  const select = (n: number) => {
    const v = visible(); if (!v.length) return
    active = (n + v.length) % v.length
    items.forEach((i) => i.setAttribute('aria-selected', 'false'))
    v[active].setAttribute('aria-selected', 'true'); v[active].scrollIntoView({ block: 'nearest' })
    input.setAttribute('aria-activedescendant', v[active].id || '')
  }
  const filter = () => {
    const q = input.value.trim().toLowerCase()
    items.forEach((i) => { i.parentElement!.hidden = !!q && !(i.textContent ?? '').toLowerCase().includes(q) })
    groups.forEach((g) => { let n = g.nextElementSibling, any = false; while (n && !n.classList.contains('palette__group')) { if (!(n as HTMLElement).hidden) any = true; n = n.nextElementSibling } g.hidden = !any })
    empty.hidden = visible().length > 0
    select(0)
  }
  const open = () => { if (!dialog.open) dialog.showModal(); input.value = ''; filter(); input.focus() }
  const run = (el: HTMLButtonElement) => {
    const { type, href } = el.dataset
    dialog.close()
    if (type === 'theme') toggleTheme()
    else if (type === 'copy') copyText(dialog.dataset.email ?? '')
    else if (type === 'external' && href) window.open(href, '_blank', 'noopener')
    else if (href) {
      const hash = href.includes('#') ? href.slice(href.indexOf('#')) : ''
      const target = hash && document.querySelector(hash)
      const samePage = !href.split('#')[0] || new URL(href, location.href).pathname === location.pathname
      if (target && samePage) { target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' }); history.replaceState(null, '', hash) } else location.assign(href)
    }
  }
  $$('[data-open-palette]').forEach((b) => b.addEventListener('click', open))
  addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dialog.open) dialog.close(); else open() } })
  input.addEventListener('input', filter)
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(active + 1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(active - 1) }
    else if (e.key === 'Enter') { e.preventDefault(); const v = visible()[active]; if (v) run(v) }
  })
  list.addEventListener('click', (e) => { const b = (e.target as Element).closest<HTMLButtonElement>('.palette__item'); if (b) run(b) })
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close() }) // click on the backdrop
}

// ---------- Click-to-play demos: no video bytes until requested ----------
$$('[data-media-play]').forEach((btn) => btn.addEventListener('click', () => {
  const host = btn.closest<HTMLElement>('[data-media]'); if (!host) return
  const video = Object.assign(document.createElement('video'), { src: btn.dataset.src ?? '', controls: true, autoplay: true, muted: true, loop: true, playsInline: true })
  video.setAttribute('aria-label', btn.dataset.label ?? 'Demo video')
  host.replaceChildren(video); video.play().catch(() => { /* controls remain */ }); video.focus()
}))

// ---------- Contact form: progressive enhancement over a plain HTML form ----------
const form = $<HTMLFormElement>('[data-contact-form]')
if (form) {
  form.noValidate = true // we show our own accessible messages (the native ones apply without JS)
  const endpoint = form.dataset.endpoint ?? '', email = form.dataset.email ?? ''
  const result = $('[data-result]', form)!, submit = $<HTMLButtonElement>('[data-submit]', form)!
  const fields = { name: $<HTMLInputElement>('#c-name', form)!, email: $<HTMLInputElement>('#c-email', form)!, message: $<HTMLTextAreaElement>('#c-msg', form)! }
  const rules: Record<keyof typeof fields, (v: string) => string> = {
    name: (v) => (v.trim() ? '' : 'Please enter your name.'),
    email: (v) => (!v.trim() ? 'Please enter your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address doesn’t look right.'),
    message: (v) => (!v.trim() ? 'Please write a message.' : v.trim().length < 10 ? 'Please write at least 10 characters.' : ''),
  }
  const setError = (key: keyof typeof fields, msg: string) => {
    const el = fields[key], wrap = el.closest('.field')!, id = `${el.id}-error`
    wrap.classList.toggle('field--error', !!msg); wrap.querySelector('.field__msg')?.remove()
    if (msg) { const p = Object.assign(document.createElement('p'), { id, className: 'field__msg', textContent: msg }); p.setAttribute('role', 'alert'); wrap.append(p); el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id) }
    else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby') }
  }
  ;(Object.keys(fields) as (keyof typeof fields)[]).forEach((k) => fields[k].addEventListener('input', () => { if (fields[k].getAttribute('aria-invalid')) setError(k, rules[k](fields[k].value)) }))
  const show = (tone: 'ok' | 'error', title: string, html: string) => { result.hidden = false; result.dataset.tone = tone; result.innerHTML = `<b>${title}</b>${html}`; result.focus() }
  const mailto = `mailto:${email}`
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const bad = (Object.keys(fields) as (keyof typeof fields)[]).filter((k) => { const m = rules[k](fields[k].value); setError(k, m); return !!m })
    if (bad.length) { fields[bad[0]].focus(); return }
    if ((form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value) return // bots fill hidden fields
    const payload = { name: fields.name.value.trim(), email: fields.email.value.trim(), message: fields.message.value.trim(), _subject: 'Portfolio contact' }
    if (!endpoint) {
      location.href = `${mailto}?subject=${encodeURIComponent('Portfolio contact from ' + payload.name)}&body=${encodeURIComponent(`Name: ${payload.name}\nReply-to: ${payload.email}\n\n${payload.message}`)}`
      show('ok', 'Your email app should be open.', `<p>Hit send there to deliver your message. If nothing opened, email <a href="${mailto}">${email}</a>.</p>`); return
    }
    submit.disabled = true; const old = submit.innerHTML; submit.textContent = 'Sending…'
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) })
      if (!res.ok) throw new Error(String(res.status))
      form.reset(); show('ok', 'Message sent.', `<p>Thanks, I’ll reply to ${payload.email.replace(/[<>&"]/g, '')} soon.</p>`)
    } catch {
      show('error', 'That didn’t go through.', `<p>Your message is still here. Try again, or email <a href="${mailto}">${email}</a> directly.</p>`)
    } finally { submit.disabled = false; submit.innerHTML = old }
  })
}

// ---------- Print button (an inline onclick would be blocked by the CSP) ----------
$$('[data-print]').forEach((b) => b.addEventListener('click', () => print()))

// ---------- Print: reveal every collapsed role so the printout is complete ----------
const reopened: HTMLDetailsElement[] = []
addEventListener('beforeprint', () => $$<HTMLDetailsElement>('details').forEach((d) => { if (!d.open) { d.open = true; reopened.push(d) } }))
addEventListener('afterprint', () => { reopened.splice(0).forEach((d) => (d.open = false)) })
