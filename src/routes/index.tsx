import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import campaignImage from "@/assets/flux-campaign.jpg";
import { createFileRoute } from "@tanstack/react-router";

gsap.registerPlugin(ScrollTrigger);

const services = [
  ["01", "Brand identity", "Naming, systems and the words that make it feel inevitable."],
  ["02", "Digital & web", "Sites and products that move people, not just pages."],
  ["03", "Motion & film", "Title sequences and loops built for the modern feed."],
  ["04", "Art direction", "Campaign worlds, photography and a point of view."],
];

const projects = [
  { name: "Sonder House", type: "Identity / 2024", className: "md:col-span-7", color: "bg-flux-orange", image: true },
  { name: "Goodform", type: "Digital / 2024", className: "md:col-span-5", color: "bg-flux-violet" },
  { name: "Tidepool", type: "Campaign / 2023", className: "md:col-span-5", color: "bg-flux-green" },
  { name: "Noonlight", type: "Motion / 2025", className: "md:col-span-7", color: "bg-flux-pink" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flux Studio — Brands in Motion" },
      { name: "description", content: "Flux Studio shapes identities, digital experiences and motion for ambitious brands." },
      { property: "og:title", content: "Flux Studio — Brands in Motion" },
      { property: "og:description", content: "An independent creative studio for brands that want to feel alive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function BrandMark() {
  return <span className="grid size-8 place-items-center rounded-full bg-flux-orange font-display text-sm font-bold text-primary-foreground">F</span>;
}

function ProjectTile({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <motion.a
      href="#contact"
      className={`group block ${project.className}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[1.45] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card transition-transform duration-700 group-hover:-translate-y-2">
        {project.image ? (
          <img src={campaignImage} alt="Sonder House campaign packaging" width={1408} height={912} loading="lazy" className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        ) : (
          <div className={`size-full ${project.color} flux-grid-bg relative overflow-hidden`}>
            <div className="absolute inset-[13%] rounded-full border-[clamp(18px,4vw,64px)] border-primary-foreground/80" />
            <div className="absolute bottom-[13%] right-[14%] size-[30%] rounded-[1.5rem] bg-primary-foreground/80" />
            {index % 2 === 0 && <div className="absolute left-[12%] top-[15%] h-[38%] w-[18%] rounded-full bg-primary-foreground/80" />}
          </div>
        )}
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-background/75 px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground backdrop-blur-md">
          <span>{project.type.split(" /")[0]}</span><ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-medium tracking-tight">{project.name}</h3>
        <span className="text-sm text-muted-foreground">{project.type.split(" / ")[1]}</span>
      </div>
    </motion.a>
  );
}

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 80, damping: 22, mass: 0.4 });
  const heroY = useTransform(smoothY, [0, 900], [0, 170]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 82%" } });
      });
    }, heroRef);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); ctx.revert(); };
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-30 px-4 pt-4 sm:px-6 sm:pt-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-foreground/10 bg-background/75 p-2 pl-3 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2 pr-3"><BrandMark /><span className="font-display text-lg font-bold tracking-tight">Flux Studio</span></a>
          <div className="hidden items-center gap-1 md:flex">
            {[["Work", "#work"], ["Services", "#services"], ["Studio", "#studio"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">{label}</a>)}
          </div>
          <a href="#contact" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:block">Start a project</a>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground sm:hidden">{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-foreground/10 bg-background/95 p-3 backdrop-blur-xl sm:hidden">
            <div className="grid gap-1">
              {[["Work", "#work"], ["Services", "#services"], ["Studio", "#studio"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-xl font-medium transition-colors hover:bg-foreground/5">{label}<ArrowUpRight className="size-4 text-muted-foreground" /></a>)}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground">Start a project</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative px-5 pb-10 pt-20 sm:px-8 sm:pt-32">
          <motion.div style={{ y: heroY }} className="mx-auto max-w-7xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-flux-orange"><span className="size-1.5 rounded-full bg-flux-orange" />Independent creative studio · Est. 2019</p>
            <h1 className="max-w-6xl font-display text-[clamp(4.1rem,12.3vw,11rem)] font-medium leading-[0.82] tracking-[-0.06em] text-balance">Ideas set<br />in <span className="text-flux-orange">motion</span>,<br /><em className="font-normal text-flux-pink">made human.</em></h1>
            <div className="mt-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">Strategy, design and motion for ambitious teams. We shape identities that feel warm, considered and quietly unmissable.</p>
              <a href="#work" className="group flex items-center gap-3 text-sm font-semibold"><span className="grid size-11 place-items-center rounded-full border border-foreground/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><ArrowDown className="size-4" /></span>See selected work</a>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-24 sm:px-6" aria-label="Flux capabilities">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 rounded-[1.5rem] border border-foreground/10 bg-card p-2 sm:grid-cols-4 sm:gap-3 sm:p-3">
            <div className="relative col-span-2 row-span-2 min-h-[390px] overflow-hidden rounded-[1rem] bg-flux-orange p-5 text-primary-foreground sm:min-h-[480px]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,var(--color-flux-sand)_0_7%,transparent_7.5%),linear-gradient(140deg,transparent_0_58%,var(--color-flux-violet)_58%_72%,transparent_72%)] opacity-70" /><div className="relative flex h-full flex-col justify-between"><span className="font-display text-5xl font-semibold leading-none sm:text-7xl">Make<br />it<br /><em className="font-normal">move.</em></span><span className="text-xs uppercase tracking-[0.2em]">Full-stack creative partner</span></div></div>
            {[['Identity', 'Names & systems', 'bg-flux-pink text-primary-foreground'], ['Motion', 'Reels & loops', 'bg-flux-lime text-primary-foreground'], ['Web', 'Sites & products', 'bg-flux-violet text-primary-foreground'], ['Strategy', 'Positioning & voice', 'bg-flux-green text-primary-foreground']].map(([title, caption, classes], index) => <div key={title} className={`flux-float flex min-h-[190px] flex-col justify-between rounded-[1rem] p-5 ${classes}`} style={{ animationDelay: `${index * -1.2}s` }}><span className="font-display text-3xl font-semibold leading-none">{title}</span><span className="text-xs uppercase tracking-[0.16em] opacity-75">{caption}</span></div>)}
          </div>
        </section>

        <section className="border-y border-foreground/10 py-16 sm:py-24" data-gsap-reveal>
          <div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="max-w-5xl font-display text-[clamp(2.2rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em]">We treat every project as a piece of <span className="text-flux-orange">editorial</span> — considered, confident and quietly <span className="text-flux-pink">kinetic.</span></p></div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" data-gsap-reveal>
          <div className="mb-10 flex items-end justify-between"><h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">What we do</h2><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">04 disciplines</span></div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">{services.map(([number, title, description]) => <div key={number} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:justify-between"><div className="flex items-baseline gap-5"><span className="text-sm tabular-nums text-muted-foreground">{number}</span><h3 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h3></div><p className="max-w-sm text-sm text-muted-foreground sm:text-right">{description}</p></div>)}</div>
        </section>

        <section id="work" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32" data-gsap-reveal>
          <div className="mb-10 flex items-end justify-between"><h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">Selected work</h2><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">2023 — 2025</span></div>
          <div className="grid gap-x-5 gap-y-12 md:grid-cols-12">{projects.map((project, index) => <ProjectTile key={project.name} project={project} index={index} />)}</div>
        </section>

        <section id="studio" className="border-t border-foreground/10 py-24 sm:py-32" data-gsap-reveal>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-12"><div className="md:col-span-7"><blockquote className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">“Flux took a fuzzy brief and turned it into a brand we genuinely believe in.”</blockquote><p className="mt-8 text-sm text-muted-foreground">Dana Reyes — Founder, Northwind</p></div><div className="md:col-span-5 md:border-l md:border-foreground/10 md:pl-10"><p className="mb-5 text-xs uppercase tracking-[0.2em] text-flux-orange">The studio</p><p className="max-w-sm text-lg leading-relaxed text-muted-foreground">A small, senior team of designers and directors working across three cities. We keep the room close and the work moving.</p></div></div>
        </section>

        <footer id="contact" className="border-t border-foreground/10 px-5 pb-10 pt-20 sm:px-8 sm:pt-28"><div className="mx-auto max-w-7xl"><p className="text-xs uppercase tracking-[0.22em] text-flux-pink">Have a project in mind?</p><a href="mailto:hello@flux.studio" className="group mt-5 block font-display text-[clamp(3.6rem,11.8vw,11rem)] font-medium leading-[0.82] tracking-[-0.065em] transition-colors hover:text-flux-orange">Let&apos;s make<br /><em className="font-normal">it move</em><ArrowUpRight className="ml-3 inline size-[0.55em] -translate-y-1 align-top transition-transform group-hover:translate-x-2 group-hover:-translate-y-3" /></a><div className="mt-16 flex flex-col justify-between gap-6 border-t border-foreground/10 pt-7 text-sm sm:flex-row sm:items-center"><span className="font-display text-lg font-semibold">Flux Studio</span><div className="flex gap-5 text-muted-foreground"><a href="#work" className="hover:text-foreground">Work</a><a href="#services" className="hover:text-foreground">Services</a><a href="mailto:hello@flux.studio" className="hover:text-foreground">Email</a></div><span className="text-muted-foreground">© 2026 Flux Studio</span></div></div></footer>
      </main>
    </div>
  );
}