/**
 * Local data store — replaces Supabase entirely.
 * All data persists in localStorage so it survives page refreshes.
 */

import { v4 as uuid } from "./uuid";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  transaction_type: "income" | "expense";
  category_id: string | null;
  transaction_date: string;
  notes: string | null;
  created_at: string;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: "monthly" | "weekly" | "yearly";
  category_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  next_date: string;
  status: "active" | "paused";
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  color: string;
  target_date: string | null;
  created_at: string;
}

export interface Profile {
  display_name: string;
  currency: string;
  monthly_income: number;
  is_onboarded: boolean;
  avatar?: string;
  tour_completed?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Food & Dining",
    icon: "utensils",
    color: "#ff7b00",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Transport",
    icon: "transport",
    color: "#38bdf8",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Shopping",
    icon: "shopping",
    color: "#d1ff26",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Entertainment",
    icon: "entertainment",
    color: "#9b5de5",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Health",
    icon: "health",
    color: "#00c878",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Utilities",
    icon: "utilities",
    color: "#f59e0b",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const SEED_TRANSACTIONS: Transaction[] = [];

const SEED_BUDGETS: Budget[] = [];

const SEED_RECURRING: RecurringExpense[] = [];

const SEED_GOALS: SavingsGoal[] = [];

const DEFAULT_PROFILE: Profile = {
  display_name: "",
  currency: "₹",
  monthly_income: 90000,
  is_onboarded: false,
  tour_completed: false,
};

// ─── Storage helpers ─────────────────────────────────────────────────────────
function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Store class ─────────────────────────────────────────────────────────────
class LocalStore {
  // Listeners for re-render triggering
  private listeners = new Set<() => void>();

  // In-memory cache for stable references
  private profile = load("samriddhi_profile", DEFAULT_PROFILE);
  private transactions = load("samriddhi_transactions", SEED_TRANSACTIONS).sort((a, b) =>
    b.transaction_date.localeCompare(a.transaction_date),
  );
  private budgets = load("samriddhi_budgets", SEED_BUDGETS);
  private categories = load("samriddhi_categories", SEED_CATEGORIES);
  private recurring = load("samriddhi_recurring", SEED_RECURRING);
  private goals = load("samriddhi_goals", SEED_GOALS);
  private notifications = load("samriddhi_notifications", [] as Notification[]);

  subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Profile
  getProfile(): Profile {
    return this.profile;
  }
  updateProfile(p: Partial<Profile>): Profile {
    this.profile = { ...this.profile, ...p };
    save("samriddhi_profile", this.profile);
    this.notify();
    return this.profile;
  }

  // Transactions
  getTransactions(): Transaction[] {
    return this.transactions;
  }
  addTransaction(tx: Omit<Transaction, "id" | "created_at">): Transaction {
    const item: Transaction = { ...tx, id: uuid(), created_at: new Date().toISOString() };
    this.transactions = [item, ...this.transactions].sort((a, b) =>
      b.transaction_date.localeCompare(a.transaction_date),
    );
    save("samriddhi_transactions", this.transactions);

    this.addNotification({
      title: tx.transaction_type === "expense" ? "New Expense Added" : "Income Received",
      description: `Recorded ${this.profile.currency}${tx.amount.toLocaleString("en-IN")} for ${tx.merchant}.`,
    });

    this.notify();
    return item;
  }
  updateTransaction(id: string, updates: Partial<Transaction>): void {
    this.transactions = this.transactions
      .map((t) => (t.id === id ? { ...t, ...updates } : t))
      .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
    save("samriddhi_transactions", this.transactions);
    this.notify();
  }
  deleteTransaction(id: string): void {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    save("samriddhi_transactions", this.transactions);
    this.notify();
  }

  // Budgets
  getBudgets(): Budget[] {
    return this.budgets;
  }
  addBudget(b: Omit<Budget, "id" | "created_at">): Budget {
    const item: Budget = { ...b, id: uuid(), created_at: new Date().toISOString() };
    this.budgets = [...this.budgets, item];
    save("samriddhi_budgets", this.budgets);
    this.notify();
    return item;
  }
  updateBudget(id: string, updates: Partial<Budget>): void {
    this.budgets = this.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b));
    save("samriddhi_budgets", this.budgets);
    this.notify();
  }
  deleteBudget(id: string): void {
    this.budgets = this.budgets.filter((b) => b.id !== id);
    save("samriddhi_budgets", this.budgets);
    this.notify();
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }
  addCategory(c: Omit<Category, "id" | "created_at">): Category {
    const item: Category = { ...c, id: uuid(), created_at: new Date().toISOString() };
    this.categories = [...this.categories, item];
    save("samriddhi_categories", this.categories);
    this.notify();
    return item;
  }
  deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
    save("samriddhi_categories", this.categories);
    this.notify();
  }

  // Recurring Expenses
  getRecurringExpenses(): RecurringExpense[] {
    return this.recurring;
  }
  addRecurringExpense(r: Omit<RecurringExpense, "id" | "created_at">): RecurringExpense {
    const item: RecurringExpense = { ...r, id: uuid(), created_at: new Date().toISOString() };
    this.recurring = [...this.recurring, item];
    save("samriddhi_recurring", this.recurring);
    this.notify();
    return item;
  }
  updateRecurringExpense(id: string, updates: Partial<RecurringExpense>): void {
    this.recurring = this.recurring.map((r) => (r.id === id ? { ...r, ...updates } : r));
    save("samriddhi_recurring", this.recurring);
    this.notify();
  }
  deleteRecurringExpense(id: string): void {
    this.recurring = this.recurring.filter((r) => r.id !== id);
    save("samriddhi_recurring", this.recurring);
    this.notify();
  }

  // Savings Goals
  getSavingsGoals(): SavingsGoal[] {
    return this.goals;
  }
  addSavingsGoal(g: Omit<SavingsGoal, "id" | "created_at">): SavingsGoal {
    const item: SavingsGoal = { ...g, id: uuid(), created_at: new Date().toISOString() };
    this.goals = [...this.goals, item];
    save("samriddhi_goals", this.goals);
    this.notify();
    return item;
  }
  updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): void {
    this.goals = this.goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
    save("samriddhi_goals", this.goals);
    this.notify();
  }
  deleteSavingsGoal(id: string): void {
    this.goals = this.goals.filter((g) => g.id !== id);
    save("samriddhi_goals", this.goals);
    this.notify();
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }
  addNotification(n: Omit<Notification, "id" | "created_at" | "is_read">): void {
    const item: Notification = {
      ...n,
      id: uuid(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications = [item, ...this.notifications];
    save("samriddhi_notifications", this.notifications);
    this.notify();
  }
  markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    save("samriddhi_notifications", this.notifications);
    this.notify();
  }
  markAllNotificationsAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, is_read: true }));
    save("samriddhi_notifications", this.notifications);
    this.notify();
  }

  // Reset financial data (keeps profile)
  resetFinancialData(): void {
    localStorage.removeItem("samriddhi_transactions");
    localStorage.removeItem("samriddhi_budgets");
    localStorage.removeItem("samriddhi_categories");
    localStorage.removeItem("samriddhi_recurring");
    localStorage.removeItem("samriddhi_goals");
    localStorage.removeItem("samriddhi_notifications");

    this.transactions = SEED_TRANSACTIONS;
    this.budgets = SEED_BUDGETS;
    this.categories = SEED_CATEGORIES;
    this.recurring = SEED_RECURRING;
    this.goals = SEED_GOALS;
    this.notifications = [];

    save("samriddhi_transactions", this.transactions);
    save("samriddhi_budgets", this.budgets);
    save("samriddhi_categories", this.categories);
    save("samriddhi_recurring", this.recurring);
    save("samriddhi_goals", this.goals);
    save("samriddhi_notifications", this.notifications);

    this.notify();
  }

  // Reset profile (keeps financial data)
  resetProfile(): void {
    localStorage.removeItem("samriddhi_profile");
    this.profile = DEFAULT_PROFILE;
    save("samriddhi_profile", this.profile);
    this.notify();
  }

  // Reset entirely
  resetAll(): void {
    localStorage.removeItem("samriddhi_profile");
    localStorage.removeItem("samriddhi_transactions");
    localStorage.removeItem("samriddhi_budgets");
    localStorage.removeItem("samriddhi_categories");
    localStorage.removeItem("samriddhi_recurring");
    localStorage.removeItem("samriddhi_goals");
    localStorage.removeItem("samriddhi_notifications");

    // Reset in-memory state
    this.profile = DEFAULT_PROFILE;
    this.transactions = SEED_TRANSACTIONS;
    this.budgets = SEED_BUDGETS;
    this.categories = SEED_CATEGORIES;
    this.recurring = SEED_RECURRING;
    this.goals = SEED_GOALS;
    this.notifications = [];

    // Re-initialize local storage with defaults/seeds
    save("samriddhi_profile", this.profile);
    save("samriddhi_transactions", this.transactions);
    save("samriddhi_budgets", this.budgets);
    save("samriddhi_categories", this.categories);
    save("samriddhi_recurring", this.recurring);
    save("samriddhi_goals", this.goals);
    save("samriddhi_notifications", this.notifications);

    this.notify();
  }
}

export const store = new LocalStore();
