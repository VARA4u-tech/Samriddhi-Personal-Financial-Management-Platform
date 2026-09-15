import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useTransactions, useCategories, useProfile, store } from "@/hooks/useFinanceData";

const txSchema = z.object({
  merchant: z.string().min(1, "Required"),
  amount: z.coerce.number().positive("Must be positive"),
  transaction_type: z.enum(["income", "expense"]),
  category_id: z.string().optional(),
  transaction_date: z.string().min(1, "Required"),
  notes: z.string().optional(),
});
type TxForm = z.infer<typeof txSchema>;

export default function TransactionsPage() {
  const transactions = useTransactions();
  const categories = useCategories();
  const profile = useProfile();
  const currency = profile.currency;

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        const matchSearch =
          t.merchant.toLowerCase().includes(search.toLowerCase()) ||
          (t.notes ?? "").toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || t.transaction_type === typeFilter;
        return matchSearch && matchType;
      }),
    [transactions, search, typeFilter],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TxForm>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      transaction_type: "expense",
      transaction_date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (data: TxForm) => {
    store.addTransaction({
      merchant: data.merchant,
      amount: data.amount,
      transaction_type: data.transaction_type,
      category_id: data.category_id || null,
      transaction_date: data.transaction_date,
      notes: data.notes || null,
    });
    toast.success("Transaction added!");
    reset({ transaction_type: "expense", transaction_date: format(new Date(), "yyyy-MM-dd") });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    store.deleteTransaction(id);
    toast.success("Deleted");
  };

  return (
    <AppLayout title="Transactions">
      <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-5 pb-16">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions…"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-flux-orange/40 transition-all placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {(["all", "income", "expense"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  typeFilter === f
                    ? f === "income"
                      ? "bg-flux-green/20 text-flux-green border border-flux-green/30"
                      : f === "expense"
                        ? "bg-flux-pink/20 text-flux-pink border border-flux-pink/30"
                        : "bg-white/[0.1] text-white border border-white/[0.15]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05] border border-transparent"
                }`}
              >
                {f === "all" ? (
                  <>
                    <Filter size={14} className="inline mr-1" />
                    All
                  </>
                ) : (
                  f
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-flux-orange text-black font-semibold text-sm px-4 py-2 rounded-xl hover:bg-flux-orange/90 transition-colors flex-shrink-0"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 border-b border-white/[0.06] text-xs text-white/40 uppercase tracking-wider">
            <span>Merchant</span>
            <span>Date</span>
            <span>Amount</span>
            <span></span>
          </div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-white/30 text-sm">
                {search ? "No results" : "No transactions yet"}
              </p>
              {!search && (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs text-flux-orange hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add first transaction
                </button>
              )}
            </div>
          ) : (
            filtered.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center sm:grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group last:border-0"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${t.transaction_type === "income" ? "bg-flux-green/15" : "bg-flux-pink/15"}`}
                  >
                    {t.transaction_type === "income" ? (
                      <ArrowDownRight size={14} className="text-flux-green" />
                    ) : (
                      <ArrowUpRight size={14} className="text-flux-pink" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.merchant}</p>
                    <p className="text-xs text-white/40 truncate">
                      <span className="sm:hidden">{format(new Date(t.transaction_date), "MMM d")}</span>
                      {t.notes && <span className="sm:hidden"> • </span>}
                      {t.notes && <span>{t.notes}</span>}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline text-xs text-white/40 whitespace-nowrap">
                  {format(new Date(t.transaction_date), "MMM d, yyyy")}
                </span>
                <span
                  className={`text-sm font-semibold whitespace-nowrap flex-shrink-0 ${t.transaction_type === "income" ? "text-flux-green" : "text-flux-pink"}`}
                >
                  {t.transaction_type === "income" ? "+" : "-"}
                  {fmt(t.amount)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 size-7 rounded-lg hover:bg-flux-pink/20 flex flex-shrink-0 items-center justify-center text-white/30 hover:text-flux-pink transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              reset();
            }}
            title="Add Transaction"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <label key={t} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      value={t}
                      {...register("transaction_type")}
                      className="sr-only"
                    />
                    <span
                      className={`block text-center py-2 rounded-xl text-sm font-medium transition-all border capitalize
                      ${
                        t === "expense"
                          ? "has-[:checked]:bg-flux-pink/20 has-[:checked]:text-flux-pink has-[:checked]:border-flux-pink/30 border-white/10 text-white/40 hover:text-white"
                          : "has-[:checked]:bg-flux-green/20 has-[:checked]:text-flux-green has-[:checked]:border-flux-green/30 border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {t}
                    </span>
                  </label>
                ))}
              </div>
              <Field label="Merchant / Description" error={errors.merchant?.message}>
                <input
                  {...register("merchant")}
                  placeholder="e.g. Swiggy, Salary"
                  className="form-input"
                />
              </Field>
              <Field label="Amount" error={errors.amount?.message}>
                <input
                  {...register("amount")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="form-input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date" error={errors.transaction_date?.message}>
                  <input {...register("transaction_date")} type="date" className="form-input" />
                </Field>
                <Field label="Category">
                  <select {...register("category_id")} className="form-input">
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Notes (optional)">
                <input {...register("notes")} placeholder="Optional…" className="form-input" />
              </Field>
              <ModalActions
                onCancel={() => {
                  setShowModal(false);
                  reset();
                }}
                label="Add Transaction"
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

function ModalActions({
  onCancel,
  label,
  loading,
}: {
  onCancel: () => void;
  label: string;
  loading?: boolean;
}) {
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
        disabled={loading}
        className="flex-1 py-2.5 rounded-xl bg-flux-orange text-black font-semibold text-sm hover:bg-flux-orange/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Saving…" : label}
      </button>
    </div>
  );
}
