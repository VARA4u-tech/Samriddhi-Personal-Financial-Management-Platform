import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PieChart, ArrowLeftRight, Settings, Menu, X, Bell, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cashFlowData = [
  { month: 'Jan', income: 4200, expenses: 3100 },
  { month: 'Feb', income: 4500, expenses: 2900 },
  { month: 'Mar', income: 5100, expenses: 3400 },
  { month: 'Apr', income: 4800, expenses: 3200 },
  { month: 'May', income: 5400, expenses: 3600 },
  { month: 'Jun', income: 6200, expenses: 3800 },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative">
      <div className="absolute inset-0 flux-grid-bg opacity-[0.03] pointer-events-none" />
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-8 rounded-full bg-flux-orange/80 shadow-[0_0_15px_rgba(255,123,0,0.5)]" />
            <span className="font-display text-xl font-bold tracking-tight">Samriddhi</span>
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-8 space-y-2">
          <SidebarItem icon={<Home size={20} />} label="Overview" active />
          <SidebarItem icon={<PieChart size={20} />} label="Analytics" />
          <SidebarItem icon={<ArrowLeftRight size={20} />} label="Transactions" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-black/20 backdrop-blur-xl z-10 relative">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-flux-orange/50 focus:ring-1 focus:ring-flux-orange/50 transition-all w-64 text-white placeholder:text-white/40"
              />
            </div>
            <button className="relative text-white/70 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-flux-pink animate-pulse" />
            </button>
            <div className="size-10 rounded-full bg-gradient-to-tr from-flux-orange to-flux-pink border border-white/20 shadow-[0_0_15px_rgba(255,123,0,0.3)]" />
          </div>
        </header>

        {/* Dashboard Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto space-y-8 pb-20">
            
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard title="Total Balance" amount="$124,563.00" trend="+2.4%" color="bg-flux-green" />
              <MetricCard title="Monthly Income" amount="$12,450.00" trend="+1.2%" color="bg-flux-lime" />
              <MetricCard title="Monthly Expenses" amount="$4,230.00" trend="-5.4%" color="bg-flux-pink" />
            </div>

            {/* Charts & Transactions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Placeholder */}
              <div className="lg:col-span-2 rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 min-h-[400px] flex flex-col relative overflow-hidden">
                <h3 className="font-display text-lg font-medium opacity-80 mb-6">Cash Flow Analysis</h3>
                <div className="flex-1 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={cashFlowData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d1ff26" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#d1ff26" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff33a1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ff33a1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="month" 
                        stroke="#ffffff40" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#ffffff40" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '16px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#d1ff26" 
                        fillOpacity={1} 
                        fill="url(#colorIncome)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#ff33a1" 
                        fillOpacity={1} 
                        fill="url(#colorExpenses)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Transactions Placeholder */}
              <div className="rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-medium opacity-80">Recent Transactions</h3>
                  <button className="text-sm text-flux-lime hover:underline">View All</button>
                </div>
                <div className="flex-1 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="opacity-50 text-xs">Logo</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Merchant Name</p>
                          <p className="text-xs text-white/50">Today, 2:30 PM</p>
                        </div>
                      </div>
                      <p className="font-medium text-sm">-$120.00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-flux-orange/20 to-transparent text-flux-orange border-l-2 border-flux-orange' 
          : 'text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
};

const MetricCard = ({ title, amount, trend, color }: { title: string; amount: string; trend: string; color: string }) => {
  const isPositive = trend.startsWith('+');
  return (
    <div className="relative rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 overflow-hidden group hover:bg-white/[0.04] transition-all duration-300">
      <p className="font-display text-sm uppercase tracking-wider opacity-60 mb-2">{title}</p>
      <h2 className="font-display text-3xl font-semibold mb-4">{amount}</h2>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-flux-green/20 text-flux-green' : 'bg-flux-pink/20 text-flux-pink'}`}>
          {trend}
        </span>
        <span className="text-xs text-white/40">vs last month</span>
      </div>
    </div>
  );
};

export default Dashboard;
