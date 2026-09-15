/**
 * Local data store — replaces Supabase entirely.
 * All data persists in localStorage so it survives page refreshes.
 */

import { v4 as uuid } from './uuid';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  transaction_type: 'income' | 'expense';
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
  period: 'monthly' | 'weekly' | 'yearly';
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
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  next_date: string;
  status: 'active' | 'paused';
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
}

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: '🍔', color: '#ff7b00', created_at: '2026-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Transport', icon: '🚗', color: '#38bdf8', created_at: '2026-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Shopping', icon: '🛒', color: '#d1ff26', created_at: '2026-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Entertainment', icon: '🎬', color: '#9b5de5', created_at: '2026-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Health', icon: '💊', color: '#00c878', created_at: '2026-01-01T00:00:00Z' },
  { id: 'cat-6', name: 'Utilities', icon: '💡', color: '#f59e0b', created_at: '2026-01-01T00:00:00Z' },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', merchant: 'Salary', amount: 75000, transaction_type: 'income', category_id: null, transaction_date: '2026-09-01', notes: 'Monthly salary', created_at: '2026-09-01T00:00:00Z' },
  { id: 'tx-2', merchant: 'Swiggy', amount: 450, transaction_type: 'expense', category_id: 'cat-1', transaction_date: '2026-09-03', notes: null, created_at: '2026-09-03T00:00:00Z' },
  { id: 'tx-3', merchant: 'Ola Cabs', amount: 280, transaction_type: 'expense', category_id: 'cat-2', transaction_date: '2026-09-04', notes: null, created_at: '2026-09-04T00:00:00Z' },
  { id: 'tx-4', merchant: 'Amazon', amount: 2200, transaction_type: 'expense', category_id: 'cat-3', transaction_date: '2026-09-05', notes: 'Electronics', created_at: '2026-09-05T00:00:00Z' },
  { id: 'tx-5', merchant: 'Netflix', amount: 649, transaction_type: 'expense', category_id: 'cat-4', transaction_date: '2026-09-06', notes: null, created_at: '2026-09-06T00:00:00Z' },
  { id: 'tx-6', merchant: 'Apollo Pharmacy', amount: 890, transaction_type: 'expense', category_id: 'cat-5', transaction_date: '2026-09-07', notes: null, created_at: '2026-09-07T00:00:00Z' },
  { id: 'tx-7', merchant: 'Freelance Project', amount: 15000, transaction_type: 'income', category_id: null, transaction_date: '2026-09-10', notes: 'Web design project', created_at: '2026-09-10T00:00:00Z' },
  { id: 'tx-8', merchant: 'Zomato', amount: 380, transaction_type: 'expense', category_id: 'cat-1', transaction_date: '2026-09-11', notes: null, created_at: '2026-09-11T00:00:00Z' },
  { id: 'tx-9', merchant: 'BSNL Broadband', amount: 999, transaction_type: 'expense', category_id: 'cat-6', transaction_date: '2026-09-12', notes: null, created_at: '2026-09-12T00:00:00Z' },
  { id: 'tx-10', merchant: 'Reliance Smart', amount: 3200, transaction_type: 'expense', category_id: 'cat-3', transaction_date: '2026-09-14', notes: 'Grocery shopping', created_at: '2026-09-14T00:00:00Z' },
  // Previous months for charts
  { id: 'tx-11', merchant: 'Salary', amount: 75000, transaction_type: 'income', category_id: null, transaction_date: '2026-08-01', notes: null, created_at: '2026-08-01T00:00:00Z' },
  { id: 'tx-12', merchant: 'Monthly Expenses', amount: 22000, transaction_type: 'expense', category_id: 'cat-1', transaction_date: '2026-08-15', notes: null, created_at: '2026-08-15T00:00:00Z' },
  { id: 'tx-13', merchant: 'Salary', amount: 75000, transaction_type: 'income', category_id: null, transaction_date: '2026-07-01', notes: null, created_at: '2026-07-01T00:00:00Z' },
  { id: 'tx-14', merchant: 'Monthly Expenses', amount: 19500, transaction_type: 'expense', category_id: 'cat-2', transaction_date: '2026-07-15', notes: null, created_at: '2026-07-15T00:00:00Z' },
  { id: 'tx-15', merchant: 'Salary', amount: 75000, transaction_type: 'income', category_id: null, transaction_date: '2026-06-01', notes: null, created_at: '2026-06-01T00:00:00Z' },
  { id: 'tx-16', merchant: 'Monthly Expenses', amount: 25000, transaction_type: 'expense', category_id: 'cat-3', transaction_date: '2026-06-15', notes: null, created_at: '2026-06-15T00:00:00Z' },
  { id: 'tx-17', merchant: 'Salary', amount: 68000, transaction_type: 'income', category_id: null, transaction_date: '2026-05-01', notes: null, created_at: '2026-05-01T00:00:00Z' },
  { id: 'tx-18', merchant: 'Monthly Expenses', amount: 21000, transaction_type: 'expense', category_id: null, transaction_date: '2026-05-15', notes: null, created_at: '2026-05-15T00:00:00Z' },
  { id: 'tx-19', merchant: 'Salary', amount: 68000, transaction_type: 'income', category_id: null, transaction_date: '2026-04-01', notes: null, created_at: '2026-04-01T00:00:00Z' },
  { id: 'tx-20', merchant: 'Monthly Expenses', amount: 18500, transaction_type: 'expense', category_id: null, transaction_date: '2026-04-15', notes: null, created_at: '2026-04-15T00:00:00Z' },
];

const SEED_BUDGETS: Budget[] = [
  { id: 'bud-1', name: 'Food & Dining', amount: 8000, spent: 5820, period: 'monthly', category_id: 'cat-1', created_at: '2026-09-01T00:00:00Z' },
  { id: 'bud-2', name: 'Transport', amount: 3000, spent: 1840, period: 'monthly', category_id: 'cat-2', created_at: '2026-09-01T00:00:00Z' },
  { id: 'bud-3', name: 'Shopping', amount: 5000, spent: 5400, period: 'monthly', category_id: 'cat-3', created_at: '2026-09-01T00:00:00Z' },
  { id: 'bud-4', name: 'Entertainment', amount: 2000, spent: 649, period: 'monthly', category_id: 'cat-4', created_at: '2026-09-01T00:00:00Z' },
];

const SEED_RECURRING: RecurringExpense[] = [
  { id: 're-1', name: 'Netflix', amount: 649, frequency: 'monthly', next_date: '2026-10-06', status: 'active', created_at: '2026-01-01T00:00:00Z' },
  { id: 're-2', name: 'BSNL Broadband', amount: 999, frequency: 'monthly', next_date: '2026-10-12', status: 'active', created_at: '2026-01-01T00:00:00Z' },
  { id: 're-3', name: 'Gym Membership', amount: 1500, frequency: 'monthly', next_date: '2026-10-01', status: 'active', created_at: '2026-01-01T00:00:00Z' },
  { id: 're-4', name: 'Spotify', amount: 119, frequency: 'monthly', next_date: '2026-10-08', status: 'paused', created_at: '2026-01-01T00:00:00Z' },
];

const SEED_GOALS: SavingsGoal[] = [
  { id: 'g-1', name: 'Emergency Fund', target_amount: 200000, current_amount: 85000, color: '#00c878', target_date: '2027-06-01', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g-2', name: 'New Laptop', target_amount: 80000, current_amount: 32000, color: '#38bdf8', target_date: '2027-01-01', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g-3', name: 'Vacation - Goa', target_amount: 50000, current_amount: 50000, color: '#ff7b00', target_date: '2026-12-01', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g-4', name: 'Home Down Payment', target_amount: 1000000, current_amount: 120000, color: '#9b5de5', target_date: '2030-01-01', created_at: '2026-01-01T00:00:00Z' },
];

const DEFAULT_PROFILE: Profile = {
  display_name: 'Arjun Kumar',
  currency: '₹',
  monthly_income: 90000,
};

// ─── Storage helpers ─────────────────────────────────────────────────────────
function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
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
  private profile = load('samriddhi_profile', DEFAULT_PROFILE);
  private transactions = load('samriddhi_transactions', SEED_TRANSACTIONS).sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
  private budgets = load('samriddhi_budgets', SEED_BUDGETS);
  private categories = load('samriddhi_categories', SEED_CATEGORIES);
  private recurring = load('samriddhi_recurring', SEED_RECURRING);
  private goals = load('samriddhi_goals', SEED_GOALS);

  subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Profile
  getProfile(): Profile { return this.profile; }
  updateProfile(p: Partial<Profile>): Profile {
    this.profile = { ...this.profile, ...p };
    save('samriddhi_profile', this.profile);
    this.notify();
    return this.profile;
  }

  // Transactions
  getTransactions(): Transaction[] { return this.transactions; }
  addTransaction(tx: Omit<Transaction, 'id' | 'created_at'>): Transaction {
    const item: Transaction = { ...tx, id: uuid(), created_at: new Date().toISOString() };
    this.transactions = [item, ...this.transactions].sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
    save('samriddhi_transactions', this.transactions);
    this.notify();
    return item;
  }
  updateTransaction(id: string, updates: Partial<Transaction>): void {
    this.transactions = this.transactions.map((t) => t.id === id ? { ...t, ...updates } : t).sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
    save('samriddhi_transactions', this.transactions);
    this.notify();
  }
  deleteTransaction(id: string): void {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    save('samriddhi_transactions', this.transactions);
    this.notify();
  }

  // Budgets
  getBudgets(): Budget[] { return this.budgets; }
  addBudget(b: Omit<Budget, 'id' | 'created_at'>): Budget {
    const item: Budget = { ...b, id: uuid(), created_at: new Date().toISOString() };
    this.budgets = [...this.budgets, item];
    save('samriddhi_budgets', this.budgets);
    this.notify();
    return item;
  }
  updateBudget(id: string, updates: Partial<Budget>): void {
    this.budgets = this.budgets.map((b) => b.id === id ? { ...b, ...updates } : b);
    save('samriddhi_budgets', this.budgets);
    this.notify();
  }
  deleteBudget(id: string): void {
    this.budgets = this.budgets.filter((b) => b.id !== id);
    save('samriddhi_budgets', this.budgets);
    this.notify();
  }

  // Categories
  getCategories(): Category[] { return this.categories; }
  addCategory(c: Omit<Category, 'id' | 'created_at'>): Category {
    const item: Category = { ...c, id: uuid(), created_at: new Date().toISOString() };
    this.categories = [...this.categories, item];
    save('samriddhi_categories', this.categories);
    this.notify();
    return item;
  }
  deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
    save('samriddhi_categories', this.categories);
    this.notify();
  }

  // Recurring Expenses
  getRecurringExpenses(): RecurringExpense[] { return this.recurring; }
  addRecurringExpense(r: Omit<RecurringExpense, 'id' | 'created_at'>): RecurringExpense {
    const item: RecurringExpense = { ...r, id: uuid(), created_at: new Date().toISOString() };
    this.recurring = [...this.recurring, item];
    save('samriddhi_recurring', this.recurring);
    this.notify();
    return item;
  }
  updateRecurringExpense(id: string, updates: Partial<RecurringExpense>): void {
    this.recurring = this.recurring.map((r) => r.id === id ? { ...r, ...updates } : r);
    save('samriddhi_recurring', this.recurring);
    this.notify();
  }
  deleteRecurringExpense(id: string): void {
    this.recurring = this.recurring.filter((r) => r.id !== id);
    save('samriddhi_recurring', this.recurring);
    this.notify();
  }

  // Savings Goals
  getSavingsGoals(): SavingsGoal[] { return this.goals; }
  addSavingsGoal(g: Omit<SavingsGoal, 'id' | 'created_at'>): SavingsGoal {
    const item: SavingsGoal = { ...g, id: uuid(), created_at: new Date().toISOString() };
    this.goals = [...this.goals, item];
    save('samriddhi_goals', this.goals);
    this.notify();
    return item;
  }
  updateSavingsGoal(id: string, updates: Partial<SavingsGoal>): void {
    this.goals = this.goals.map((g) => g.id === id ? { ...g, ...updates } : g);
    save('samriddhi_goals', this.goals);
    this.notify();
  }
  deleteSavingsGoal(id: string): void {
    this.goals = this.goals.filter((g) => g.id !== id);
    save('samriddhi_goals', this.goals);
    this.notify();
  }
}

export const store = new LocalStore();
