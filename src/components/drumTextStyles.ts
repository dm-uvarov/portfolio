import type { CSSProperties } from "react";

const SCREEN_READER_ONLY: CSSProperties = {
  position: "absolute",
  left: "-9999px",
};

export const DRUM_TEXT_GAP_PX = 3;
export const DRUM_TEXT_SPACE_PX = 14;

export const getDrumShellStyle = (width: number, height: number): CSSProperties => ({
  width: `${width}px`,
  height: `${height}px`,
});

export const getDrumTextVars = (
  cellPx: number,
  windowPx: number,
  windowRadius: number,
): CSSProperties => ({
  "--drum-cell-px": `${cellPx}px`,
  "--drum-window-px": `${windowPx}px`,
  "--drum-window-radius": `${windowRadius}px`,
} as CSSProperties);

export const getDrumScaleStyle = (scale: number): CSSProperties => ({
  transform: `scale(${scale})`,
});

export const getSpaceWidthStyle = (width = DRUM_TEXT_SPACE_PX): CSSProperties => ({
  width,
});

export const SCREEN_READER_ONLY_STYLE = SCREEN_READER_ONLY;
