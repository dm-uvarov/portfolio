import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  DRUM_TEXT_GAP_PX,
  DRUM_TEXT_SPACE_PX,
  getDrumScaleStyle,
  getDrumShellStyle,
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
const MOBILE_BREAKPOINT_PX = 524;
const MOBILE_COMPACT_BREAKPOINT_PX = 486;
const MOBILE_MIN_WIDTH_PX = 320;
const MOBILE_MIN_FACTOR = 0.82;
const VIEWPORT_SIDE_PADDING_PX = 32;
const SHELL_WIDTH_BUFFER_PX = 4;
const DRUM_TEXT_CLASSES = {
  shell: "drum-text-shell",
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
  const shellRef = useRef<HTMLSpanElement>(null);
  const scope = useRef<HTMLSpanElement>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof window === "undefined") {
      return MOBILE_BREAKPOINT_PX;
    }

    return window.innerWidth;
  });

  const characters = useMemo(() => Array.from(text), [text]);

  const responsiveFactor = useMemo(() => {
    if (viewportWidth >= MOBILE_BREAKPOINT_PX) {
      return 1;
    }

    const progress =
      (viewportWidth - MOBILE_MIN_WIDTH_PX) / (MOBILE_BREAKPOINT_PX - MOBILE_MIN_WIDTH_PX);
    const clampedProgress = Math.min(1, Math.max(0, progress));

    return MOBILE_MIN_FACTOR + (1 - MOBILE_MIN_FACTOR) * clampedProgress;
  }, [viewportWidth]);

  const compactFactor = useMemo(() => {
    if (viewportWidth >= MOBILE_COMPACT_BREAKPOINT_PX) {
      return 1;
    }

    const progress =
      (viewportWidth - MOBILE_MIN_WIDTH_PX) / (MOBILE_COMPACT_BREAKPOINT_PX - MOBILE_MIN_WIDTH_PX);
    const clampedProgress = Math.min(1, Math.max(0, progress));

    return 0.96 + 0.04 * clampedProgress;
  }, [viewportWidth]);

  const effectiveCellPx = cellPx * responsiveFactor * compactFactor;
  const effectiveWindowPx = windowPx * responsiveFactor * compactFactor;
  const effectiveWindowRadius = windowRadius * responsiveFactor * compactFactor;
  const effectiveGapPx = DRUM_TEXT_GAP_PX * responsiveFactor * compactFactor;
  const effectiveSpacePx = DRUM_TEXT_SPACE_PX * responsiveFactor * compactFactor;

  const reels = useMemo(() => {
    return characters.map((ch) => {
      const target = ch === " " ? " " : ch;

      const after: string[] = [];
      for (let i = 0; i < Math.max(1, spins); i += 1) {
        after.push(...Array.from(ALPHABET));
      }

      return [target, ...after];
    });
  }, [characters, spins]);

  const baseWidth = useMemo(() => {
    const contentWidth = characters.reduce((total, char) => {
      return total + (char === " " ? effectiveSpacePx : effectiveWindowPx);
    }, 0);

    return contentWidth + Math.max(0, characters.length - 1) * effectiveGapPx;
  }, [characters, effectiveGapPx, effectiveSpacePx, effectiveWindowPx]);

  const scale = useMemo(() => {
    const maxWidth = Math.max(MOBILE_MIN_WIDTH_PX, viewportWidth - VIEWPORT_SIDE_PADDING_PX);
    return Math.min(1, maxWidth / baseWidth);
  }, [baseWidth, viewportWidth]);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  useGSAP(
    () => {
      if (!scope.current) return;

      const reelEls = scope.current.querySelectorAll<HTMLElement>("[data-reel]");

      reelEls.forEach((el, i) => {
        const items = Number(el.dataset.items || "0");
        const startY = -1 * (items - 1) * effectiveCellPx;
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
    { scope, dependencies: [text, spins, effectiveCellPx, baseDuration], revertOnUpdate: true }
  );

  return (
    <span
      ref={shellRef}
      className={DRUM_TEXT_CLASSES.shell}
      style={getDrumShellStyle(baseWidth * scale + SHELL_WIDTH_BUFFER_PX, effectiveCellPx * scale)}
    >
      <span
        ref={scope}
        className={[DRUM_TEXT_CLASSES.root, className].filter(Boolean).join(" ")}
        style={{
          ...getDrumTextVars(effectiveCellPx, effectiveWindowPx, effectiveWindowRadius),
          ...getDrumScaleStyle(scale),
        }}
      >
        {reels.map((reel, i) => {
          const isSpace = text[i] === " ";

          if (isSpace) {
            return (
              <span
                key={`space-${i}`}
                className={DRUM_TEXT_CLASSES.space}
                style={getSpaceWidthStyle(effectiveSpacePx)}
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
    </span>
  );
}
