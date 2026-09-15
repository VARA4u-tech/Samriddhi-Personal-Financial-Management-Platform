import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { AppLayout } from '@/components/AppLayout';
import { useTransactions, useCategories, useProfile } from '@/hooks/useFinanceData';

const COLORS = ['#ff7b00', '#9b5de5', '#ff33a1', '#d1ff26', '#00c878', '#38bdf8', '#f59e0b'];

export default function ReportsPage() {
  const transactions = useTransactions();
  const categories = useCategories();
  const profile = useProfile();
  const currency = profile.currency;
  const fmt = (n: number) => `${currency}${n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toFixed(0)}`;
  const fmtFull = (n: number) => `${currency}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const now = new Date();

  const monthlyData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(now, 11 - i);
      const mx = transactions.filter((t) =>
        isWithinInterval(new Date(t.transaction_date), { start: startOfMonth(month), end: endOfMonth(month) })
      );
      const income = mx.filter((t) => t.transaction_type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = mx.filter((t) => t.transaction_type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month: format(month, 'MMM yy'), income, expenses, savings: income - expenses };
    }), [transactions]);

  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {};
    transactions.filter((t) => t.transaction_type === 'expense' && t.category_id)
      .forEach((t) => { catMap[t.category_id!] = (catMap[t.category_id!] ?? 0) + t.amount; });
    return Object.entries(catMap)
      .map(([id, value]) => ({ name: categories.find((c) => c.id === id)?.name ?? 'Unknown', value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const topMerchants = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.transaction_type === 'expense')
      .forEach((t) => { map[t.merchant] = (map[t.merchant] ?? 0) + t.amount; });
    return Object.entries(map).map(([merchant, total]) => ({ merchant, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [transactions]);

  const savingsRateData = useMemo(() =>
    monthlyData.map((d) => ({ month: d.month, rate: d.income > 0 ? Math.max(0, Math.round((d.savings / d.income) * 100)) : 0 })),
    [monthlyData]);

  const thisMonth = monthlyData[11]!;
  const savingsRate = thisMonth.income > 0 ? Math.round((thisMonth.savings / thisMonth.income) * 100) : 0;

  return (
    <AppLayout title="Reports">
      <div className="p-5 lg:p-8 max-w-6xl mx-auto pb-16 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'This Month Income', value: fmtFull(thisMonth.income), color: 'text-flux-green' },
            { label: 'This Month Expenses', value: fmtFull(thisMonth.expenses), color: 'text-flux-pink' },
            { label: 'Net Savings', value: fmtFull(thisMonth.savings), color: thisMonth.savings >= 0 ? 'text-flux-lime' : 'text-flux-pink' },
            { label: 'Savings Rate', value: `${savingsRate}%`, color: savingsRate >= 20 ? 'text-flux-green' : 'text-flux-orange' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4">
              <p className="text-xs text-white/40 mb-2">{kpi.label}</p>
              <p className={`font-display text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Income vs Expenses */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold">Income vs Expenses · Last 12 Months</h2>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-flux-lime" />Income</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-flux-pink" />Expenses</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid stroke="#ffffff08" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [fmtFull(v), '']} />
                <Bar dataKey="income" fill="#d1ff26" radius={[4, 4, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expenses" fill="#ff33a1" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category + Savings Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <h2 className="font-display font-semibold mb-4">Spending by Category</h2>
            {categoryData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-white/20 text-sm">No categorized expenses</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <PieChart width={160} height={160}>
                  <Pie data={categoryData} cx={75} cy={75} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div className="flex-1 space-y-2 w-full">
                  {categoryData.slice(0, 6).map((item, i) => {
                    const total = categoryData.reduce((s, c) => s + c.value, 0);
                    const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /><span className="text-white/70 truncate max-w-[120px]">{item.name}</span></span>
                          <span className="text-white/40">{pct}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <h2 className="font-display font-semibold mb-4">Savings Rate Trend</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsRateData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#ffffff08" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff30" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, 'Savings Rate']} />
                  <Line type="monotone" dataKey="rate" stroke="#9b5de5" strokeWidth={2} dot={{ r: 3, fill: '#9b5de5' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <h2 className="font-display font-semibold mb-4">Top 5 Merchants by Spend</h2>
          {topMerchants.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-8">No expense data yet</p>
          ) : (
            <div className="space-y-3">
              {topMerchants.map((m, i) => {
                const max = topMerchants[0]!.total;
                const pct = max > 0 ? (m.total / max) * 100 : 0;
                return (
                  <div key={m.merchant} className="flex items-center gap-4">
                    <span className="text-xs text-white/30 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{m.merchant}</span>
                        <span className="text-sm text-white/50 ml-3">{fmtFull(m.total)}</span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                          className="h-full rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
