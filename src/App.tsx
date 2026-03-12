import { useRef } from "react";
import type { RefObject } from "react";
import Hero from "./components/Hero";
import { Projects } from "./components/Projects";
import { APP_CLASSES, BOLT_PATHS } from "./constants/appStyles";
import { useOrbAnimation } from "./hooks/useOrbAnimation";

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
        <Projects />
      </main>
    </div>
  );
}
