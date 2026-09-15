import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useCategories, store } from "@/hooks/useFinanceData";

const PRESET_ICONS = [
  "🍔",
  "🏠",
  "🚗",
  "💊",
  "✈️",
  "📱",
  "🎬",
  "📚",
  "💼",
  "🛒",
  "💰",
  "🎮",
  "🏋️",
  "☕",
  "🎵",
  "👗",
];
const PRESET_COLORS = [
  "#ff7b00",
  "#ff33a1",
  "#9b5de5",
  "#d1ff26",
  "#00c878",
  "#38bdf8",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const catSchema = z.object({
  name: z.string().min(1, "Required"),
  icon: z.string().min(1, "Pick an icon"),
  color: z.string().min(1, "Pick a color"),
});
type CatForm = z.infer<typeof catSchema>;

export default function CategoriesPage() {
  const categories = useCategories();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CatForm>({
    resolver: zodResolver(catSchema),
    defaultValues: { icon: "🏠", color: "#ff7b00" },
  });
  const selectedIcon = watch("icon");
  const selectedColor = watch("color");

  const onSubmit = (data: CatForm) => {
    store.addCategory(data);
    toast.success("Category created!");
    reset({ icon: "🏠", color: "#ff7b00" });
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    store.deleteCategory(id);
    toast.success("Deleted");
  };

  return (
    <AppLayout title="Categories">
      <div className="p-5 lg:p-8 max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-flux-orange text-black font-semibold text-sm px-4 py-2 rounded-xl hover:bg-flux-orange/90 transition-colors"
          >
            <Plus size={16} /> New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-4xl">🏷️</div>
            <p className="text-white/30 text-sm">No categories yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-flux-orange hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Create one
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 hover:border-white/[0.15] transition-all"
                style={{ borderColor: `${c.color}22` }}
              >
                <div
                  className="size-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${c.color}22` }}
                >
                  {c.icon}
                </div>
                <p className="font-medium text-sm truncate">{c.name}</p>
                <div
                  className="absolute top-3 right-3 size-2.5 rounded-full"
                  style={{ background: c.color }}
                />
                <button
                  onClick={() => handleDelete(c.id)}
                  className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 size-6 rounded-lg bg-flux-pink/20 flex items-center justify-center text-flux-pink transition-all hover:bg-flux-pink/30"
                >
                  <Trash2 size={11} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              reset({ icon: "🏠", color: "#ff7b00" });
            }}
            title="New Category"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Name</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Food & Dining"
                  className="form-input w-full"
                />
                {errors.name && (
                  <p className="text-xs text-flux-pink mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setValue("icon", icon)}
                      className={`size-9 rounded-xl text-lg flex items-center justify-center transition-all ${selectedIcon === icon ? "bg-flux-orange/20 ring-2 ring-flux-orange/40" : "bg-white/[0.05] hover:bg-white/[0.1]"}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue("color", color)}
                      className={`size-8 rounded-full transition-all ${selectedColor === color ? "ring-2 ring-white/60 ring-offset-2 ring-offset-[#111] scale-110" : "hover:scale-105"}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              {/* Preview */}
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 flex items-center gap-3">
                <div
                  className="size-9 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${selectedColor}22` }}
                >
                  {selectedIcon}
                </div>
                <span className="text-sm font-medium text-white/70">
                  {watch("name") || "Category Name"}
                </span>
                <div
                  className="ml-auto size-2.5 rounded-full"
                  style={{ background: selectedColor }}
                />
              </div>
              <ModalActions
                onCancel={() => {
                  setShowModal(false);
                  reset({ icon: "🏠", color: "#ff7b00" });
                }}
                label="Create"
              />
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </AppLayout>
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
    <div className="flex gap-3">
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
