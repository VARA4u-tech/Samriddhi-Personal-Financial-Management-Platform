import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useBudgets, useCategories, useProfile, store } from "@/hooks/useFinanceData";
import type { Budget } from "@/lib/store";

const budgetSchema = z.object({
  name: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be positive"),
  period: z.enum(["monthly", "weekly", "yearly"]),
  category_id: z.string().optional(),
});
type BudgetForm = z.infer<typeof budgetSchema>;

export default function BudgetsPage() {
  const budgets = useBudgets();
  const categories = useCategories();
  const profile = useProfile();
  const currency = profile.currency;
  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { period: "monthly" },
  });

  const openAdd = () => {
    setEditing(null);
    reset({ period: "monthly" });
    setShowModal(true);
  };
  const openEdit = (b: Budget) => {
    setEditing(b);
    reset({ name: b.name, amount: b.amount, period: b.period, category_id: b.category_id ?? "" });
    setShowModal(true);
  };

  const onSubmit = (data: BudgetForm) => {
    if (editing) {
      store.updateBudget(editing.id, { ...data, category_id: data.category_id || null });
      toast.success("Budget updated!");
    } else {
      store.addBudget({ ...data, spent: 0, category_id: data.category_id || null });
      toast.success("Budget created!");
    }
    setShowModal(false);
    reset();
  };

  const handleDelete = (id: string) => {
    store.deleteBudget(id);
    toast.success("Deleted");
  };

  return (
    <AppLayout title="Budgets">
      <div className="p-5 lg:p-8 max-w-5xl mx-auto pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">
            {budgets.length} budget{budgets.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-flux-orange text-black font-semibold text-sm px-4 py-2 rounded-xl hover:bg-flux-orange/90 transition-colors"
          >
            <Plus size={16} /> New Budget
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="size-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl">
              📊
            </div>
            <p className="text-white/30 text-sm">No budgets yet</p>
            <button
              onClick={openAdd}
              className="text-sm text-flux-orange hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Create your first budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b, i) => {
              const pct = b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0;
              const over = b.spent > b.amount;
              const radius = 36;
              const circumference = 2 * Math.PI * radius;
              const strokeDash = (pct / 100) * circumference;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-5 relative group ${over ? "bg-flux-pink/[0.06] border-flux-pink/20" : "bg-white/[0.03] border-white/[0.08]"}`}
                >

                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative size-20 flex-shrink-0">
                      <svg className="size-20 -rotate-90" viewBox="0 0 88 88">
                        <circle
                          cx="44"
                          cy="44"
                          r={radius}
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="7"
                        />
                        <motion.circle
                          cx="44"
                          cy="44"
                          r={radius}
                          fill="none"
                          stroke={over ? "#ff33a1" : "#d1ff26"}
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference - strokeDash }}
                          transition={{ duration: 0.9, delay: i * 0.07, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-sm font-bold ${over ? "text-flux-pink" : "text-white"}`}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 pr-12">
                      <p className="font-display font-semibold truncate flex items-center gap-2">
                        {b.name}
                        {over && <AlertTriangle size={14} className="text-flux-pink flex-shrink-0" />}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5 capitalize">{b.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={over ? "text-flux-pink font-semibold" : "text-white/70"}>
                      {fmt(b.spent)} spent
                    </span>
                    <span className="text-white/40">of {fmt(b.amount)}</span>
                  </div>
                  <div className="absolute top-3 right-3 opacity-100 sm:opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button
                      onClick={() => openEdit(b)}
                      className="size-7 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="size-7 rounded-lg bg-flux-pink/10 hover:bg-flux-pink/20 flex items-center justify-center text-flux-pink/50 hover:text-flux-pink transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              reset();
            }}
            title={editing ? "Edit Budget" : "New Budget"}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Budget Name" error={errors.name?.message}>
                <input {...register("name")} placeholder="e.g. Groceries" className="form-input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Limit Amount" error={errors.amount?.message}>
                  <input
                    {...register("amount")}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                  />
                </Field>
                <Field label="Period">
                  <select {...register("period")} className="form-input">
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>
              </div>
              <Field label="Category (optional)">
                <select {...register("category_id")} className="form-input">
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <ModalActions
                onCancel={() => {
                  setShowModal(false);
                  reset();
                }}
                label={editing ? "Update" : "Create Budget"}
              />
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-flux-pink mt-1">{error}</p>}
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        className="w-full max-w-md bg-[#111] border border-white/[0.1] rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="size-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
function ModalActions({ onCancel, label }: { onCancel: () => void; label: string }) {
  return (
    <div className="flex gap-3 pt-1">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-sm text-white/60 hover:text-white transition-all"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 py-2.5 rounded-xl bg-flux-orange text-black font-semibold text-sm hover:bg-flux-orange/90 transition-colors"
      >
        {label}
      </button>
    </div>
  );
}
