import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Check } from "lucide-react";
import { store } from "@/lib/store";
import { useFinanceData } from "@/hooks/useFinanceData";

const TOUR_STEPS = [
  {
    targetId: null,
    title: "Welcome to Samriddhi!",
    content: "Welcome to your personal financial workspace! Let's take a quick tour so you know exactly where everything lives.",
    align: "center" as const,
  },
  {
    targetId: "tour-dashboard",
    title: "Dashboard",
    content: "This is your financial overview. You'll get a quick snapshot of your income, expenses, balance, and recent activity here.",
    align: "right" as const,
  },
  {
    targetId: "tour-transactions",
    title: "Transactions",
    content: "Transactions is where you manage every income and expense. Add, review, filter, and organize your financial activity here.",
    align: "right" as const,
  },
  {
    targetId: "tour-savings",
    title: "Savings",
    content: "Savings helps you set financial goals and track your progress toward them.",
    align: "right" as const,
  },
  {
    targetId: "tour-budgets",
    title: "Budgets",
    content: "Budgets help you control your spending by setting limits for different categories.",
    align: "right" as const,
  },
  {
    targetId: "tour-profile",
    title: "Your Profile",
    content: "Update your name, change your avatar, manage local data, and export your personal backups here.",
    align: "right" as const,
  },
  {
    targetId: null,
    title: "You're all set!",
    content: "Start by adding your first transaction and watch your financial dashboard come to life.",
    align: "center" as const,
  }
];

export const OnboardingTour = () => {
  const { profile } = useFinanceData();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const isActive = profile.is_onboarded && profile.tour_completed !== true;

  const updateTargetRect = () => {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    return () => window.removeEventListener("resize", updateTargetRect);
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleComplete = () => {
    store.updateProfile({ tour_completed: true });
  };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-auto">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-500" 
        style={{ opacity: targetRect ? 0 : 1 }}
      />

      {/* Spotlight Cutout */}
      {targetRect && (
        <motion.div
          layout
          className="absolute rounded-2xl bg-transparent ring-[10000px] ring-black/0 pointer-events-none"
          initial={false}
          animate={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: "0 0 0 10000px rgba(0,0,0,0.6)",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="absolute z-[210]"
          style={
            targetRect && step.align === "right"
              ? {
                  top: Math.max(20, targetRect.top),
                  left: targetRect.right + 24, // Place to the right of the nav items
                }
              : {
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                }
          }
        >
          <div className="w-[320px] lg:w-[360px] bg-[#1a1118] border border-flux-orange/20 rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(255,123,0,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-flux-orange/5 to-transparent pointer-events-none" />
            
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 size-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="mb-2">
              <span className="text-[10px] font-bold tracking-widest text-flux-orange uppercase">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            
            <h3 className="text-xl font-display font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-8">{step.content}</p>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleComplete}
                className="text-xs font-medium text-white/40 hover:text-white transition-colors"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-flux-orange to-flux-pink text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isLast ? (
                  <>Start Tracking <Check size={16} /></>
                ) : (
                  <>Next <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
