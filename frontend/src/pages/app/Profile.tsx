import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { store } from "@/lib/store";
import { useProfile } from "@/hooks/useFinanceData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Download, AlertTriangle, UserX, Check } from "lucide-react";
import { AVATAR_OPTIONS } from "@/lib/avatars";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const profile = useProfile();
  
  const [name, setName] = useState(profile.display_name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    store.updateProfile({ display_name: name.trim(), avatar: selectedAvatar });
    toast.success("Profile updated successfully!");
    navigate("/dashboard");
  };

  const handleExportData = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Transactions
      const txs = store.getTransactions().map((t) => ({
        Date: format(new Date(t.transaction_date), "yyyy-MM-dd"),
        Type: t.transaction_type,
        Merchant: t.merchant,
        Category: store.getCategories().find(c => c.id === t.category_id)?.name || "Uncategorized",
        Amount: t.amount,
        Notes: t.notes || "",
      }));
      const wsTxs = XLSX.utils.json_to_sheet(txs);
      XLSX.utils.book_append_sheet(wb, wsTxs, "Transactions");

      // Budgets
      const budgets = store.getBudgets().map((b) => ({
        Name: b.name,
        Amount: b.amount,
        Spent: b.spent,
        Period: b.period,
        Category: store.getCategories().find(c => c.id === b.category_id)?.name || "None",
      }));
      const wsBudgets = XLSX.utils.json_to_sheet(budgets);
      XLSX.utils.book_append_sheet(wb, wsBudgets, "Budgets");

      // Categories
      const categories = store.getCategories().map((c) => ({
        Name: c.name,
        Icon: c.icon,
      }));
      const wsCategories = XLSX.utils.json_to_sheet(categories);
      XLSX.utils.book_append_sheet(wb, wsCategories, "Categories");

      // Goals
      const goals = store.getSavingsGoals().map((g) => ({
        Name: g.name,
        "Target Amount": g.target_amount,
        "Current Amount": g.current_amount,
        "Target Date": g.target_date ? format(new Date(g.target_date), "yyyy-MM-dd") : "",
      }));
      const wsGoals = XLSX.utils.json_to_sheet(goals);
      XLSX.utils.book_append_sheet(wb, wsGoals, "Savings Goals");

      // Recurring
      const recurring = store.getRecurringExpenses().map((r) => ({
        Name: r.name,
        Amount: r.amount,
        Frequency: r.frequency,
        "Next Date": r.next_date ? format(new Date(r.next_date), "yyyy-MM-dd") : "",
        Status: r.status,
      }));
      const wsRecurring = XLSX.utils.json_to_sheet(recurring);
      XLSX.utils.book_append_sheet(wb, wsRecurring, "Recurring");

      XLSX.writeFile(wb, `Samriddhi_Data_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data.");
      console.error(error);
    }
  };

  const handleResetFinancialData = () => {
    if (confirm("Reset financial data?\n\nThis will permanently remove your locally stored expense and income records. Your profile name will remain unchanged.")) {
      store.resetFinancialData();
      toast.success("Financial data reset successfully.");
      navigate("/dashboard");
    }
  };

  const handleResetProfile = () => {
    if (confirm("Reset profile?\n\nThis will remove your locally stored profile information and you will be logged out.")) {
      store.resetProfile();
      toast.success("Profile reset successfully.");
      navigate("/");
    }
  };

  return (
    <AppLayout title="Profile Settings">
      <div className="p-5 lg:p-10 max-w-4xl mx-auto space-y-8">
        
        {/* Edit Profile Section */}
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-display font-semibold mb-6">Edit My Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground ml-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-background border border-foreground/10 rounded-2xl px-5 py-4 text-foreground font-medium text-lg focus:outline-none focus:ring-2 focus:ring-flux-orange/20 transition-all"
                required
              />
            </div>
            <div className="space-y-3 pt-4">
              <label className="text-sm font-medium text-muted-foreground ml-1">
                Avatar
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white ${
                      selectedAvatar === avatar
                        ? "border-flux-orange scale-105 shadow-xl"
                        : "border-transparent hover:border-foreground/20 hover:scale-105"
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    {selectedAvatar === avatar && (
                      <div className="absolute bottom-1 right-1 bg-flux-orange text-white rounded-full p-0.5">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={(!name.trim() || name === profile.display_name) && selectedAvatar === profile.avatar}
              type="submit"
              className="w-full rounded-2xl bg-foreground text-background font-semibold text-lg py-4 px-6 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 mt-4"
            >
              <Save size={20} /> Save Changes
            </motion.button>
          </form>
        </section>

        {/* Data Export Section */}
        <section className="bg-card border border-foreground/10 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-display font-semibold mb-2">Export Data</h2>
          <p className="text-muted-foreground mb-6 max-w-xl">
            Your data stays on your device. Export a personal backup whenever you need it. The export contains all your transactions, budgets, categories, and savings goals in an Excel spreadsheet.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportData}
            className="rounded-2xl bg-flux-lime/10 border border-flux-lime/20 text-flux-lime font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all hover:bg-flux-lime/20"
          >
            <Download size={20} /> Download My Data
          </motion.button>
        </section>

        {/* Danger Zone */}
        <section className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-display font-semibold mb-2 text-destructive">Danger Zone</h2>
          <p className="text-muted-foreground mb-6 max-w-xl">
            These actions are irreversible. Please proceed with caution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetFinancialData}
              className="flex-1 rounded-2xl bg-destructive text-destructive-foreground font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all shadow-sm hover:bg-destructive/90"
            >
              <AlertTriangle size={20} /> Reset Financial Data
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetProfile}
              className="flex-1 rounded-2xl bg-background border border-destructive text-destructive font-semibold py-4 px-6 flex items-center justify-center gap-2 transition-all hover:bg-destructive/10"
            >
              <UserX size={20} /> Reset Profile
            </motion.button>
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
