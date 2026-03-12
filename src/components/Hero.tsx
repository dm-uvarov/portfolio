import DrumText from "./DrumText";
import { GithubIcon, MailIcon } from "./Icons";

type HeroLink = {
  label: string;
  href: string;
  icon: typeof GithubIcon;
  external?: boolean;
};

const HERO_CLASSES = {
  section: "pb-12 pt-2 sm:pb-16 sm:pt-4",
  title: "text-[clamp(1.75rem,7vw,2.25rem)] font-semibold tracking-tight text-slate-800 sm:text-4xl",
  titleInner: "inline-block",
  subtitle: "mt-5 text-base text-slate-500 sm:text-lg",
  links: "mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600 sm:gap-7 sm:text-base",
  link: "group inline-flex items-center gap-2 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
  icon: "text-slate-500 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300",
  linkText:
    "inline-block min-w-[64px] text-left font-medium transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-emerald-300 group-hover:[-webkit-text-stroke:0.2px_#334155] group-hover:[text-shadow:0_0_0.8px_rgba(51,65,85,0.5)]",
} as const;

const heroLinks: HeroLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/dm-uvarov",
    icon: GithubIcon,
    external: true,
  },
  {
    label: "Contact",
    href: "mailto:contact@example.com",
    icon: MailIcon,
  },
];

export default function Hero() {
  return (
    <section className={HERO_CLASSES.section}>
      <h1 className={HERO_CLASSES.title}>
        <span className={HERO_CLASSES.titleInner}>
          <DrumText text="Dmitry Uvarov" spins={1} baseDuration={1} cellPx={44} windowPx={36} />
        </span>
      </h1>
      <p className={HERO_CLASSES.subtitle}>Software • Development</p>
      <div className={HERO_CLASSES.links}>
        {heroLinks.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            className={HERO_CLASSES.link}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <Icon size={18} className={HERO_CLASSES.icon} />
            <span className={HERO_CLASSES.linkText}>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
