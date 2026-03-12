import type { CSSProperties } from "react";

const SCREEN_READER_ONLY: CSSProperties = {
  position: "absolute",
  left: "-9999px",
};

export const getDrumTextVars = (
  cellPx: number,
  windowPx: number,
  windowRadius: number,
): CSSProperties => ({
  "--drum-cell-px": `${cellPx}px`,
  "--drum-window-px": `${windowPx}px`,
  "--drum-window-radius": `${windowRadius}px`,
} as CSSProperties);

export const getSpaceWidthStyle = (width = 14): CSSProperties => ({
  width,
});

export const SCREEN_READER_ONLY_STYLE = SCREEN_READER_ONLY;
