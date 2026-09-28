import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center selection:bg-flux-orange/30">
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column: Info */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-tr from-flux-orange/20 to-flux-pink/20 border border-white/10 mb-6">
                <MessageSquare className="text-flux-orange" size={28} />
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
                Get in touch
              </h1>
              <p className="text-white/50 leading-relaxed max-w-md text-sm md:text-base">
                Have questions about our open-source project? Found a bug, or want to suggest a new feature? 
                We'd love to hear from you. Fill out the form and our community team will get back to you.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-white/70">
                <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Mail size={18} className="text-white/50" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email Us</p>
                  <p className="text-sm text-white/50">support@samriddhi.dev</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-flux-orange/5 via-transparent to-flux-pink/5 pointer-events-none" />
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 relative z-10"
              >
                <div className="size-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2 border border-green-500/30">
                  <Send size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Thank you for reaching out. Our team will review your message and get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/15 text-white rounded-full transition-colors text-sm font-medium"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white/70">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-flux-orange/50 focus:ring-1 focus:ring-flux-orange/50 transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/70">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-flux-orange/50 focus:ring-1 focus:ring-flux-orange/50 transition-all text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-white/70">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-flux-orange/50 focus:ring-1 focus:ring-flux-orange/50 transition-all text-sm resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-flux-orange to-flux-pink hover:opacity-90 text-white rounded-xl px-4 py-3.5 font-medium transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
