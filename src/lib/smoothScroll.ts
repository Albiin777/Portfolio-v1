let activeFrame = 0
let restoreScrollBehavior: string | null = null

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export const smoothScrollToElement = (element: HTMLElement, offset = 0) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const start = window.scrollY || document.documentElement.scrollTop
  const target = element.getBoundingClientRect().top + start - offset
  const distance = target - start
  const duration = Math.min(850, Math.max(280, Math.abs(distance) * 0.32))

  if (prefersReducedMotion || Math.abs(distance) < 2) {
    window.scrollTo({ top: target })
    return 0
  }

  if (activeFrame) window.cancelAnimationFrame(activeFrame)
  if (restoreScrollBehavior === null) {
    restoreScrollBehavior = document.documentElement.style.scrollBehavior
  }
  document.documentElement.style.scrollBehavior = 'auto'

  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / duration)
    window.scrollTo(0, start + distance * easeOutCubic(progress))

    if (progress < 1) {
      activeFrame = window.requestAnimationFrame(step)
    } else {
      activeFrame = 0
      document.documentElement.style.scrollBehavior = restoreScrollBehavior ?? ''
      restoreScrollBehavior = null
    }
  }

  window.scrollTo(0, start + distance * easeOutCubic(0.04))
  activeFrame = window.requestAnimationFrame(step)
  return duration
}
