import DrumText from "./DrumText";

export default function Hero() {
  return (
    <section className="py-16 sm:py-20">

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="font-mono">
          <DrumText text="Dmitry Uvarov" spins={4} cellPx={64} />
          <DrumText
              text="Software Developer"
              spins={3}         
              cellPx={56}
              baseDuration={0.7} 
              windowPx={44}
          />
        </span>
      </h1>
    </section>
  );
}
