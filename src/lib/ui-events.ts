// Lightweight typed event bus so decoupled components (navbar, command palette,
// chat assistant, theme toggle) can trigger each other without prop drilling.
export type UIEventName = 'open-palette' | 'open-chat' | 'toggle-theme'

export function emitUI(name: UIEventName) {
  window.dispatchEvent(new CustomEvent(name))
}

export function onUI(name: UIEventName, handler: () => void): () => void {
  window.addEventListener(name, handler)
  return () => window.removeEventListener(name, handler)
}
