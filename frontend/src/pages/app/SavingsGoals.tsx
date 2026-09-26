import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Target, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useSavingsGoals, useProfile, store } from "@/hooks/useFinanceData";
import type { SavingsGoal } from "@/lib/store";

const goalSchema = z.object({
  name: z.string().min(1, "Required"),
  target_amount: z.coerce.number().positive("Must be positive"),
  current_amount: z.coerce.number().min(0),
  color: z.string(),
  target_date: z.string().optional(),
});
type GoalForm = z.infer<typeof goalSchema>;

const contributeSchema = z.object({ amount: z.coerce.number().positive("Must be positive") });

const GOAL_COLORS = ["#ff7b00", "#9b5de5", "#ff33a1", "#d1ff26", "#00c878", "#38bdf8", "#f59e0b"];

export default function SavingsGoalsPage() {
  const goals = useSavingsGoals();
  const profile = useProfile();
  const currency = profile.currency;
  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);
  const [contributing, setContributing] = useState<SavingsGoal | null>(null);

  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: { current_amount: 0, color: "#ff7b00" },
  });
  const selectedColor = watch("color");

  const {
    register: rC,
    handleSubmit: hC,
    reset: rsC,
    formState: { errors: eC },
  } = useForm<{ amount: number }>({
    resolver: zodResolver(contributeSchema),
  });

  const openAdd = () => {
    setEditing(null);
    reset({ current_amount: 0, color: "#ff7b00" });
    setShowModal(true);
  };
  const openEdit = (g: SavingsGoal) => {
    setEditing(g);
    reset({
      name: g.name,
      target_amount: g.target_amount,
      current_amount: g.current_amount,
      color: g.color,
      target_date: g.target_date ?? "",
    });
    setShowModal(true);
  };

  const onSubmit = (data: GoalForm) => {
    if (editing) {
      store.updateSavingsGoal(editing.id, { ...data, target_date: data.target_date || null });
      toast.success("Updated!");
    } else {
      store.addSavingsGoal({ ...data, target_date: data.target_date || null });
      toast.success("Goal created!");
    }
    setShowModal(false);
    reset();
  };

  const onContribute = (data: { amount: number }) => {
    if (!contributing) return;
    store.updateSavingsGoal(contributing.id, {
      current_amount: contributing.current_amount + data.amount,
    });
    toast.success(`${fmt(data.amount)} added!`);
    setContributing(null);
    rsC();
  };

  return (
    <AppLayout title="Savings Goals">
      <div className="p-5 lg:p-8 max-w-5xl mx-auto pb-16 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 rounded-2xl bg-gradient-to-br from-flux-violet/15 to-flux-pink/10 border border-flux-violet/20 p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Saved</p>
            <p className="font-display text-3xl font-bold">{fmt(totalSaved)}</p>
            <div className="mt-3 h-1.5 bg-white/[0.07] rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%`,
                }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-flux-violet to-flux-pink"
              />
            </div>
            <p className="text-xs text-white/40 mt-1.5">
              of {fmt(totalTarget)} across {goals.length} goal{goals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 flex flex-col items-center justify-center gap-2">
            <Target size={28} className="text-flux-violet" />
            <p className="font-display text-2xl font-bold">
              {goals.filter((g) => g.current_amount >= g.target_amount).length}
            </p>
            <p className="text-xs text-white/40">Goals Achieved</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            {goals.length} goal{goals.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-flux-orange text-black font-semibold text-sm px-4 py-2 rounded-xl hover:bg-flux-orange/90 transition-colors"
          >
            <Plus size={16} /> New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4">
            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Target className="size-8 text-white/20" />
            </div>
            <div>
              <p className="text-white font-medium text-lg">No savings goals yet</p>
              <p className="text-white/40 text-sm mt-1 max-w-sm">
                Create a goal and start building toward it.
              </p>
            </div>
            <button
              onClick={openAdd}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-flux-orange to-flux-pink text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Create Savings Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g, i) => {
              const pct =
                g.target_amount > 0 ? Math.min((g.current_amount / g.target_amount) * 100, 100) : 0;
              const achieved = g.current_amount >= g.target_amount;
              const radius = 42;
              const circumference = 2 * Math.PI * radius;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 hover:border-white/[0.15] transition-all relative"
                  style={{ borderColor: `${g.color}22` }}
                >
                  {achieved && (
                    <div
                      className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${g.color}30`, color: g.color }}
                    >
                      ✓ Achieved
                    </div>
                  )}
                  <div className="flex justify-center mb-4 mt-2">
                    <div className="relative size-24">
                      <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          stroke={g.color}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{
                            strokeDashoffset: circumference - (pct / 100) * circumference,
                          }}
                          transition={{ duration: 1, delay: i * 0.07 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="font-display text-base font-bold"
                          style={{ color: g.color }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-center truncate mb-1">{g.name}</h3>
                  {g.target_date && (
                    <p className="text-xs text-white/30 text-center mb-3">
                      Target: {format(new Date(g.target_date), "MMM yyyy")}
                    </p>
                  )}
                  <p className="text-sm text-center text-white/50">
                    {fmt(g.current_amount)}{" "}
                    <span className="text-white/25">/ {fmt(g.target_amount)}</span>
                  </p>
                  <button
                    onClick={() => setContributing(g)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.2]"
                  >
                    <PlusCircle size={13} /> Contribute
                  </button>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(g)}
                      className="size-6 rounded-md bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => {
                        store.deleteSavingsGoal(g.id);
                        toast.success("Deleted");
                      }}
                      className="size-6 rounded-md bg-flux-pink/10 hover:bg-flux-pink/20 flex items-center justify-center text-flux-pink/50 hover:text-flux-pink transition-all"
                    >
                      <Trash2 size={11} />
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
            title={editing ? "Edit Goal" : "New Savings Goal"}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Goal Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Emergency Fund"
                  className="form-input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Target Amount" error={errors.target_amount?.message}>
                  <input
                    {...register("target_amount")}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                  />
                </Field>
                <Field label="Saved So Far" error={errors.current_amount?.message}>
                  <input
                    {...register("current_amount")}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                  />
                </Field>
              </div>
              <Field label="Target Date (optional)">
                <input {...register("target_date")} type="date" className="form-input" />
              </Field>
              <div>
                <label className="block text-xs text-white/50 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue("color", c)}
                      className={`size-8 rounded-full transition-all ${selectedColor === c ? "ring-2 ring-white/60 ring-offset-2 ring-offset-[#111] scale-110" : "hover:scale-105"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <ModalActions
                onCancel={() => {
                  setShowModal(false);
                  reset();
                }}
                label={editing ? "Update" : "Create Goal"}
              />
            </form>
          </Modal>
        )}
        {contributing && (
          <Modal
            onClose={() => {
              setContributing(null);
              rsC();
            }}
            title={`Add to "${contributing.name}"`}
          >
            <form onSubmit={hC(onContribute)} className="space-y-4">
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 text-center">
                <p className="text-xs text-white/40 mb-1">Current Progress</p>
                <p className="font-display text-xl font-bold">
                  {fmt(contributing.current_amount)}{" "}
                  <span className="text-white/30 text-base font-normal">
                    / {fmt(contributing.target_amount)}
                  </span>
                </p>
              </div>
              <Field label="Amount to Add" error={eC.amount?.message}>
                <input
                  {...rC("amount")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="form-input"
                  autoFocus
                />
              </Field>
              <ModalActions
                onCancel={() => {
                  setContributing(null);
                  rsC();
                }}
                label="Add Funds"
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
