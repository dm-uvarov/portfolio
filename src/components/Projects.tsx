import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "./config/projects";
import type { Project } from "./config/projects";
import { ExternalLinkIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_CLASSES = {
  section: "pb-20",
  heading: "mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500",
  grid: "grid grid-cols-1 gap-10 md:grid-cols-2",
  card: "group relative flex h-[230px] flex-col overflow-visible rounded-md border border-slate-200 bg-white/70 p-6",
  stripe:
    "pointer-events-none absolute bottom-5 -left-3 top-5 w-[4px] scale-y-75 rounded-full bg-emerald-200/90 opacity-0",
  header: "flex items-start justify-between gap-3",
  title: "text-[1.2rem] font-medium text-slate-900",
  icon: "mt-1 text-slate-500",
  placeholderLabel: "mt-0.5 text-[0.72rem] uppercase tracking-[0.16em] text-slate-400",
  description: "mt-4 text-[0.9rem] leading-relaxed text-slate-600",
  tagList: "mt-auto flex flex-wrap gap-2 pt-5",
  tag: "rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] text-slate-500",
} as const;

const CARD_ANIMATION = {
  enter: {
    x: 12,
    duration: 0.85,
    delay: 0.28,
    ease: "power3.out",
    overwrite: "auto" as const,
  },
  leave: {
    x: 0,
    duration: 0.62,
    ease: "power2.inOut",
    overwrite: "auto" as const,
  },
  stripeEnter: {
    opacity: 1,
    scaleY: 1,
    duration: 0.72,
    delay: 0.28,
    ease: "power3.out",
    overwrite: "auto" as const,
  },
  stripeLeave: {
    opacity: 0,
    scaleY: 0.7,
    duration: 0.5,
    ease: "power2.inOut",
    overwrite: "auto" as const,
  },
} as const;

type ProjectCardProps = {
  project: Project;
};

function ProjectBody({ project }: ProjectCardProps) {
  return (
    <>
      <span data-stripe aria-hidden className={PROJECT_CLASSES.stripe} />
      <div className={PROJECT_CLASSES.header}>
        <h3 className={PROJECT_CLASSES.title}>{project.title}</h3>
        {project.href ? (
          <ExternalLinkIcon size={16} className={PROJECT_CLASSES.icon} />
        ) : (
          <span className={PROJECT_CLASSES.placeholderLabel}>no public repo</span>
        )}
      </div>
      <p className={PROJECT_CLASSES.description}>{project.description}</p>
      <div className={PROJECT_CLASSES.tagList}>
        {project.tags.map((tag) => (
          <span key={`${project.title}-${tag}`} className={PROJECT_CLASSES.tag}>
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  if (project.href) {
    return (
      <a
        data-card
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className={PROJECT_CLASSES.card}
      >
        <ProjectBody project={project} />
      </a>
    );
  }

  return (
    <div data-card className={PROJECT_CLASSES.card}>
      <ProjectBody project={project} />
    </div>
  );
}

export function Projects() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
    const stripes = gsap.utils.toArray<HTMLElement>("[data-stripe]");
    const cleanups: Array<() => void> = [];

    gsap.set(stripes, { opacity: 0, scaleY: 0.7, transformOrigin: "center center" });

    gsap.from(cards, {
      opacity: 0,
      y: 16,
      duration: 1.2,
      stagger: 0.14,
      scrollTrigger: {
        trigger: scope.current,
        start: "top 80%",
      },
    });

    cards.forEach((card) => {
      const stripe = card.querySelector<HTMLElement>("[data-stripe]");
      let hoverTween: gsap.core.Tween | null = null;
      let stripeTween: gsap.core.Tween | null = null;

      const onEnter = () => {
        hoverTween?.kill();
        stripeTween?.kill();
        hoverTween = gsap.to(card, CARD_ANIMATION.enter);

        if (stripe) {
          stripeTween = gsap.to(stripe, CARD_ANIMATION.stripeEnter);
        }
      };

      const onLeave = () => {
        hoverTween?.kill();
        stripeTween?.kill();
        hoverTween = gsap.to(card, CARD_ANIMATION.leave);

        if (stripe) {
          stripeTween = gsap.to(stripe, CARD_ANIMATION.stripeLeave);
        }
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        hoverTween?.kill();
        stripeTween?.kill();
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, { scope });

  return (
    <section ref={scope} className={PROJECT_CLASSES.section}>
      <h2 className={PROJECT_CLASSES.heading}>Projects</h2>
      <div className={PROJECT_CLASSES.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
