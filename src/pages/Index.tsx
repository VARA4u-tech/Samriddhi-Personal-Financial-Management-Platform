import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Navigation, BrandMark, MagneticLink } from "@/components/Navigation";

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
      <Navigation />

      <main id="top">
        <section className="relative px-5 pb-10 pt-20 sm:px-8 sm:pt-32 overflow-hidden bg-background">
          <motion.div style={{ y: heroY }} className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left side text content */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
              <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-flux-orange">
                <span className="size-1.5 rounded-full bg-flux-orange" />
                Personal Financial Management · Est. 2026
              </p>
              
              <h1 className="max-w-4xl font-display text-[clamp(3.1rem,8vw,7rem)] font-medium leading-[0.85] tracking-[-0.06em] text-balance">
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="block">Take control</motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="block">of your <span className="text-flux-orange">finances</span>,</motion.span>
                <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="block"><em className="font-normal text-flux-pink">build wealth.</em></motion.span>
              </h1>

              <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-7">
                <a href="#features" className="group flex items-center gap-3 text-sm font-semibold">
                  <span className="grid size-11 place-items-center rounded-full border border-foreground/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowDown className="size-4" />
                  </span>
                  Explore features
                </a>
                <p className="max-w-sm text-lg leading-relaxed text-muted-foreground sm:border-l sm:border-foreground/20 sm:pl-7">
                  Track transactions, manage budgets, and achieve savings goals with powerful analytics.
                </p>
              </div>
            </div>

            {/* Right side Geometric Abstract Graphic */}
            <div className="lg:col-span-6 xl:col-span-5 h-[400px] sm:h-[500px] lg:h-[600px] relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flux-grid-bg relative overflow-hidden rounded-[2rem] border border-foreground/10"
              >
                {/* Large outlined circle */}
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                   className="absolute -right-[20%] -top-[10%] size-[80%] rounded-full border-[clamp(20px,5vw,60px)] border-foreground/10" 
                />
                
                {/* Pink filled circle */}
                <motion.div 
                   animate={{ y: [0, -20, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-[20%] left-[15%] size-[25%] rounded-full bg-flux-pink" 
                />

                {/* Orange pill */}
                <motion.div 
                   animate={{ x: [0, 20, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-[25%] left-[20%] h-[15%] w-[40%] rounded-full bg-flux-orange" 
                />

                {/* Lime square/rounded box */}
                <motion.div 
                   animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-[10%] right-[15%] size-[30%] rounded-[1.5rem] bg-flux-lime" 
                />

                {/* Violet thin outlined circle */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="size-[60%] rounded-full border border-flux-violet/40 backdrop-blur-sm"
                  />
                </div>

                {/* Floating "Card" overlay */}
                <motion.div
                  data-tilt
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flux-tilt absolute top-[40%] left-[30%] w-[50%] bg-background/80 backdrop-blur-md rounded-2xl border border-foreground/10 p-5 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="h-2 w-12 rounded bg-foreground/20" />
                      <div className="h-3 w-20 rounded bg-foreground/80" />
                    </div>
                    <div className="size-8 rounded-full border border-foreground/10 bg-card grid place-items-center">
                       <ArrowUpRight className="size-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-12">
                     <div className="flex-1 rounded-sm bg-flux-violet/20 h-[40%]" />
                     <div className="flex-1 rounded-sm bg-flux-violet/40 h-[70%]" />
                     <div className="flex-1 rounded-sm bg-flux-violet/60 h-[50%]" />
                     <div className="flex-1 rounded-sm bg-flux-violet/80 h-[100%]" />
                     <div className="flex-1 rounded-sm bg-flux-violet h-[85%]" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-24 sm:px-6" aria-label="Platform capabilities">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 rounded-[1.5rem] border border-foreground/10 bg-card p-2 sm:grid-cols-4 sm:gap-3 sm:p-3">
            <div className="relative col-span-2 row-span-2 min-h-[390px] overflow-hidden rounded-[1rem] bg-flux-orange p-5 text-primary-foreground sm:min-h-[480px]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,var(--color-flux-sand)_0_7%,transparent_7.5%),linear-gradient(140deg,transparent_0_58%,var(--color-flux-violet)_58%_72%,transparent_72%)] opacity-70" /><div className="relative flex h-full flex-col justify-between"><span className="font-display text-5xl font-semibold leading-none sm:text-7xl">Grow<br />your<br /><em className="font-normal">wealth.</em></span><span className="text-xs uppercase tracking-[0.2em]">Complete financial platform</span></div></div>
            {[['Secure', 'Authentication', 'bg-flux-pink text-primary-foreground'], ['Automated', 'Recurring Expenses', 'bg-flux-lime text-primary-foreground'], ['Categorized', 'Smart labeling', 'bg-flux-violet text-primary-foreground'], ['Analytics', 'Financial Reports', 'bg-flux-green text-primary-foreground']].map(([title, caption, classes], index) => <div key={title} className={`flux-float flex min-h-[190px] flex-col justify-between rounded-[1rem] p-5 ${classes}`} style={{ animationDelay: `${index * -1.2}s` }}><span className="font-display text-3xl font-semibold leading-none">{title}</span><span className="text-xs uppercase tracking-[0.16em] opacity-75">{caption}</span></div>)}
          </div>
        </section>

        <section aria-label="Platform specialties" className="relative z-20 my-16 overflow-hidden border-y border-foreground/10 py-4 -rotate-2 scale-[1.05]">
          <div className="flux-marquee flex w-max items-center gap-8 whitespace-nowrap font-display text-2xl font-medium uppercase tracking-[-0.03em] text-muted-foreground sm:text-3xl">
            {Array.from({ length: 3 }).map((_, index) => <span key={index} className="flex items-center gap-8">Track Transactions <span className="text-flux-orange">✳</span> Set Budgets <span className="text-flux-pink">✳</span> Achieve Goals <span className="text-flux-lime">✳</span> Gain Insights <span className="text-flux-violet">✳</span></span>)}
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

        <footer id="contact" className="p-2 pt-0 sm:p-3" data-gsap-reveal>
          <div className="w-full h-full">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-12 sm:gap-3">
              
              {/* Main CTA — big orange block */}
              <div className="relative col-span-2 sm:col-span-7 min-h-[280px] overflow-hidden rounded-[1rem] bg-flux-orange p-8 text-primary-foreground sm:min-h-[360px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,var(--color-flux-sand)_0_8%,transparent_8.5%),linear-gradient(140deg,transparent_0_55%,var(--color-flux-violet)_55%_70%,transparent_70%)] opacity-70" />
                <div className="relative flex h-full flex-col justify-between">
                  <p className="font-display flex items-center gap-3 text-xs uppercase tracking-[0.22em]"><span className="size-1.5 rounded-full bg-primary-foreground/60" />Ready to take control?</p>
                  <div>
                    <a href="mailto:hello@samriddhi.app" className="group block font-display text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.05em] hover:opacity-80 transition-opacity">
                      Start your<br /><em className="font-normal">journey</em><ArrowUpRight className="ml-2 inline size-[0.5em] -translate-y-1 align-top transition-transform group-hover:translate-x-2 group-hover:-translate-y-3" />
                    </a>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <MagneticLink href="mailto:hello@samriddhi.app" className="font-display rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-semibold text-flux-orange transition-opacity hover:opacity-80">Get Started</MagneticLink>
                      <MagneticLink href="mailto:hello@samriddhi.app" className="font-display rounded-full border border-primary-foreground/40 px-7 py-3.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10">hello@samriddhi.app</MagneticLink>
                    </div>
                  </div>
                  <span className="font-display text-xs uppercase tracking-[0.2em] opacity-70">Personal Financial Management</span>
                </div>
              </div>

              {/* Sitemap — pink block */}
              <div className="flux-float col-span-1 sm:col-span-2 min-h-[160px] flex flex-col justify-between rounded-[1rem] bg-flux-pink p-6 text-primary-foreground sm:min-h-[200px]" style={{ animationDelay: '-0.5s' }}>
                <span className="font-display text-3xl font-semibold leading-none">Site</span>
                <div>
                  <p className="font-display mb-3 text-xs uppercase tracking-[0.2em] opacity-60">Sitemap</p>
                  <ul className="space-y-2 font-display text-sm font-medium">{[["Features", "#features"], ["Capabilities", "#capabilities"], ["Platform", "#platform"], ["Top", "#top"]].map(([label, href]) => <li key={label}><a href={href} className="hover:underline underline-offset-2">{label}</a></li>)}</ul>
                </div>
              </div>

              {/* Socials — lime block */}
              <div className="flux-float col-span-1 sm:col-span-3 min-h-[160px] flex flex-col justify-between rounded-[1rem] bg-flux-lime p-6 text-primary-foreground sm:min-h-[200px]" style={{ animationDelay: '-1.5s' }}>
                <span className="font-display text-3xl font-semibold leading-none">Social</span>
                <div>
                  <p className="font-display mb-3 text-xs uppercase tracking-[0.2em] opacity-60">Socials</p>
                  <ul className="space-y-2 font-display text-sm font-medium">{["Instagram", "Twitter", "LinkedIn"].map((label) => <li key={label}><a href="#top" className="group inline-flex items-center gap-1.5 hover:underline underline-offset-2">{label}<ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" /></a></li>)}</ul>
                </div>
              </div>

              {/* Support — violet block */}
              <div className="flux-float col-span-1 sm:col-span-5 min-h-[160px] flex flex-col justify-between rounded-[1rem] bg-flux-violet p-6 text-primary-foreground sm:min-h-[200px]" style={{ animationDelay: '-2.5s' }}>
                <span className="font-display text-3xl font-semibold leading-none">Help</span>
                <div>
                  <p className="font-display mb-3 text-xs uppercase tracking-[0.2em] opacity-60">Support</p>
                  <div className="flex flex-col gap-2 font-display text-sm font-semibold opacity-90"><a href="#" className="hover:underline">Help Center</a><a href="#" className="hover:underline">Contact Us</a><a href="#" className="hover:underline">Privacy Policy</a></div>
                </div>
              </div>

              {/* Bottom bar — green block spanning full width */}
              <div className="col-span-2 sm:col-span-12 rounded-[1rem] bg-flux-green p-6 text-primary-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <span className="flex items-center gap-3"><BrandMark src="/logo-footer.png" /><span className="font-display text-xl font-semibold tracking-tight">Samriddhi</span></span>
                <div className="flex gap-8 font-display text-sm font-semibold opacity-80"><a href="#features" className="hover:opacity-100 hover:underline underline-offset-2">Features</a><a href="#capabilities" className="hover:opacity-100 hover:underline underline-offset-2">Capabilities</a><a href="mailto:hello@samriddhi.app" className="hover:opacity-100 hover:underline underline-offset-2">Email</a></div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-sm font-medium opacity-70">© 2026</span>
                  <a href="#top" aria-label="Back to top" className="grid size-11 place-items-center rounded-full bg-primary-foreground/20 border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/40"><ArrowUp className="size-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
