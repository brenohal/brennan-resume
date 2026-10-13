// Privacy-friendly event counting (GoatCounter). A silent no-op unless analytics is configured and loaded.
interface GoatCounter {
  count: (vars: { path: string; title?: string; event?: boolean }) => void
}

export function track(name: string, title?: string) {
  const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter
  gc?.count({ path: name, title: title ?? name, event: true })
}
