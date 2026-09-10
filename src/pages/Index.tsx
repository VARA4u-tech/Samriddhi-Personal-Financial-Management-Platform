import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  ["01", "Smart Budgets", "Set custom limits and track your spending in real-time."],
  ["02", "Automated Tracking", "Categorize transactions and manage recurring expenses effortlessly."],
  ["03", "Savings Goals", "Define your targets and watch your wealth grow step-by-step."],
  ["04", "Deep Analytics", "Gain actionable insights into your financial habits and trends."],
];

const projects = [
  { name: "Unified Dashboard", type: "Overview / Analytics", className: "md:col-span-7", color: "bg-flux-orange" },
  { name: "Transaction History", type: "Tracking / Categorization", className: "md:col-span-5", color: "bg-flux-violet" },
  { name: "Smart Insights", type: "AI / Recommendations", className: "md:col-span-5", color: "bg-flux-green" },
  { name: "Comprehensive Reports", type: "Export / Print", className: "md:col-span-7", color: "bg-flux-pink" },
];

function BrandMark() {
  return <span className="grid size-8 place-items-center rounded-full bg-flux-orange font-display text-sm font-bold text-primary-foreground">S</span>;
}

function MagneticLink({ children, className, ...props }: HTMLMotionProps<"a">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      {...props}
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (prefersReducedMotion || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
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
      <div data-tilt className="flux-tilt relative aspect-[1.45] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card transition-transform duration-700 group-hover:-translate-y-2">
        <div className={`size-full ${project.color} flux-grid-bg relative overflow-hidden`}>
          <div className="absolute inset-[13%] rounded-full border-[clamp(18px,4vw,64px)] border-primary-foreground/80" />
          <div className="absolute bottom-[13%] right-[14%] size-[30%] rounded-[1.5rem] bg-primary-foreground/80" />
          {index % 2 === 0 && <div className="absolute left-[12%] top-[15%] h-[38%] w-[18%] rounded-full bg-primary-foreground/80" />}
        </div>
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

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 80, damping: 22, mass: 0.4 });
  const heroY = useTransform(smoothY, [0, 900], [0, 170]);

  useEffect(() => {
    const lenis = prefersReducedMotion ? null : new Lenis({ duration: 1.15, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
    if (lenis) frame = requestAnimationFrame(raf);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 82%" } });
      });
    }, heroRef);
    return () => { cancelAnimationFrame(frame); lenis?.destroy(); ctx.revert(); };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const root = heroRef.current;
    const cursor = cursorRef.current;
    if (!root || !cursor || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      cursor.style.opacity = "1";
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const handlePointerLeave = () => { cursor.style.opacity = "0"; };
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const tiltCards = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
    const cleanups = tiltCards.map((card) => {
      const handlePointerMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
        card.style.setProperty("--tilt-x", `${rotateX}deg`);
        card.style.setProperty("--tilt-y", `${rotateY}deg`);
      };
      const resetTilt = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };
      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", resetTilt);
      return () => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerleave", resetTilt);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [prefersReducedMotion]);

  return (
    <div ref={heroRef} className="min-h-screen overflow-hidden bg-background text-foreground">
      <div ref={cursorRef} aria-hidden="true" className="flux-cursor pointer-events-none fixed left-0 top-0 z-50 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-flux-orange" />
      <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-flux-orange" style={{ scaleX: scrollYProgress }} />
      <header className="relative z-30 px-4 pt-4 sm:px-6 sm:pt-6">
        <motion.nav initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-foreground/10 bg-background/75 p-2 pl-3 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2 pr-3"><BrandMark /><span className="font-display text-lg font-bold tracking-tight">Samriddhi</span></a>
          <div className="hidden items-center gap-1 md:flex">
            {[["Features", "#features"], ["Capabilities", "#capabilities"], ["Platform", "#platform"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">{label}</a>)}
          </div>
          <MagneticLink href="#contact" className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-flux-orange sm:block">Get Started</MagneticLink>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground sm:hidden">{menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button>
        </motion.nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-foreground/10 bg-background/95 p-3 backdrop-blur-xl sm:hidden">
            <div className="grid gap-1">
              {[["Features", "#features"], ["Capabilities", "#capabilities"], ["Platform", "#platform"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-xl font-medium transition-colors hover:bg-foreground/5">{label}<ArrowUpRight className="size-4 text-muted-foreground" /></a>)}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground">Get Started</a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative px-5 pb-10 pt-20 sm:px-8 sm:pt-32">
          <motion.div style={{ y: heroY }} className="mx-auto max-w-7xl">
            <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-flux-orange"><span className="size-1.5 rounded-full bg-flux-orange" />Personal Financial Management · Est. 2026</p>
            <h1 className="max-w-6xl font-display text-[clamp(3.1rem,12.3vw,11rem)] font-medium leading-[0.85] tracking-[-0.06em] text-balance">Take control<br />of your <span className="text-flux-orange">finances</span>,<br /><em className="font-normal text-flux-pink">build wealth.</em></h1>
            <div className="mt-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">Track transactions, manage budgets, and achieve savings goals with smart insights and powerful analytics.</p>
              <a href="#features" className="group flex items-center gap-3 text-sm font-semibold"><span className="grid size-11 place-items-center rounded-full border border-foreground/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><ArrowDown className="size-4" /></span>Explore features</a>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-24 sm:px-6" aria-label="Platform capabilities">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 rounded-[1.5rem] border border-foreground/10 bg-card p-2 sm:grid-cols-4 sm:gap-3 sm:p-3">
            <div className="relative col-span-2 row-span-2 min-h-[390px] overflow-hidden rounded-[1rem] bg-flux-orange p-5 text-primary-foreground sm:min-h-[480px]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,var(--color-flux-sand)_0_7%,transparent_7.5%),linear-gradient(140deg,transparent_0_58%,var(--color-flux-violet)_58%_72%,transparent_72%)] opacity-70" /><div className="relative flex h-full flex-col justify-between"><span className="font-display text-5xl font-semibold leading-none sm:text-7xl">Grow<br />your<br /><em className="font-normal">wealth.</em></span><span className="text-xs uppercase tracking-[0.2em]">Complete financial platform</span></div></div>
            {[['Secure', 'Authentication', 'bg-flux-pink text-primary-foreground'], ['Automated', 'Recurring Expenses', 'bg-flux-lime text-primary-foreground'], ['Categorized', 'Smart labeling', 'bg-flux-violet text-primary-foreground'], ['Analytics', 'Financial Reports', 'bg-flux-green text-primary-foreground']].map(([title, caption, classes], index) => <div key={title} className={`flux-float flex min-h-[190px] flex-col justify-between rounded-[1rem] p-5 ${classes}`} style={{ animationDelay: `${index * -1.2}s` }}><span className="font-display text-3xl font-semibold leading-none">{title}</span><span className="text-xs uppercase tracking-[0.16em] opacity-75">{caption}</span></div>)}
          </div>
        </section>

        <section aria-label="Platform specialties" className="overflow-hidden border-y border-foreground/10 py-4">
          <div className="flux-marquee flex w-max items-center gap-8 whitespace-nowrap font-display text-2xl font-medium uppercase tracking-[-0.03em] text-muted-foreground sm:text-3xl">
            {Array.from({ length: 2 }).map((_, index) => <span key={index} className="flex items-center gap-8">Track Transactions <span className="text-flux-orange">✳</span> Set Budgets <span className="text-flux-pink">✳</span> Achieve Goals <span className="text-flux-lime">✳</span> Gain Insights <span className="text-flux-violet">✳</span></span>)}
          </div>
        </section>

        <section className="border-y border-foreground/10 py-16 sm:py-24" data-gsap-reveal>
          <div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="max-w-5xl font-display text-[clamp(2.2rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em]">We transform your financial data into clear, actionable <span className="text-flux-orange">insights</span> — empowering you to build a secure <span className="text-flux-pink">future.</span></p></div>
        </section>

        <section id="capabilities" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" data-gsap-reveal>
          <div className="mb-10 flex items-end justify-between"><h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">Core Capabilities</h2><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Platform Features</span></div>
           <div className="divide-y divide-foreground/10 border-y border-foreground/10">{services.map(([number, title, description]) => <div key={number} className="group flex flex-col gap-3 py-6 transition-colors hover:bg-foreground/[0.03] sm:flex-row sm:items-baseline sm:justify-between"><div className="flex items-baseline gap-5"><span className="text-sm tabular-nums text-muted-foreground transition-colors group-hover:text-flux-orange">{number}</span><h3 className="font-display text-2xl font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">{title}</h3><ArrowUpRight className="size-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" /></div><p className="max-w-sm text-sm text-muted-foreground sm:text-right">{description}</p></div>)}</div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32" data-gsap-reveal>
          <div className="mb-10 flex items-end justify-between"><h2 className="font-display text-3xl font-medium tracking-tight sm:text-5xl">Platform Modules</h2><span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">All-in-one Dashboard</span></div>
          <div className="grid gap-x-5 gap-y-12 md:grid-cols-12">{projects.map((project, index) => <ProjectTile key={project.name} project={project} index={index} />)}</div>
        </section>

        <section id="platform" className="border-t border-foreground/10 py-24 sm:py-32" data-gsap-reveal>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-12"><div className="md:col-span-7"><blockquote className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">"Samriddhi gave me the clarity I needed to take control of my finances and actually reach my savings goals."</blockquote><p className="mt-8 text-sm text-muted-foreground">Alex Chen — Early Adopter</p></div><div className="md:col-span-5 md:border-l md:border-foreground/10 md:pl-10"><p className="mb-5 text-xs uppercase tracking-[0.2em] text-flux-orange">The Platform</p><p className="max-w-sm text-lg leading-relaxed text-muted-foreground">A comprehensive suite of tools designed to simplify your financial life. From daily transactions to long-term goals, we've got you covered.</p></div></div>
        </section>

        <footer id="contact" className="border-t border-foreground/10 px-5 pb-8 pt-20 sm:px-8 sm:pt-28" data-gsap-reveal>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-flux-pink"><span className="size-1.5 animate-pulse rounded-full bg-flux-pink" />Ready to take control?</p>
                <a href="mailto:hello@samriddhi.app" className="group mt-5 block font-display text-[clamp(2.9rem,10.5vw,9rem)] font-medium leading-[0.88] tracking-[-0.06em] transition-colors hover:text-flux-orange">Start your<br /><em className="font-normal">journey</em><ArrowUpRight className="ml-3 inline size-[0.5em] -translate-y-1 align-top transition-transform group-hover:translate-x-2 group-hover:-translate-y-3" /></a>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                   <MagneticLink href="mailto:hello@samriddhi.app" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-flux-orange">Get Started</MagneticLink>
                   <MagneticLink href="mailto:hello@samriddhi.app" className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:border-flux-orange">hello@samriddhi.app</MagneticLink>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5 lg:pl-10">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Sitemap</p>
                  <ul className="space-y-2.5 text-sm">{[["Features", "#features"], ["Capabilities", "#capabilities"], ["Platform", "#platform"], ["Top", "#top"]].map(([label, href]) => <li key={label}><a href={href} className="transition-colors hover:text-flux-orange">{label}</a></li>)}</ul>
                </div>
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Socials</p>
                  <ul className="space-y-2.5 text-sm">{["Instagram", "Twitter", "LinkedIn"].map((label) => <li key={label}><a href="#top" className="group inline-flex items-center gap-1.5 transition-colors hover:text-flux-pink">{label}<ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" /></a></li>)}</ul>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Support</p>
                  <ul className="space-y-2.5 text-sm text-muted-foreground"><li>Help Center</li><li>Contact Us</li><li>Privacy Policy</li></ul>
                </div>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-foreground/10 pt-7 text-sm sm:flex sm:justify-between">
              <span className="flex min-w-0 items-center gap-2.5"><BrandMark /><span className="truncate font-display text-lg font-semibold">Samriddhi</span></span>
              <div className="hidden gap-5 text-muted-foreground sm:flex"><a href="#features" className="hover:text-foreground">Features</a><a href="#capabilities" className="hover:text-foreground">Capabilities</a><a href="mailto:hello@samriddhi.app" className="hover:text-foreground">Email</a></div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground sm:text-sm">© 2026</span>
                <a href="#top" aria-label="Back to top" className="grid size-10 shrink-0 place-items-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground hover:text-background"><ArrowUp className="size-4" /></a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
