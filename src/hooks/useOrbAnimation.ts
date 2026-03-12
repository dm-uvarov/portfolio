import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type OrbRefs = {
  scope: RefObject<HTMLDivElement | null>;
  circle: RefObject<HTMLDivElement | null>;
  droplet: RefObject<HTMLDivElement | null>;
  tail: RefObject<HTMLDivElement | null>;
  spark: RefObject<HTMLDivElement | null>;
  bolts: Array<RefObject<SVGPathElement | null>>;
};

const ORB_ANIMATION = {
  reactionDelayMs: 240,
  pointerOffsetRange: 28,
  moveDuration: 0.8,
  parallaxDuration: 1.1,
  fadeDuration: 0.6,
  margin: 10,
  tailReserve: 30,
  smoothing: 0.014,
  maxStep: 0.37,
  flashDecay: 0.92,
  flowSmoothing: 0.06,
  chaseDistanceRange: 46,
  initialFlashDelay: 0.35,
  flashIntervalMin: 1,
  flashIntervalVariance: 1.4,
} as const;

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

export function useOrbAnimation({ scope, circle, droplet, tail, spark, bolts }: OrbRefs) {
  useGSAP(() => {
    const root = scope.current;
    const circleElement = circle.current;
    const dropletElement = droplet.current;
    const tailElement = tail.current;
    const sparkElement = spark.current;
    const [bolt1, bolt2, bolt3] = bolts.map((ref) => ref.current);

    if (!root || !circleElement || !dropletElement || !tailElement || !sparkElement || !bolt1 || !bolt2 || !bolt3) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const moveX = gsap.quickTo(circleElement, "x", {
      duration: ORB_ANIMATION.moveDuration,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(circleElement, "y", {
      duration: ORB_ANIMATION.moveDuration,
      ease: "power3.out",
    });
    const moveParallaxY = gsap.quickTo(circleElement, "yPercent", {
      duration: ORB_ANIMATION.parallaxDuration,
      ease: "power3.out",
    });
    const fadeDrop = gsap.quickTo(dropletElement, "opacity", {
      duration: ORB_ANIMATION.fadeDuration,
      ease: "power2.out",
    });

    const inputPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const previous = { x: 0, y: 0 };
    const flow = { x: 1, y: 0 };
    let pointerDelayTimer: number | null = null;
    let flashStrength = 0;
    let nextFlashAt = gsap.ticker.time + ORB_ANIMATION.initialFlashDelay;

    const tick = () => {
      const rect = circleElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dropletRadius = dropletElement.offsetWidth / 2;

      let tx = pointer.x - centerX;
      let ty = pointer.y - centerY;
      const maxRadius =
        rect.width / 2 - dropletRadius - ORB_ANIMATION.margin - ORB_ANIMATION.tailReserve;
      const distance = Math.hypot(tx, ty);

      if (distance > maxRadius) {
        const scale = maxRadius / distance;
        tx *= scale;
        ty *= scale;
      }

      target.x = tx;
      target.y = ty;

      const nextX = current.x + (target.x - current.x) * ORB_ANIMATION.smoothing;
      const nextY = current.y + (target.y - current.y) * ORB_ANIMATION.smoothing;
      const dx = nextX - current.x;
      const dy = nextY - current.y;
      const step = Math.hypot(dx, dy);

      if (step > ORB_ANIMATION.maxStep) {
        const scale = ORB_ANIMATION.maxStep / step;
        current.x += dx * scale;
        current.y += dy * scale;
      } else {
        current.x = nextX;
        current.y = nextY;
      }

      const vx = current.x - previous.x;
      const vy = current.y - previous.y;
      const speed = Math.hypot(vx, vy);
      const nx = speed > 0.0001 ? vx / speed : flow.x;
      const ny = speed > 0.0001 ? vy / speed : flow.y;
      const motion = Math.min(speed / ORB_ANIMATION.maxStep, 1);
      const chaseDistance = Math.hypot(target.x - current.x, target.y - current.y);
      const reach = Math.max(0, 1 - chaseDistance / ORB_ANIMATION.chaseDistanceRange);
      const sparkStrength = reach * (0.6 + motion * 0.7);
      const now = gsap.ticker.time;
      const contactRadius = dropletRadius * (0.9 + 0.08 * motion);
      const isTouchingCursor = chaseDistance <= contactRadius;

      if (isTouchingCursor && now >= nextFlashAt) {
        nextFlashAt =
          now + ORB_ANIMATION.flashIntervalMin + Math.random() * ORB_ANIMATION.flashIntervalVariance;
        flashStrength = 1;

        const startX = rand(30, 70);
        const startY = rand(20, 42);
        bolt1.setAttribute("d", makeBoltPath(startX, startY, 4, 9, 8));
        bolt2.setAttribute("d", makeBoltPath(startX + rand(-16, 16), startY + rand(-8, 8), 3, 8, 7));
        bolt3.setAttribute("d", makeBoltPath(startX + rand(-20, 20), startY + rand(-10, 10), 3, 7, 6));
      }
      flashStrength *= ORB_ANIMATION.flashDecay;

      flow.x += (nx - flow.x) * ORB_ANIMATION.flowSmoothing;
      flow.y += (ny - flow.y) * ORB_ANIMATION.flowSmoothing;
      const flowLength = Math.hypot(flow.x, flow.y) || 1;
      flow.x /= flowLength;
      flow.y /= flowLength;

      const frontOffset = 4 + 6 * motion;
      const tailOffset = 24 + 22 * motion;
      const dropletShape = `${50 - 7 * motion}% ${50 + 5 * motion}% ${50 + 7 * motion}% ${50 - 5 * motion}%`;

      gsap.set(dropletElement, {
        x: current.x + flow.x * frontOffset,
        y: current.y + flow.y * frontOffset,
        scaleX: 1 + 0.18 * motion,
        scaleY: 1 - 0.12 * motion,
        transformOrigin: "center center",
        borderRadius: dropletShape,
        force3D: true,
      });

      gsap.set(tailElement, {
        x: current.x - flow.x * tailOffset,
        y: current.y - flow.y * tailOffset,
        scaleX: 0.75 + 0.95 * motion,
        scaleY: 0.35 + 0.25 * motion,
        opacity: 0.12 + 0.48 * motion,
        transformOrigin: "center center",
        borderRadius: `${65 + 15 * motion}% ${35 - 8 * motion}% ${65 + 15 * motion}% ${35 - 8 * motion}%`,
        force3D: true,
      });

      gsap.set(sparkElement, {
        x: current.x + flow.x * frontOffset,
        y: current.y + flow.y * frontOffset,
        opacity: 0.02 + sparkStrength * 0.14 + flashStrength * 0.86,
        scaleX: 1 + 0.18 * motion,
        scaleY: 1 - 0.12 * motion,
        borderRadius: dropletShape,
        filter: `blur(${0.03 + (1 - sparkStrength) * 0.07}px) brightness(${1 + sparkStrength * 0.15 + flashStrength * 0.95})`,
        force3D: true,
      });

      previous.x = current.x;
      previous.y = current.y;
    };

    const onPointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = ((event.clientX / innerWidth) - 0.5) * ORB_ANIMATION.pointerOffsetRange;
      const offsetY = ((event.clientY / innerHeight) - 0.5) * ORB_ANIMATION.pointerOffsetRange;

      inputPointer.x = event.clientX;
      inputPointer.y = event.clientY;

      if (pointerDelayTimer === null) {
        pointerDelayTimer = window.setTimeout(() => {
          pointer.x = inputPointer.x;
          pointer.y = inputPointer.y;
          pointerDelayTimer = null;
        }, ORB_ANIMATION.reactionDelayMs);
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

    gsap.ticker.add(tick);
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
}
