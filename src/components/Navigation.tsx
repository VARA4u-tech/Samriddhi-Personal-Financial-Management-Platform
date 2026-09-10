import { motion, AnimatePresence, useScroll, useMotionValue, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function BrandMark() {
  return <img src="/logo.png" alt="Samriddhi Logo" className="size-8 object-contain shrink-0" />;
}

export function MagneticLink({ children, className, ...props }: HTMLMotionProps<"a">) {
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
      whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}

const menuLinks = [
  ["Features", "#features"],
  ["Capabilities", "#capabilities"],
  ["Platform", "#platform"],
  ["Contact", "#contact"],
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 100);
    });
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsAtBottom(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );
    const footer = document.getElementById("contact");
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Stagger variants for the huge menu text
  const menuVars = {
    initial: { clipPath: "circle(0% at top right)" },
    animate: {
      clipPath: "circle(150% at top right)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
    },
    exit: {
      clipPath: "circle(0% at top right)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.4 },
    },
  };

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } },
  };

  const linkVars = {
    initial: { y: "30vh", rotate: 5, opacity: 0, transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as [number, number, number, number] } },
    open: { y: 0, rotate: 0, opacity: 1, transition: { ease: [0, 0.55, 0.45, 1] as [number, number, number, number], duration: 0.7 } },
  };

  return (
    <>
      {/* Dynamic Island Navbar */}
      <header className="fixed bottom-6 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center">
        <motion.nav 
          layout
          animate={{ y: isAtBottom ? 100 : 0, opacity: isAtBottom ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 p-2 pl-3 backdrop-blur-xl transition-shadow hover:shadow-xl"
          style={{ borderRadius: 9999 }}
        >
          {/* Brand */}
          <motion.a layout href="#top" className="flex items-center gap-2 pr-2">
            <BrandMark />
            <AnimatePresence mode="wait">
              {(!isScrolled || isHovered) && (
                <motion.span
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-display text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden"
                >
                  Samriddhi
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>

          {/* Action buttons */}
          <motion.div layout className="flex items-center gap-2 ml-4">
             <AnimatePresence mode="wait">
              {(!isScrolled || isHovered) && (
                <motion.div
                  layout
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: "auto", scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden hidden sm:block"
                >
                  <MagneticLink href="#contact" className="whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-flux-orange block">
                    Get Started
                  </MagneticLink>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              type="button" 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Menu className="size-4" />
            </button>
          </motion.div>
        </motion.nav>
      </header>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[150] bg-foreground text-background flex flex-col p-6 sm:p-10 overflow-hidden"
          >
            {/* Background noise/texture for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

            <div className="flex w-full justify-between items-center mb-10 relative z-10">
               <div className="flex items-center gap-2">
                 <BrandMark />
                 <span className="font-display text-lg font-bold tracking-tight">Samriddhi</span>
               </div>
               <button onClick={() => setMenuOpen(false)} className="text-background/50 hover:text-background transition-colors p-4 group">
                  <X className="size-8 transition-transform group-hover:rotate-90" />
               </button>
            </div>

            <motion.div variants={containerVars} initial="initial" animate="open" exit="initial" className="flex flex-col h-full justify-center gap-2 sm:gap-4 relative z-10">
              {menuLinks.map(([label, href], i) => (
                <div key={i} className="overflow-hidden py-2">
                  <motion.div variants={linkVars}>
                    <a 
                      href={href} 
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center text-[clamp(4rem,10vw,10rem)] font-display font-medium leading-[0.85] tracking-tight hover:text-flux-orange transition-colors"
                    >
                      {label}
                      <ArrowUpRight className="ml-4 size-[0.6em] opacity-0 -translate-x-10 translate-y-10 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out" />
                    </a>
                  </motion.div>
                </div>
              ))}
            </motion.div>
            
            <div className="mt-auto flex flex-wrap justify-between text-sm uppercase tracking-[0.2em] opacity-50 relative z-10">
              <p>Personal Financial Management</p>
              <p>Est. 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
