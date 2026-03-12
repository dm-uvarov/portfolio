import { lazy, Suspense, useRef } from "react";
import type { RefObject } from "react";
import Hero from "./components/Hero";
import { APP_CLASSES, BOLT_PATHS } from "./constants/appStyles";
import { useOrbAnimation } from "./hooks/useOrbAnimation";

const Projects = lazy(async () => {
  const module = await import("./components/Projects");
  return { default: module.Projects };
});

const PROJECTS_FALLBACK_CLASSES = {
  section: "pb-20",
  heading: "mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500",
  grid: "grid grid-cols-1 gap-10 md:grid-cols-2",
  card: "h-[230px] rounded-md border border-slate-200 bg-white/40 p-6",
} as const;

function ProjectsFallback() {
  return (
    <section className={PROJECTS_FALLBACK_CLASSES.section} aria-hidden>
      <h2 className={PROJECTS_FALLBACK_CLASSES.heading}>Projects</h2>
      <div className={PROJECTS_FALLBACK_CLASSES.grid}>
        <div className={PROJECTS_FALLBACK_CLASSES.card} />
        <div className={PROJECTS_FALLBACK_CLASSES.card} />
      </div>
    </section>
  );
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
  const boltRefs: Array<RefObject<SVGPathElement | null>> = [bolt1Ref, bolt2Ref, bolt3Ref];

  useOrbAnimation({
    scope,
    circle: circleRef,
    droplet: dropletRef,
    tail: tailRef,
    spark: sparkRef,
    bolts: boltRefs,
  });

  return (
    <div ref={scope} className={APP_CLASSES.shell}>
      <div aria-hidden className={APP_CLASSES.background}>
        <div ref={circleRef} className={APP_CLASSES.circle}>
          <div ref={tailRef} className={APP_CLASSES.tail} />
          <div ref={dropletRef} className={APP_CLASSES.droplet} />
          <div ref={sparkRef} className={APP_CLASSES.spark}>
            <div className={APP_CLASSES.sparkGlow} />
            <svg viewBox="0 0 100 100" className={APP_CLASSES.sparkSvg}>
              {BOLT_PATHS.map((bolt, index) => (
                <path
                  key={bolt.key}
                  ref={boltRefs[index]}
                  d={bolt.d}
                  fill="none"
                  stroke={bolt.stroke}
                  strokeWidth={bolt.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
      <main className={APP_CLASSES.main}>
        <Hero />
        <Suspense fallback={<ProjectsFallback />}>
          <Projects />
        </Suspense>
      </main>
    </div>
  );
}
