import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
} from 'lucide-react';
import { useProfile } from '@/hooks/useFinanceData';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/dashboard/budgets', icon: PieChart, label: 'Budgets' },
  { to: '/dashboard/categories', icon: Tag, label: 'Categories' },
  { to: '/dashboard/recurring', icon: RefreshCw, label: 'Recurring' },
  { to: '/dashboard/savings', icon: Target, label: 'Savings Goals' },
  { to: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const profile = useProfile();

  const displayName = profile.display_name || 'User';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const pageTitle =
    title ?? navItems.find((n) => n.to === location.pathname)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-foreground) 1px,transparent 1px),linear-gradient(90deg,var(--color-foreground) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-black/60 backdrop-blur-2xl border-r border-white/[0.07] transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/[0.07]">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="size-8 rounded-full bg-gradient-to-tr from-flux-orange to-flux-pink shadow-[0_0_20px_rgba(255,123,0,0.4)] flex-shrink-0" />
            <span className="font-display text-lg font-bold tracking-tight">Samriddhi</span>
          </Link>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                  active
                    ? 'bg-flux-orange/15 text-flux-orange'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-flux-orange/10 border border-flux-orange/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon size={18} className="relative z-10 flex-shrink-0" />
                <span className="relative z-10 font-medium text-sm">{label}</span>
                {active && (
                  <ChevronRight size={14} className="relative z-10 ml-auto opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="size-8 rounded-full bg-gradient-to-tr from-flux-orange to-flux-pink flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-white/40 truncate">{profile.currency} · {profile.monthly_income.toLocaleString('en-IN')}/mo</p>
            </div>
          </div>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-sm"
          >
            <Settings size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-5 lg:px-8 border-b border-white/[0.07] bg-black/20 backdrop-blur-xl z-10 relative">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-white/60 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1 className="font-display text-xl font-semibold tracking-tight">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative size-9 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-flux-orange animate-pulse" />
            </button>
            <div className="size-9 rounded-full bg-gradient-to-tr from-flux-orange to-flux-pink flex items-center justify-center text-xs font-bold text-black">
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
