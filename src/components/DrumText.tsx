import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  spins?: number;        // сколько “лишних” прокруток
  cellPx?: number;       // высота ячейки (px)
  baseDuration?: number; // базовая длительность прокрутки
  className?: string;

  // Внешний вид “окна” под букву
  windowPx?: number;     // ширина окна в px (фикс)
  windowRadius?: number; // радиус скругления
};

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.&";

export default function DrumText({
  text,
  spins = 4,
  cellPx = 56,
  baseDuration = 1.6,
  className,
  windowPx = 44,
  windowRadius = 10,
}: Props) {
  const scope = useRef<HTMLSpanElement>(null);

const reels = useMemo(() => {
  return Array.from(text).map((ch) => {
    const target = ch === " " ? " " : ch;

    const after: string[] = [];
    for (let i = 0; i < Math.max(1, spins); i++) after.push(...Array.from(ALPHABET));

    //
    return [target, ...after];
  });
}, [text, spins]);

  useGSAP(
    () => {
      if (!scope.current) return;

      const reelEls = scope.current.querySelectorAll<HTMLElement>("[data-reel]");

      reelEls.forEach((el, i) => {
        const items = Number(el.dataset.items || "0");
        const startY = -1 * (items - 1) * cellPx; 
const endY = 0;                           

gsap.killTweensOf(el);
gsap.set(el, { y: startY });

gsap.to(el, {
  y: endY,
  duration: baseDuration + i * 0.04,
  ease: "power2.out",
});

      });
    },
    { scope, dependencies: [text, spins, cellPx, baseDuration], revertOnUpdate: true }
  );

  return (
    <span
      ref={scope}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "6px", 
      }}
    >
      {reels.map((reel, i) => {
        const isSpace = text[i] === " ";

        
        if (isSpace) {
          return <span key={`space-${i}`} style={{ width: 14, display: "inline-block" }} aria-hidden="true" />;
        }

        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              height: `${cellPx}px`,
              width: `${windowPx}px`,      
              background: "white",       
              borderRadius: `${windowRadius}px`,
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            }}
          >
            <span
              data-reel
              data-items={reel.length}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                willChange: "transform",
              }}
            >
              {reel.map((c, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "block",
                    height: `${cellPx}px`,
                    lineHeight: `${cellPx}px`,
                    width: "100%",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                    color: "#0a0a0a", 
                  }}
                >
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </span>
          </span>
        );
      })}

      {/* для скринридеров */}
      <span style={{ position: "absolute", left: "-9999px" }}>{text}</span>
    </span>
  );
}
