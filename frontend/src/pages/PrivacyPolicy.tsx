import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center selection:bg-flux-orange/30">
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
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-flux-orange/10 blur-[150px] pointer-events-none mix-blend-screen" />
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
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-flux-orange/20 to-flux-pink/20 flex items-center justify-center border border-white/10">
              <Shield className="text-flux-orange" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Privacy Policy
              </h1>
              <p className="text-white/40 mt-2 text-sm md:text-base">
                Last updated: October 2026
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-orange max-w-none text-white/70 space-y-6">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">1. Introduction</h2>
              <p className="leading-relaxed">
                At Samriddhi, your privacy is our absolute priority. We built this application with a 
                <strong> 100% local, client-side architecture</strong>. This means your financial data 
                is stored entirely on your device, and we do not have access to it.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">2. Data We Do NOT Collect</h2>
              <p className="leading-relaxed mb-2">Because Samriddhi operates locally in your browser's Local Storage, we do not collect, transmit, or store:</p>
              <ul className="list-disc pl-5 space-y-2 text-white/60">
                <li>Your financial transactions, budgets, or savings goals.</li>
                <li>Your personal identity, bank account details, or passwords.</li>
                <li>Analytics data regarding your financial habits.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">3. How Your Data is Stored</h2>
              <p className="leading-relaxed">
                All data generated while using Samriddhi is saved in your web browser's Local Storage. 
                If you clear your browser data or uninstall your browser, your financial data will be permanently deleted 
                unless you have manually exported a backup. You have total control over your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">4. Third-Party Services</h2>
              <p className="leading-relaxed">
                Samriddhi is hosted on Vercel. While we do not track you, our hosting provider may collect standard 
                web server logs (such as IP addresses and browser types) for security and performance monitoring. 
                Future features (like AI insights) will clearly state if they require transmitting data to an external API 
                and will require your explicit opt-in consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">5. Changes to this Policy</h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. Since we do not collect your email address, 
                we will notify you of any changes by posting the new Privacy Policy on this page and updating 
                the "Last updated" date.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
