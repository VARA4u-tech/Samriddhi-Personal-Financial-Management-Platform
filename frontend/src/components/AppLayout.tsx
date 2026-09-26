import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Tag,
  RefreshCw,
  Target,
  BarChart3,
  X,
  Bell,
  ChevronRight,
  Search,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useProfile, useFinanceData } from "@/hooks/useFinanceData";
import { store } from "@/lib/store";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBell } from "./NotificationBell";
import { OnboardingTour } from "./OnboardingTour";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/dashboard/budgets", icon: PieChart, label: "Budgets" },
  { to: "/dashboard/categories", icon: Tag, label: "Categories" },
  { to: "/dashboard/recurring", icon: RefreshCw, label: "Recurring" },
  { to: "/dashboard/savings", icon: Target, label: "Savings Goals" },
  { to: "/dashboard/reports", icon: BarChart3, label: "Reports" },
];

const bottomNavLabels = ["Transactions", "Budgets", "Dashboard", "Reports"];
const bottomNavItems = bottomNavLabels.map((label) => navItems.find((n) => n.label === label)!);

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useFinanceData().profile;
  const [searchOpen, setSearchOpen] = useState(false);

  const displayName = profile.display_name || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pageTitle = title ?? navItems.find((n) => n.to === location.pathname)?.label ?? "Dashboard";

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      store.resetAll();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative selection:bg-flux-orange/30">
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      <OnboardingTour />
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

      {/* Desktop segmented sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col lg:static lg:flex lg:w-[320px] lg:bg-transparent lg:p-6 lg:border-none">
        <div className="relative h-full flex flex-col lg:gap-4 z-10">
          {/* Logo Island */}
          <div className="flex items-center justify-between px-6 lg:px-6 pt-8 pb-6 lg:py-6 lg:bg-gradient-to-br lg:from-[#111111]/80 lg:to-[#1a1118]/80 lg:backdrop-blur-3xl lg:border lg:border-flux-orange/20 lg:rounded-[2rem] lg:shadow-[0_10px_40px_rgba(255,123,0,0.05)] shrink-0 relative overflow-hidden group">
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-flux-orange/0 via-flux-orange/5 to-flux-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <Link to="/" className="flex items-center gap-3">
              <div className="relative size-12 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Samriddhi" className="w-full h-full object-contain" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Samriddhi
              </span>
            </Link>
            <button className="lg:hidden size-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0">
              <X size={16} />
            </button>
          </div>

          {/* Navigation Island */}
          <nav className="flex-1 flex flex-col px-4 lg:px-4 py-2 lg:py-4 space-y-1.5 overflow-y-auto scrollbar-hide lg:bg-[#111111]/70 lg:backdrop-blur-3xl lg:border lg:border-white/[0.08] lg:rounded-[2rem] lg:shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative group/navcontainer">
            {/* Subtle Grid Texture Background */}
            <div className="absolute inset-0 flux-grid-bg opacity-[0.03] pointer-events-none rounded-[2rem]" />
            {/* Ambient hover glow that follows the mouse (CSS approximation via group hover) */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-flux-violet/10 to-transparent opacity-0 group-hover/navcontainer:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-b-[2rem]" />
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              // Extract the base path name for the tour ID (e.g., /dashboard/transactions -> transactions, /dashboard -> dashboard)
              const tourId = to === "/dashboard" ? "tour-dashboard" : `tour-${to.split("/").pop()}`;
              return (
                <Link
                  key={to}
                  to={to}
                  data-tour={tourId}
                  className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 relative ${
                    active ? "text-white" : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-flux-orange/10 via-flux-pink/5 to-transparent border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
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
                  <Icon
                    size={18}
                    className={`relative z-10 flex-shrink-0 transition-colors duration-300 ${active ? "text-flux-orange" : "group-hover:text-white/70"}`}
                  />
                  <span className="relative z-10 font-medium text-[15px]">{label}</span>
                  {active && (
                    <ChevronRight
                      size={14}
                      className="relative z-10 ml-auto opacity-50 text-flux-pink"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Island */}
          <div className="p-4 lg:p-0 mt-auto hidden lg:block shrink-0 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div data-tour="tour-profile" className="lg:bg-[#111111]/70 lg:backdrop-blur-3xl lg:border lg:border-white/[0.08] hover:lg:border-flux-violet/30 lg:rounded-[2rem] lg:shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3 lg:p-4 flex items-center gap-4 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer group overflow-hidden relative outline-none">
                  <div className="size-11 shrink-0 rounded-xl bg-gradient-to-tr from-flux-violet to-flux-pink flex items-center justify-center text-sm font-bold text-white shadow-inner relative z-10 overflow-hidden">
                    {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover bg-white" /> : initials}
                  </div>
                  <div className="min-w-0 flex-1 relative z-10">
                    <p className="text-sm font-semibold truncate group-hover:text-white text-white/90 transition-colors">
                      {displayName}
                    </p>
                    <p className="text-xs text-white/40 truncate mt-0.5">
                      {profile.currency} · {profile.monthly_income.toLocaleString("en-IN")}/mo
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-flux-violet/0 via-flux-violet/5 to-flux-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#111] border-white/10 text-white rounded-xl"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/profile")}
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Profile Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative z-10">
        {/* Top header */}
        <header className="h-16 lg:h-20 flex-shrink-0 flex items-center justify-between px-5 lg:px-10 z-10 relative">
          <div className="flex items-center gap-4">
            <Link to="/" className="lg:hidden flex items-center justify-center mr-2">
              <div className="relative size-10 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Samriddhi" className="w-full h-full object-contain" />
              </div>
            </Link>
            <h1 className="font-display text-xl lg:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 hidden sm:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            {/* Command Search Mockup */}
            <button onClick={() => setSearchOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/40 hover:bg-white/[0.08] hover:text-white transition-all group backdrop-blur-md">
              <Search size={16} className="group-hover:text-flux-orange transition-colors" />
              <span className="text-[13px] font-medium hidden sm:block">Search anything...</span>
              <div className="hidden lg:flex items-center gap-0.5 ml-6 text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-md shadow-inner border border-white/5">
                <span>⌘</span>
                <span>K</span>
              </div>
            </button>
            <button onClick={() => setSearchOpen(true)} className="sm:hidden size-9 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white transition-colors backdrop-blur-md">
              <Search size={16} />
            </button>

            <NotificationBell />

            {/* Mobile User Profile */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button data-tour="tour-profile" className="size-9 rounded-full bg-gradient-to-tr from-flux-violet to-flux-pink flex items-center justify-center text-xs font-bold text-white shadow-inner flex-shrink-0 outline-none overflow-hidden">
                    {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover bg-white" /> : initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#111] border-white/10 text-white rounded-xl mt-2 z-[100]"
                >
                  <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                  >
                    Profile Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-10 relative">
          <div className="lg:pr-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Action Button (FAB) */}
          <motion.button
            onClick={() => navigate("/dashboard/transactions?add=1")}
            aria-label="Add transaction"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed z-50 bottom-[6.75rem] right-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-flux-orange to-flux-pink text-white shadow-[0_4px_20px_rgba(255,123,0,0.4)] transition-shadow hover:shadow-[0_4px_30px_rgba(255,123,0,0.6)] lg:bottom-10 lg:right-10"
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.button>
        </div>
      </main>

      {/* Mobile Bottom Navbar (Floating Dock Style) Optimized for Performance */}
      <nav className="fixed bottom-3 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-[400px] z-40 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#050505]/90 pb-[env(safe-area-inset-bottom)] shadow-xl backdrop-blur-lg will-change-transform transform-gpu lg:hidden">
        <div className="flex items-center justify-around px-1 py-1.5 relative">
          {bottomNavItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            const tourId = to === "/dashboard" ? "tour-dashboard" : `tour-${to.split("/").pop()}`;
            return (
              <Link
                key={to}
                to={to}
                data-tour={tourId}
                className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 h-14"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active-pill"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-10 bg-gradient-to-tr from-flux-orange via-flux-pink to-flux-violet rounded-xl shadow-md will-change-transform"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 flex flex-col items-center gap-1 w-full h-full justify-center will-change-transform"
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className={`transition-colors duration-300 ${
                      active ? "text-white" : "text-white/40 hover:text-white/80"
                    }`}
                  />
                  {!active && (
                    <span className="text-[9px] font-medium tracking-tight text-white/40">
                      {label}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* More Menu Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 h-14 text-white/40 hover:text-white/80 outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 flex flex-col items-center gap-1 w-full h-full justify-center will-change-transform"
                >
                  <MoreHorizontal size={22} strokeWidth={2} />
                  <span className="text-[9px] font-medium tracking-tight">More</span>
                </motion.div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={15}
              className="w-56 bg-[#111] border-white/10 text-white rounded-xl mb-2 z-[100]"
            >
              <DropdownMenuLabel>More Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/categories")}
                className="cursor-pointer focus:bg-white/10 focus:text-white gap-2"
              >
                <Tag size={16} /> Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/recurring")}
                className="cursor-pointer focus:bg-white/10 focus:text-white gap-2"
              >
                <RefreshCw size={16} /> Recurring
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/savings")}
                className="cursor-pointer focus:bg-white/10 focus:text-white gap-2"
              >
                <Target size={16} /> Savings Goals
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/profile")}
                className="cursor-pointer focus:bg-white/10 focus:text-white gap-2"
              >
                Profile Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
}
