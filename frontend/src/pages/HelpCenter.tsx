import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LifeBuoy, Search, Book, HelpCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "Is my financial data secure?",
    a: "Absolutely. Samriddhi uses a 100% local architecture. All your data is saved directly in your browser's Local Storage. We do not have access to your data, and it is never sent to any remote servers.",
  },
  {
    q: "How can I backup my data?",
    a: "Currently, your data is stored locally. We are working on a feature that will allow you to export your data as a JSON or CSV file to keep safe backups on your own devices.",
  },
  {
    q: "What happens if I clear my browser cache?",
    a: "Because Samriddhi stores data in your browser's Local Storage, clearing your site data or cache will permanently delete your financial records. Please do not clear your site data for this application.",
  },
  {
    q: "Can I use Samriddhi on multiple devices?",
    a: "Not at the moment. Since it is a local-storage based application, your data is tied to the specific browser and device you are currently using.",
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center selection:bg-flux-pink/30">
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
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center size-20 rounded-3xl bg-gradient-to-tr from-flux-pink/20 to-flux-orange/20 border border-white/10 mb-2">
              <LifeBuoy className="text-flux-pink" size={40} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              How can we help?
            </h1>
            <p className="text-white/40 max-w-lg mx-auto">
              Search our knowledge base or browse categories below to find answers to your questions.
            </p>
          </div>

          {/* Search bar mock */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, tutorials, or FAQs..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-flux-pink/50 focus:ring-1 focus:ring-flux-pink/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <Book className="text-flux-orange mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
              <p className="text-sm text-white/50 leading-relaxed">Learn the basics of setting up your profile and adding your first transactions.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <Settings className="text-flux-violet mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Account & Settings</h3>
              <p className="text-sm text-white/50 leading-relaxed">Manage your local profile, customize currencies, and control your app preferences.</p>
            </div>
            <Link to="/contact-us" className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <HelpCircle className="text-flux-pink mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
              <p className="text-sm text-white/50 leading-relaxed">Can't find what you're looking for? Reach out to our open-source team directly.</p>
            </Link>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                  <h4 className="text-lg font-medium text-white mb-2">{faq.q}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
