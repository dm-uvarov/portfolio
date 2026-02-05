import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function Projects() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from("[data-card]", {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.08,
      scrollTrigger: {
        trigger: scope.current,
        start: "top 80%",
      },
    })
  }, { scope })

  return (
    <div ref={scope}>
      <div data-card className="rounded-2xl border p-5">Project 1</div>
      <div data-card className="rounded-2xl border p-5 mt-4">Project 2</div>
    </div>
  )
}
