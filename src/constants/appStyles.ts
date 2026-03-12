export const APP_CLASSES = {
  shell: "relative min-h-screen overflow-x-hidden bg-[#f3f4f2] text-slate-800",
  background: "pointer-events-none fixed inset-0 z-0",
  circle:
    "absolute left-[56%] top-[-200px] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#e9f4ec] via-[#e4efe8] to-[#ddebe2]",
  tail:
    "absolute left-1/2 top-1/2 h-20 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4e2d0]/80 opacity-20 blur-md",
  droplet:
    "absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4e2d0]/85 opacity-60 blur-md",
  spark:
    "absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-0 mix-blend-screen",
  sparkGlow:
    "absolute inset-0 bg-[radial-gradient(circle_at_42%_38%,rgba(212,246,228,0.35)_0%,rgba(163,219,191,0.18)_40%,rgba(121,182,154,0.04)_72%,rgba(94,146,122,0)_100%)]",
  sparkSvg: "absolute inset-0 h-full w-full",
  main: "relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-20 sm:px-8",
} as const;

export const BOLT_PATHS = [
  {
    key: "bolt1",
    d: "M58 16 L47 38 L56 38 L42 72",
    stroke: "rgba(236,255,246,0.95)",
    strokeWidth: 2.2,
  },
  {
    key: "bolt2",
    d: "M37 26 L31 41 L37 41 L29 58",
    stroke: "rgba(222,252,236,0.9)",
    strokeWidth: 1.8,
  },
  {
    key: "bolt3",
    d: "M71 34 L64 48 L71 48 L62 66",
    stroke: "rgba(220,250,234,0.88)",
    strokeWidth: 1.7,
  },
] as const;
