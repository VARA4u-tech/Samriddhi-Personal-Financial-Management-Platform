import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { AppLayout } from "@/components/AppLayout";
import { useTransactions, useBudgets, useSavingsGoals, useProfile } from "@/hooks/useFinanceData";

const COLORS = ["#ff7b00", "#9b5de5", "#ff33a1", "#d1ff26", "#00c878"];

export default function DashboardPage() {
  const transactions = useTransactions();
  const budgets = useBudgets();
  const goals = useSavingsGoals();
  const profile = useProfile();
  const currency = profile.currency;

  const now = new Date();
  const currentHour = now.getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const thisMonthTx = transactions.filter((t) =>
    isWithinInterval(new Date(t.transaction_date), { start: monthStart, end: monthEnd }),
  );

  const monthlyIncome = thisMonthTx
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = thisMonthTx
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const totalBalance =
    transactions.filter((t) => t.transaction_type === "income").reduce((s, t) => s + t.amount, 0) -
    transactions.filter((t) => t.transaction_type === "expense").reduce((s, t) => s + t.amount, 0);

  const cashFlowData = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const month = subMonths(now, 5 - i);
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        const mx = transactions.filter((t) =>
          isWithinInterval(new Date(t.transaction_date), { start, end }),
        );
        return {
          month: format(month, "MMM"),
          income: mx
            .filter((t) => t.transaction_type === "income")
            .reduce((s, t) => s + t.amount, 0),
          expenses: mx
            .filter((t) => t.transaction_type === "expense")
            .reduce((s, t) => s + t.amount, 0),
        };
      }),
    [transactions],
  );

  const recentTx = transactions.slice(0, 5);
  const budgetPieData = budgets
    .map((b) => ({ name: b.name, value: b.spent }))
    .filter((b) => b.value > 0);
  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <AppLayout title="Overview">
      <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 pb-16">
        {/* Welcome Greeting */}
        <div className="mb-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            {greeting}
            {profile.display_name ? `, ${profile.display_name}` : ""} 👋
          </h1>
          <p className="text-white/50 text-sm mt-1">Here's your financial overview.</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Balance",
              value: fmt(totalBalance),
              icon: <Wallet size={20} />,
              color: "from-flux-orange/20 to-flux-orange/5",
              ic: "text-flux-orange",
            },
            {
              label: "Monthly Income",
              value: fmt(monthlyIncome),
              icon: <TrendingUp size={20} />,
              color: "from-flux-green/20 to-flux-green/5",
              ic: "text-flux-green",
            },
            {
              label: "Monthly Expenses",
              value: fmt(monthlyExpenses),
              icon: <TrendingDown size={20} />,
              color: "from-flux-pink/20 to-flux-pink/5",
              ic: "text-flux-pink",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl bg-gradient-to-br ${card.color} border border-white/[0.08] p-5`}
            >
              <div
                className={`size-9 rounded-full bg-white/10 flex items-center justify-center mb-3 ${card.ic}`}
              >
                {card.icon}
              </div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="font-display text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-white/40 mt-1">This month</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cash flow area chart */}
          <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-base">Cash Flow · Last 6 Months</h2>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-flux-lime" />
                  Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-flux-pink" />
                  Expenses
                </span>
              </div>
            </div>
            {transactions.length === 0 ? (
              <div className="h-52 flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-xl flex-col gap-2">
                <BarChart3 className="size-8 text-white/20" />
                <p className="text-sm font-medium text-white/50 text-center px-4 max-w-sm">
                  Your financial insights will appear here once you start adding transactions.
                </p>
              </div>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={cashFlowData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d1ff26" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#d1ff26" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff33a1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#ff33a1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#ffffff08" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      stroke="#ffffff30"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#ffffff30"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) =>
                        `${currency}${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#111",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                      formatter={(v: number) => [fmt(v), ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#d1ff26"
                      strokeWidth={2}
                      fill="url(#gIncome)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ff33a1"
                      strokeWidth={2}
                      fill="url(#gExpenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Budget pie */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 flex flex-col">
            <h2 className="font-display font-semibold text-base mb-4">Budget Breakdown</h2>
            {budgetPieData.length === 0 ? (
              <EmptyState text="No budget data yet" />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <PieChart width={140} height={140}>
                  <Pie
                    data={budgetPieData}
                    cx={65}
                    cy={65}
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {budgetPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="w-full space-y-2">
                  {budgetPieData.slice(0, 4).map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-white/70 truncate max-w-[90px]">{item.name}</span>
                      </span>
                      <span className="text-white/50">{fmt(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Transactions */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-base">Recent Transactions</h2>
              <Link
                to="/dashboard/transactions"
                className="text-xs text-flux-lime hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            {recentTx.length === 0 ? (
              <EmptyState text="No transactions yet">
                <Link
                  to="/dashboard/transactions"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs bg-flux-orange/20 text-flux-orange px-3 py-1.5 rounded-full hover:bg-flux-orange/30 transition-colors"
                >
                  <Plus size={12} /> Add Transaction
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-1">
                {recentTx.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-full flex items-center justify-center ${t.transaction_type === "income" ? "bg-flux-green/15" : "bg-flux-pink/15"}`}
                      >
                        {t.transaction_type === "income" ? (
                          <ArrowDownRight size={16} className="text-flux-green" />
                        ) : (
                          <ArrowUpRight size={16} className="text-flux-pink" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">{t.merchant}</p>
                        <p className="text-xs text-white/40">
                          {format(new Date(t.transaction_date), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-semibold ${t.transaction_type === "income" ? "text-flux-green" : "text-flux-pink"}`}
                    >
                      {t.transaction_type === "income" ? "+" : "-"}
                      {fmt(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget Progress */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-base">Budget Progress</h2>
              <Link
                to="/dashboard/budgets"
                className="text-xs text-flux-lime hover:underline flex items-center gap-1"
              >
                Manage <ArrowUpRight size={12} />
              </Link>
            </div>
            {budgets.length === 0 ? (
              <EmptyState text="No budgets yet">
                <Link
                  to="/dashboard/budgets"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs bg-flux-orange/20 text-flux-orange px-3 py-1.5 rounded-full hover:bg-flux-orange/30 transition-colors"
                >
                  <Plus size={12} /> Create Budget
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-4">
                {budgets.slice(0, 4).map((b, i) => {
                  const pct = Math.min((b.spent / b.amount) * 100, 100);
                  const over = b.spent > b.amount;
                  return (
                    <div key={b.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{b.name}</span>
                        <span className={`text-xs ${over ? "text-flux-pink" : "text-white/50"}`}>
                          {fmt(b.spent)} / {fmt(b.amount)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${over ? "bg-flux-pink" : "bg-flux-lime"}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Savings Goals strip */}
        {goals.length > 0 && (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-base">Savings Goals</h2>
              <Link
                to="/dashboard/savings"
                className="text-xs text-flux-lime hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {goals.slice(0, 4).map((g) => {
                const pct = Math.min((g.current_amount / g.target_amount) * 100, 100);
                return (
                  <div
                    key={g.id}
                    className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3"
                  >
                    <p className="text-sm font-medium truncate mb-1">{g.name}</p>
                    <div className="h-1 bg-white/[0.08] rounded-full mb-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: g.color }}
                      />
                    </div>
                    <p className="text-xs text-white/40">
                      {pct.toFixed(0)}% · {fmt(g.current_amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function EmptyState({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
      <div className="size-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-3">
        <span className="text-white/20 text-lg">—</span>
      </div>
      <p className="text-sm text-white/30">{text}</p>
      {children}
    </div>
  );
}
