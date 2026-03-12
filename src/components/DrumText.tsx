import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  getDrumTextVars,
  getSpaceWidthStyle,
  SCREEN_READER_ONLY_STYLE,
} from "./drumTextStyles";

gsap.registerPlugin(useGSAP);

type Props = {
  text: string;
  spins?: number;
  cellPx?: number;
  baseDuration?: number;
  className?: string;
  windowPx?: number;
  windowRadius?: number;
};

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.&";
const DURATION_VARIANCE = [0, -0.04, 0.03, -0.02, 0.02, -0.01];
const DRUM_TEXT_CLASSES = {
  root: "drum-text",
  reelWindow: "drum-text__window",
  reelTrack: "drum-text__reel",
  reelCell: "drum-text__cell",
  space: "drum-text__space",
  srOnly: "drum-text__sr-only",
} as const;

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
      for (let i = 0; i < Math.max(1, spins); i += 1) {
        after.push(...Array.from(ALPHABET));
      }

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
        const duration = Math.max(0.35, baseDuration + DURATION_VARIANCE[i % DURATION_VARIANCE.length]);

        gsap.killTweensOf(el);
        gsap.set(el, { y: startY });
        gsap.to(el, {
          y: 0,
          duration,
          ease: "power2.out",
        });
      });
    },
    { scope, dependencies: [text, spins, cellPx, baseDuration], revertOnUpdate: true }
  );

  return (
    <span
      ref={scope}
      className={[DRUM_TEXT_CLASSES.root, className].filter(Boolean).join(" ")}
      style={getDrumTextVars(cellPx, windowPx, windowRadius)}
    >
      {reels.map((reel, i) => {
        const isSpace = text[i] === " ";

        if (isSpace) {
          return (
            <span
              key={`space-${i}`}
              className={DRUM_TEXT_CLASSES.space}
              style={getSpaceWidthStyle()}
              aria-hidden="true"
            />
          );
        }

        return (
          <span key={i} aria-hidden="true" className={DRUM_TEXT_CLASSES.reelWindow}>
            <span
              data-reel
              data-items={reel.length}
              className={DRUM_TEXT_CLASSES.reelTrack}
            >
              {reel.map((c, idx) => (
                <span key={idx} className={DRUM_TEXT_CLASSES.reelCell}>
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </span>
          </span>
        );
      })}

      <span className={DRUM_TEXT_CLASSES.srOnly} style={SCREEN_READER_ONLY_STYLE}>
        {text}
      </span>
    </span>
  );
}
