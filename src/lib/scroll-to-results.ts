/** Smooth-scroll to generated results after a generation finishes. */
export function scrollToResults(selector = '[data-generation-results]') {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    const el = document.querySelector(selector)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
