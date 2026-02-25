import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Hero from "./components/Hero";
import { Projects } from "./components/Projects";

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makeBoltPath(startX: number, startY: number, segments = 4, stepY = 9, spread = 10) {
  let x = startX;
  let y = startY;
  let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;

  for (let i = 0; i < segments; i += 1) {
    x += rand(-spread, spread);
    y += rand(stepY * 0.75, stepY * 1.45);
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return d;
}

export default function App() {
  const scope = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dropletRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const bolt1Ref = useRef<SVGPathElement>(null);
  const bolt2Ref = useRef<SVGPathElement>(null);
  const bolt3Ref = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const root = scope.current;
    const circle = circleRef.current;
    const droplet = dropletRef.current;
    const tail = tailRef.current;
    const spark = sparkRef.current;
    const bolt1 = bolt1Ref.current;
    const bolt2 = bolt2Ref.current;
    const bolt3 = bolt3Ref.current;
    if (!root || !circle || !droplet || !tail || !spark || !bolt1 || !bolt2 || !bolt3) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const moveX = gsap.quickTo(circle, "x", { duration: 0.8, ease: "power3.out" });
    const moveY = gsap.quickTo(circle, "y", { duration: 0.8, ease: "power3.out" });
    const moveParallaxY = gsap.quickTo(circle, "yPercent", { duration: 1.1, ease: "power3.out" });
    const fadeDrop = gsap.quickTo(droplet, "opacity", { duration: 0.6, ease: "power2.out" });

    const inputPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const prev = { x: 0, y: 0 };
    const flow = { x: 1, y: 0 };
    const reactionDelayMs = 240;
    let pointerDelayTimer: number | null = null;
    let flashStrength = 0;
    let nextFlashAt = gsap.ticker.time + 0.35;

    const tick = () => {
      const rect = circle.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dropletRadius = droplet.offsetWidth / 2;
      const margin = 10;
      const tailReserve = 30;

      let tx = pointer.x - centerX;
      let ty = pointer.y - centerY;
      const maxRadius = rect.width / 2 - dropletRadius - margin - tailReserve;
      const distance = Math.hypot(tx, ty);

      if (distance > maxRadius) {
        const scale = maxRadius / distance;
        tx *= scale;
        ty *= scale;
      }

      target.x = tx;
      target.y = ty;

      // Slower, smoother trailing with hard speed cap per frame.
      const smoothing = 0.014;
      const maxStep = 0.37;
      const nextX = current.x + (target.x - current.x) * smoothing;
      const nextY = current.y + (target.y - current.y) * smoothing;
      const dx = nextX - current.x;
      const dy = nextY - current.y;
      const step = Math.hypot(dx, dy);

      if (step > maxStep) {
        const scale = maxStep / step;
        current.x += dx * scale;
        current.y += dy * scale;
      } else {
        current.x = nextX;
        current.y = nextY;
      }

      const vx = current.x - prev.x;
      const vy = current.y - prev.y;
      const speed = Math.hypot(vx, vy);
      const nx = speed > 0.0001 ? vx / speed : flow.x;
      const ny = speed > 0.0001 ? vy / speed : flow.y;
      const motion = Math.min(speed / maxStep, 1);
      const chaseDistance = Math.hypot(target.x - current.x, target.y - current.y);
      const reach = Math.max(0, 1 - chaseDistance / 46);
      const sparkStrength = reach * (0.6 + motion * 0.7);
      const t = gsap.ticker.time;
      const contactRadius = dropletRadius * (0.9 + 0.08 * motion);
      const isTouchingCursor = chaseDistance <= contactRadius;

      // Trigger lightning from random points, but no more than once per second.
      if (isTouchingCursor && t >= nextFlashAt) {
        nextFlashAt = t + 1 + Math.random() * 1.4;
        flashStrength = 1;

        const sx = rand(30, 70);
        const sy = rand(20, 42);
        bolt1.setAttribute("d", makeBoltPath(sx, sy, 4, 9, 8));
        bolt2.setAttribute("d", makeBoltPath(sx + rand(-16, 16), sy + rand(-8, 8), 3, 8, 7));
        bolt3.setAttribute("d", makeBoltPath(sx + rand(-20, 20), sy + rand(-10, 10), 3, 7, 6));
      }
      flashStrength *= 0.92;

      flow.x += (nx - flow.x) * 0.06;
      flow.y += (ny - flow.y) * 0.06;
      const flowLen = Math.hypot(flow.x, flow.y) || 1;
      flow.x /= flowLen;
      flow.y /= flowLen;

      gsap.set(droplet, {
        x: current.x + flow.x * (4 + 6 * motion),
        y: current.y + flow.y * (4 + 6 * motion),
        scaleX: 1 + 0.18 * motion,
        scaleY: 1 - 0.12 * motion,
        transformOrigin: "center center",
        borderRadius: `${50 - 7 * motion}% ${50 + 5 * motion}% ${50 + 7 * motion}% ${50 - 5 * motion}%`,
        force3D: true,
      });

      gsap.set(tail, {
        x: current.x - flow.x * (24 + 22 * motion),
        y: current.y - flow.y * (24 + 22 * motion),
        scaleX: 0.75 + 0.95 * motion,
        scaleY: 0.35 + 0.25 * motion,
        opacity: 0.12 + 0.48 * motion,
        transformOrigin: "center center",
        borderRadius: `${65 + 15 * motion}% ${35 - 8 * motion}% ${65 + 15 * motion}% ${35 - 8 * motion}%`,
        force3D: true,
      });

      gsap.set(spark, {
        x: current.x + flow.x * (4 + 6 * motion),
        y: current.y + flow.y * (4 + 6 * motion),
        opacity: 0.02 + sparkStrength * 0.14 + flashStrength * 0.86,
        scaleX: 1 + 0.18 * motion,
        scaleY: 1 - 0.12 * motion,
        borderRadius: `${50 - 7 * motion}% ${50 + 5 * motion}% ${50 + 7 * motion}% ${50 - 5 * motion}%`,
        filter: `blur(${0.03 + (1 - sparkStrength) * 0.07}px) brightness(${1 + sparkStrength * 0.15 + flashStrength * 0.95})`,
        force3D: true,
      });

      prev.x = current.x;
      prev.y = current.y;
    };

    gsap.ticker.add(tick);

    const onPointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = ((event.clientX / innerWidth) - 0.5) * 28;
      const offsetY = ((event.clientY / innerHeight) - 0.5) * 28;
      inputPointer.x = event.clientX;
      inputPointer.y = event.clientY;

      if (pointerDelayTimer === null) {
        pointerDelayTimer = window.setTimeout(() => {
          pointer.x = inputPointer.x;
          pointer.y = inputPointer.y;
          pointerDelayTimer = null;
        }, reactionDelayMs);
      }

      moveX(offsetX);
      moveY(offsetY);
      fadeDrop(0.74);
    };

    const onPointerLeave = () => {
      moveX(0);
      moveY(0);
      pointer.x = window.innerWidth / 2;
      pointer.y = window.innerHeight / 2;
      inputPointer.x = pointer.x;
      inputPointer.y = pointer.y;
      if (pointerDelayTimer !== null) {
        window.clearTimeout(pointerDelayTimer);
        pointerDelayTimer = null;
      }
      fadeDrop(0.58);
    };

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const targetParallax = -Math.min(scrollY * 0.0045, 3.5);
      moveParallaxY(targetParallax);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      gsap.ticker.remove(tick);
      if (pointerDelayTimer !== null) {
        window.clearTimeout(pointerDelayTimer);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, { scope });

  return (
    <div ref={scope} className="relative min-h-screen overflow-x-hidden bg-[#f3f4f2] text-slate-800">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          ref={circleRef}
          className="absolute left-[56%] top-[-200px] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#e9f4ec] via-[#e4efe8] to-[#ddebe2]"
        >
          <div
            ref={tailRef}
            className="absolute left-1/2 top-1/2 h-20 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4e2d0]/80 opacity-20 blur-md"
          />
          <div
            ref={dropletRef}
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4e2d0]/85 opacity-60 blur-md"
          />
          <div
            ref={sparkRef}
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-0 mix-blend-screen"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_38%,rgba(212,246,228,0.35)_0%,rgba(163,219,191,0.18)_40%,rgba(121,182,154,0.04)_72%,rgba(94,146,122,0)_100%)]" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <path
                ref={bolt1Ref}
                d="M58 16 L47 38 L56 38 L42 72"
                fill="none"
                stroke="rgba(236,255,246,0.95)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={bolt2Ref}
                d="M37 26 L31 41 L37 41 L29 58"
                fill="none"
                stroke="rgba(222,252,236,0.9)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={bolt3Ref}
                d="M71 34 L64 48 L71 48 L62 66"
                fill="none"
                stroke="rgba(220,250,234,0.88)"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-20 sm:px-8">
        <Hero />
        <Projects />
      </main>
    </div>
  );
}
