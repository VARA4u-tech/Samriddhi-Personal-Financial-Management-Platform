import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Tag,
  RefreshCw,
  Target,
  BarChart3,
  Menu,
  X,
  Bell,
  ChevronRight,
  Search,
} from "lucide-react";
import { useProfile } from "@/hooks/useFinanceData";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/dashboard/budgets", icon: PieChart, label: "Budgets" },
  { to: "/dashboard/categories", icon: Tag, label: "Categories" },
  { to: "/dashboard/recurring", icon: RefreshCw, label: "Recurring" },
  { to: "/dashboard/savings", icon: Target, label: "Savings Goals" },
  { to: "/dashboard/reports", icon: BarChart3, label: "Reports" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const profile = useProfile();

  const displayName = profile.display_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pageTitle = title ?? navItems.find((n) => n.to === location.pathname)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative selection:bg-flux-orange/30">
      {/* Ambient background glow & grid */}
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
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-flux-violet/10 blur-[150px] pointer-events-none mix-blend-screen" />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-400 ease-out lg:translate-x-0 lg:static lg:p-5 lg:w-[320px] lg:bg-transparent lg:border-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Inner (Floating Dock on Desktop) */}
        <div className="flex flex-col h-full bg-[#050505] border-r border-white/[0.04] lg:bg-[#111111]/70 lg:backdrop-blur-3xl lg:border lg:border-white/[0.08] lg:rounded-[2rem] overflow-hidden lg:shadow-2xl relative">
          
          {/* Logo */}
          <div className="flex items-center justify-between px-6 pt-8 pb-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative size-10 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-flux-orange to-flux-pink shadow-[0_0_30px_rgba(255,123,0,0.3)]">
                <span className="text-black font-display font-bold text-xl leading-none -ml-0.5">S</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Samriddhi</span>
            </Link>
            <button
              className="lg:hidden size-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-6 pb-2">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.2em] ml-1">Menu</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto scrollbar-hide">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 relative ${
                    active
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl bg-white/[0.06] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-flux-orange to-flux-pink shadow-[0_0_10px_rgba(255,123,0,0.5)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon size={18} className={`relative z-10 flex-shrink-0 transition-colors duration-300 ${active ? "text-flux-orange" : "group-hover:text-white/70"}`} />
                  <span className="relative z-10 font-medium text-[15px]">{label}</span>
                  {active && <ChevronRight size={14} className="relative z-10 ml-auto opacity-50 text-flux-pink" />}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 mt-auto">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3 flex items-center gap-3 hover:bg-white/[0.05] transition-colors cursor-pointer group">
              <div className="size-10 rounded-xl bg-gradient-to-tr from-flux-violet to-flux-pink flex items-center justify-center text-sm font-bold text-white shadow-inner flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate group-hover:text-white text-white/90 transition-colors">{displayName}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">
                  {profile.currency} · {profile.monthly_income.toLocaleString("en-IN")}/mo
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative z-10">
        {/* Top header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-5 lg:px-10 z-10 relative">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden size-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/60 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="hidden sm:block font-display text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Command Search Mockup */}
            <button className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/40 hover:bg-white/[0.08] hover:text-white transition-all group backdrop-blur-md">
              <Search size={16} className="group-hover:text-flux-orange transition-colors" />
              <span className="text-[13px] font-medium hidden sm:block">Search anything...</span>
              <div className="hidden lg:flex items-center gap-0.5 ml-6 text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-md shadow-inner border border-white/5">
                <span>⌘</span><span>K</span>
              </div>
            </button>

            <button className="relative size-10 lg:size-11 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all backdrop-blur-md">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-flux-orange animate-pulse shadow-[0_0_8px_rgba(255,123,0,0.8)]" />
            </button>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
          <div className="lg:pr-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
