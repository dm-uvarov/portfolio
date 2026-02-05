import Hero from "./components/Hero";
import  {Projects}  from "./components/Projects";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-4">
        <Hero />
        <Projects />
      </main>
    </div>
  );
}