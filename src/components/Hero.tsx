import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return

    const ctx = gsap.context(() => {
      gsap.from(".fade-up", { y: 14, opacity: 0, duration: 0.6, stagger: 0.1 })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <h1 className="fade-up text-4xl font-bold">Hello</h1>
      <p className="fade-up mt-3">My name is Dmitry Uvarov</p>
      <button className="fade-up mt-6 rounded-xl border px-4 py-2">I'm Software Developer</button>
    </div>
  )
}
