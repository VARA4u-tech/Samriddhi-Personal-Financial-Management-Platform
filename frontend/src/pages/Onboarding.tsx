import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { store } from "@/lib/store";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    // Slight artificial delay for UX feel
    setTimeout(() => {
      store.updateProfile({ 
        display_name: name.trim(),
        is_onboarded: true 
      });
      navigate("/dashboard");
    }, 600);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Top Navbar with Brand */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="relative size-12 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Samriddhi" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Samriddhi
            </span>
          </div>
        </nav>

        {/* Ambient background glow & grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-foreground) 1px,transparent 1px),linear-gradient(90deg,var(--color-foreground) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-flux-orange/10 blur-[150px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flux-violet/10 blur-[150px] pointer-events-none mix-blend-screen" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center size-16 rounded-full bg-white/5 border border-white/10 mb-6 text-3xl"
              >
                👋
              </motion.div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Welcome!
              </h1>
              <p className="text-white/60 text-lg">
                Let's personalize your expense tracker.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  What should we call you?
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-flux-orange/50 focus:border-flux-orange/50 transition-all"
                  autoFocus
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!name.trim() || isSubmitting}
                type="submit"
                className="w-full relative group overflow-hidden rounded-2xl bg-white text-black font-semibold text-lg py-4 px-6 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-flux-orange via-flux-pink to-flux-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCw size={20} />
                      </motion.div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      Continue to My Dashboard <ArrowRight size={20} />
                    </>
                  )}
                </span>
              </motion.button>
              
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-medium pt-2 text-center">
                <Check size={16} className="text-flux-lime shrink-0" />
                No account required. Your expense data stays in your browser.
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
