import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center selection:bg-flux-violet/30">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-foreground) 1px,transparent 1px),linear-gradient(90deg,var(--color-foreground) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flux-violet/10 blur-[150px] pointer-events-none mix-blend-screen" />
      </div>

      <div className="w-full max-w-4xl px-6 py-12 lg:py-20 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 border-b border-white/10 pb-8">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-flux-violet/20 to-flux-pink/20 flex items-center justify-center border border-white/10">
              <FileText className="text-flux-violet" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Terms and Conditions
              </h1>
              <p className="text-white/40 mt-2 text-sm md:text-base">
                Last updated: October 2026
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-white/70 space-y-6">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using Samriddhi, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">2. Service Description</h2>
              <p className="leading-relaxed">
                Samriddhi is a free, open-source personal financial management platform. It provides tools for 
                tracking income, expenses, budgets, and savings goals. The service is provided "as is" and 
                we make no guarantees regarding its continuous availability or feature set.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">3. Data Responsibility</h2>
              <p className="leading-relaxed">
                Because Samriddhi operates locally in your browser, <strong>you are entirely responsible for your data</strong>. 
                We cannot recover lost data due to cleared browser caches, device loss, or browser uninstallation. 
                We strongly recommend manually exporting and backing up your financial data periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">4. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                The application and its content are provided on an "as is" basis. Samriddhi makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">5. Limitations of Liability</h2>
              <p className="leading-relaxed">
                In no event shall Samriddhi or its contributors be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or 
                inability to use the materials on the Samriddhi platform.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
