import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "cs493-tarpaulin-go",
    description: "REST API service in Go with Gin, cloud deployment, and backend-focused architecture.",
    href: "https://github.com/dm-uvarov/cs493-tarpaulin-go",
    tags: ["API", "Go", "Backend", "GCloud", "Gin Gonic"],
  },
  {
    title: "Textera",
    description: "Team TypeScript text adventure platform.",
    href: "https://github.com/dm-uvarov/cs461-text-adventure/tree/main/code",
    tags: ["Capstone", "TypeScript", "Team Work"],
  },
  {
    title: "CG_final",
    description: "OpenGL graphics final project focused on real-time rendering and scene composition.",
    href: "https://github.com/dm-uvarov/CG_final",
    tags: ["Computer Graphics", "OpenGL", "Final Project"],
  },
  {
    title: "cs361",
    description: "Course engineering project with modular services, API integration, and iterative development.",
    href: "https://github.com/dm-uvarov/cs361",
    tags: ["API", "Services", "Course Project"],
  },
  {
    title: "photos-from-space",
    description: "Web app that fetches and presents space imagery from external APIs with clean gallery UX.",
    href: "https://github.com/dm-uvarov/photos-from-space",
    tags: ["Space Images", "API", "Web App"],
  },
];

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
        hoverTween = gsap.to(card, {
          x: 12,
          duration: 0.85,
          delay: 0.28,
          ease: "power3.out",
          overwrite: "auto",
        });

        if (stripe) {
          stripeTween = gsap.to(stripe, {
            opacity: 1,
            scaleY: 1,
            duration: 0.72,
            delay: 0.28,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const onLeave = () => {
        hoverTween?.kill();
        stripeTween?.kill();
        hoverTween = gsap.to(card, {
          x: 0,
          duration: 0.62,
          ease: "power2.inOut",
          overwrite: "auto",
        });

        if (stripe) {
          stripeTween = gsap.to(stripe, {
            opacity: 0,
            scaleY: 0.7,
            duration: 0.5,
            ease: "power2.inOut",
            overwrite: "auto",
          });
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
    <section ref={scope} className="pb-20">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Projects
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.title}
            data-card
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group relative flex h-[230px] flex-col overflow-visible rounded-md border border-slate-200 bg-white/70 p-6"
          >
            <span
              data-stripe
              aria-hidden
              className="pointer-events-none absolute bottom-5 -left-3 top-5 w-[4px] scale-y-75 rounded-full bg-emerald-200/90 opacity-0"
            />
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[1.2rem] font-medium text-slate-900">{project.title}</h3>
              <ExternalLink
                size={16}
                className="mt-1 text-slate-500"
              />
            </div>
            <p className="mt-4 text-[0.9rem] leading-relaxed text-slate-600">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {project.tags.map((tag) => (
                <span
                  key={`${project.title}-${tag}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
