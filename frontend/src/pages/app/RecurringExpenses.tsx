import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, RefreshCw, Pause, Play } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useRecurringExpenses, useProfile, store } from "@/hooks/useFinanceData";
import type { RecurringExpense } from "@/lib/store";

const reSchema = z.object({
  name: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be positive"),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  next_date: z.string().min(1, "Required"),
  status: z.enum(["active", "paused"]),
});
type REForm = z.infer<typeof reSchema>;

const FREQ_COLORS: Record<string, string> = {
  daily: "#d1ff26",
  weekly: "#38bdf8",
  monthly: "#ff7b00",
  yearly: "#9b5de5",
};

export default function RecurringPage() {
  const expenses = useRecurringExpenses();
  const profile = useProfile();
  const currency = profile.currency;
  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RecurringExpense | null>(null);

  const totalMonthly = expenses
    .filter((e) => e.status === "active")
    .reduce((s, e) => {
      const m =
        e.frequency === "daily"
          ? 30
          : e.frequency === "weekly"
            ? 4.3
            : e.frequency === "monthly"
              ? 1
              : 1 / 12;
      return s + e.amount * m;
    }, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<REForm>({
    resolver: zodResolver(reSchema),
    defaultValues: {
      frequency: "monthly",
      status: "active",
      next_date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const openAdd = () => {
    setEditing(null);
    reset({ frequency: "monthly", status: "active", next_date: format(new Date(), "yyyy-MM-dd") });
    setShowModal(true);
  };
  const openEdit = (e: RecurringExpense) => {
    setEditing(e);
    reset({
      name: e.name,
      amount: e.amount,
      frequency: e.frequency,
      next_date: e.next_date,
      status: e.status,
    });
    setShowModal(true);
  };

  const onSubmit = (data: REForm) => {
    if (editing) {
      store.updateRecurringExpense(editing.id, data);
      toast.success("Updated!");
    } else {
      store.addRecurringExpense(data);
      toast.success("Added!");
    }
    setShowModal(false);
    reset();
  };

  const toggleStatus = (e: RecurringExpense) => {
    store.updateRecurringExpense(e.id, { status: e.status === "active" ? "paused" : "active" });
    toast.success(e.status === "active" ? "Paused" : "Resumed");
  };

  return (
    <AppLayout title="Recurring Expenses">
      <div className="p-5 lg:p-8 max-w-4xl mx-auto pb-16 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-flux-orange/15 to-flux-violet/10 border border-flux-orange/20 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
              Est. Monthly Total (active)
            </p>
            <p className="font-display text-3xl font-bold">{fmt(totalMonthly)}</p>
          </div>
          <RefreshCw size={32} className="text-flux-orange/40" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            {expenses.length} subscription{expenses.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-flux-orange text-black font-semibold text-sm px-4 py-2 rounded-xl hover:bg-flux-orange/90 transition-colors"
          >
            <Plus size={16} /> Add Recurring
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-4xl">🔄</div>
            <p className="text-white/30 text-sm">No recurring expenses yet</p>
            <button
              onClick={openAdd}
              className="text-sm text-flux-orange hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add subscription
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden divide-y divide-white/[0.05]">
            {expenses.map((e, i) => {
              const freqColor = FREQ_COLORS[e.frequency] ?? "#fff";
              const paused = e.status === "paused";
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-4 group hover:bg-white/[0.03] transition-colors ${paused ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1">
                    <div
                      className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${freqColor}18` }}
                    >
                      <RefreshCw size={18} style={{ color: freqColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{e.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-md capitalize"
                          style={{ background: `${freqColor}18`, color: freqColor }}
                        >
                          {e.frequency}
                        </span>
                        <span className="text-xs text-white/40 truncate">
                          Next: {format(parseISO(e.next_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm">{fmt(e.amount)}</p>
                      <p className="text-xs text-white/40">/{e.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/[0.05] sm:border-0">
                    <button
                      onClick={() => toggleStatus(e)}
                      className="size-7 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      {paused ? <Play size={12} /> : <Pause size={12} />}
                    </button>
                    <button
                      onClick={() => openEdit(e)}
                      className="size-7 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => {
                        store.deleteRecurringExpense(e.id);
                        toast.success("Deleted");
                      }}
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
            title={editing ? "Edit Recurring" : "Add Recurring Expense"}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Netflix, Rent"
                  className="form-input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount" error={errors.amount?.message}>
                  <input
                    {...register("amount")}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                  />
                </Field>
                <Field label="Frequency">
                  <select {...register("frequency")} className="form-input">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Next Date" error={errors.next_date?.message}>
                  <input {...register("next_date")} type="date" className="form-input" />
                </Field>
                <Field label="Status">
                  <select {...register("status")} className="form-input">
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </Field>
              </div>
              <ModalActions
                onCancel={() => {
                  setShowModal(false);
                  reset();
                }}
                label={editing ? "Update" : "Add"}
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
