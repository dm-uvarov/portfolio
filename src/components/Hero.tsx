import DrumText from "./DrumText";
import { Github, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="pb-12 pt-2 sm:pb-16 sm:pt-4">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-4xl">
        <span className="inline-block">
          <DrumText text="Dmitry Uvarov" spins={1} baseDuration={1} cellPx={44} windowPx={36} />
        </span>
      </h1>
      <p className="mt-5 text-lg text-slate-500">Software • Development</p>
      <div className="mt-7 flex flex-wrap items-center gap-7 text-base text-slate-600">
        <a
          className="group inline-flex items-center gap-2 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          href="https://github.com/dm-uvarov"
          target="_blank"
          rel="noreferrer"
        >
          <Github
            size={18}
            className="text-slate-500 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300"
          />
          <span className="inline-block w-[64px] text-left font-medium transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300 group-hover:[-webkit-text-stroke:0.2px_#334155] group-hover:[text-shadow:0_0_0.8px_rgba(51,65,85,0.5)]">
            GitHub
          </span>
        </a>
        <a
          className="group inline-flex items-center gap-2 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          href="mailto:contact@example.com"
        >
          <Mail
            size={18}
            className="text-slate-500 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300"
          />
          <span className="inline-block w-[64px] text-left font-medium transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300 group-hover:[-webkit-text-stroke:0.2px_#334155] group-hover:[text-shadow:0_0_0.8px_rgba(51,65,85,0.5)]">
            Contact
          </span>
        </a>
      </div>
    </section>
  );
}
