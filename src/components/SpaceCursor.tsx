import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '[tabindex]',
  '.cursor-pointer',
  '.cursor-grab'
].join(',')

const isFinePointer = () => (
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches
)

export default function SpaceCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const animationFrame = useRef<number | null>(null)
  const [enabled] = useState(isFinePointer)
  const [isInteractive, setIsInteractive] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return

    document.documentElement.classList.add('custom-cursor-enabled')

    const updateInteractiveState = (element: EventTarget | null) => {
      const node = element instanceof Element ? element : null
      setIsInteractive(Boolean(node?.closest(INTERACTIVE_SELECTOR)))
    }

    const handleMouseMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      updateInteractiveState(event.target)
    }

    const handlePointerDown = () => setIsPressed(true)
    const handlePointerUp = () => setIsPressed(false)
    const handleFocusIn = (event: FocusEvent) => updateInteractiveState(event.target)
    const handleFocusOut = () => setIsInteractive(false)

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.22
      current.current.y += (target.current.y - current.current.y) * 0.22

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`
      }

      animationFrame.current = window.requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)
    animationFrame.current = window.requestAnimationFrame(animate)

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = isPressed ? 44 : isInteractive ? 38 : 26
  const dotSize = isPressed ? 9 : isInteractive ? 8 : 6

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 z-[9999] pointer-events-none rounded-full border border-accent/80 mix-blend-screen flex items-center justify-center"
        style={{
          width: ringSize,
          height: ringSize,
          boxShadow: isInteractive
            ? '0 0 20px rgba(255, 176, 0,0.32), inset 0 0 14px rgba(255, 176, 0,0.12)'
            : '0 0 14px rgba(255, 176, 0,0.2), inset 0 0 10px rgba(255, 176, 0,0.08)',
          transition: 'width 160ms ease, height 160ms ease, border-color 160ms ease, box-shadow 160ms ease'
        }}
      >
        <div
          className="rounded-full bg-[#ff7a1a]"
          style={{
            width: dotSize,
            height: dotSize,
            boxShadow: '0 0 10px rgba(255,122,26,0.95), 0 0 22px rgba(255, 176, 0,0.42)',
            transition: 'width 120ms ease, height 120ms ease'
          }}
        />
        <div className="absolute left-1/2 top-[-7px] h-3 w-px -translate-x-1/2 bg-accent/60" />
        <div className="absolute left-1/2 bottom-[-7px] h-3 w-px -translate-x-1/2 bg-accent/60" />
        <div className="absolute left-[-7px] top-1/2 h-px w-3 -translate-y-1/2 bg-accent/60" />
        <div className="absolute right-[-7px] top-1/2 h-px w-3 -translate-y-1/2 bg-accent/60" />
        <div
          className={`absolute inset-[-7px] rounded-full border border-accent/10 ${
            isPressed ? 'animate-[cursorPulse_420ms_ease-out]' : ''
          }`}
        />
      </div>
    </>
  )
}
