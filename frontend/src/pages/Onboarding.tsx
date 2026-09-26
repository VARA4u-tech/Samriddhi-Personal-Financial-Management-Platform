import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { store } from "@/lib/store";
import { AVATAR_OPTIONS } from "@/lib/avatars";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [step, setStep] = useState<"name" | "avatar">("name");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("avatar");
  };

  const handleAvatarSubmit = () => {
    if (!selectedAvatar) return;
    setIsSubmitting(true);

    setTimeout(() => {
      store.updateProfile({
        display_name: name.trim(),
        avatar: selectedAvatar,
        is_onboarded: true,
      });
      navigate("/dashboard");
    }, 600);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Top Navbar with Brand */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="relative size-12 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Samriddhi" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Samriddhi
            </span>
          </div>
        </nav>

        {/* Content (Bento Box Grid) */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-7xl"
          >
            <div className="mx-auto grid grid-cols-2 gap-2 rounded-[1.5rem] border border-foreground/10 bg-card p-2 sm:grid-cols-4 sm:gap-3 sm:p-3">
              {/* Main Orange Card (Form) */}
              <div className="relative col-span-2 row-span-2 min-h-[400px] overflow-hidden rounded-[1rem] bg-flux-orange p-6 sm:p-10 text-primary-foreground sm:min-h-[480px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,var(--color-flux-sand)_0_7%,transparent_7.5%),linear-gradient(140deg,transparent_0_58%,var(--color-flux-violet)_58%_72%,transparent_72%)] opacity-70" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="inline-flex items-center justify-center size-16 rounded-full bg-black/10 border border-black/5 mb-6 text-3xl shadow-inner"
                  >
                    👋
                  </motion.div>
                  <h1 className="font-display text-5xl sm:text-7xl font-semibold leading-none mb-4 text-black">
                    Welcome.
                  </h1>
                  <p className="text-black/70 text-lg max-w-sm">
                    Let's personalize your local-first expense tracker.
                  </p>
                </div>

                <div className="relative z-10 mt-8 max-w-sm w-full">
                  <AnimatePresence mode="wait">
                    {step === "name" && (
                      <motion.form
                        key="name-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleNameSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-bold text-black uppercase tracking-wider ml-1"
                          >
                            What should we call you?
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-black/5 border border-black/10 rounded-xl px-5 py-4 text-black font-medium text-xl placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-black/20 focus:bg-black/10 transition-all"
                            autoFocus
                            required
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!name.trim()}
                          type="submit"
                          className="w-full rounded-xl bg-black text-white font-semibold text-lg py-4 px-6 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
                        >
                          Choose Avatar <ArrowRight size={20} />
                        </motion.button>
                      </motion.form>
                    )}

                    {step === "avatar" && (
                      <motion.div
                        key="avatar-form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-black uppercase tracking-wider ml-1">
                            Choose your avatar
                          </label>
                          <div className="grid grid-cols-4 gap-3">
                            {AVATAR_OPTIONS.map((avatar, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white ${
                                  selectedAvatar === avatar
                                    ? "border-black scale-105 shadow-xl"
                                    : "border-transparent hover:border-black/20 hover:scale-105"
                                }`}
                              >
                                <img
                                  src={avatar}
                                  alt={`Avatar ${idx}`}
                                  className="w-full h-full object-cover"
                                />
                                {selectedAvatar === avatar && (
                                  <div className="absolute bottom-1 right-1 bg-black text-white rounded-full p-0.5">
                                    <Check size={12} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!selectedAvatar || isSubmitting}
                          onClick={handleAvatarSubmit}
                          className="w-full rounded-xl bg-black text-white font-semibold text-lg py-4 px-6 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
                        >
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
                              Continue to Dashboard <ArrowRight size={20} />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Card 1: Pill shape — Pink (Secure) */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="flex min-h-[190px] flex-col justify-between rounded-[3rem] p-6 bg-flux-pink overflow-hidden relative"
              >
                <div className="absolute top-[-20%] right-[-10%] w-28 h-28 rounded-full bg-white/10 blur-sm" />
                <span className="font-display text-2xl sm:text-3xl font-semibold leading-none text-black">
                  Secure
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] opacity-60 text-black font-medium">
                    Authentication
                  </span>
                  <div className="size-9 rounded-full bg-black/10 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Wide squircle — Lime (Automated) */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex min-h-[190px] flex-col justify-between rounded-[2rem] p-6 bg-flux-lime overflow-hidden relative"
              >
                <div className="absolute bottom-[-15%] left-[-5%] w-32 h-20 rounded-full bg-black/5 blur-md" />
                <div className="flex items-end gap-1 h-12 mt-2">
                  {[40, 70, 55, 90, 65, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-black/20"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div>
                  <span className="font-display text-2xl sm:text-3xl font-semibold leading-none text-black">
                    Automated
                  </span>
                  <p className="text-xs uppercase tracking-[0.16em] opacity-60 text-black font-medium mt-1">
                    Recurring Expenses
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Circle / blob shape — Violet (Categorized) */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex min-h-[190px] flex-col justify-between rounded-[2.5rem_1rem_2.5rem_1rem] p-6 bg-flux-violet overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_60%)]" />
                <div className="size-10 rounded-full bg-black/15 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                  </svg>
                </div>
                <div>
                  <span className="font-display text-2xl sm:text-3xl font-semibold leading-none text-black">
                    Categorized
                  </span>
                  <p className="text-xs uppercase tracking-[0.16em] opacity-60 text-black font-medium mt-1">
                    Smart Labeling
                  </p>
                </div>
              </motion.div>

              {/* Card 4: Tall rounded card — Green (Analytics) */}
              <motion.div
                animate={{ y: [0, 16, 0], rotate: [0, -1.5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="flex min-h-[190px] flex-col justify-between rounded-[1.5rem_3rem_1.5rem_3rem] p-6 bg-flux-green overflow-hidden relative"
              >
                <div className="absolute top-[15%] right-[10%] size-14 rounded-full bg-white/20" />
                <div className="absolute bottom-[20%] left-[5%] w-20 h-4 rounded-full bg-black/10" />
                <span className="font-display text-2xl sm:text-3xl font-semibold leading-none text-black">
                  Analytics
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] opacity-60 text-black font-medium">
                    Financial Reports
                  </span>
                  <div className="size-9 rounded-full bg-black/10 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-medium mt-6 text-center">
              <Check size={16} className="text-flux-lime shrink-0" />
              No account required. All data stays securely on your device.
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
