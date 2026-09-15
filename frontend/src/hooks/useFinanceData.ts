/**
 * useStore — React hook that subscribes to the local store and
 * triggers re-renders whenever store.notify() is called.
 * No Supabase, no network calls.
 */
import { useSyncExternalStore } from "react";
import { store } from "@/lib/store";

function subscribe(cb: () => void) {
  return store.subscribe(cb);
}

// Snapshot functions — one per collection
const snapTx = () => store.getTransactions();
const snapBudgets = () => store.getBudgets();
const snapCats = () => store.getCategories();
const snapRecurring = () => store.getRecurringExpenses();
const snapGoals = () => store.getSavingsGoals();
const snapProfile = () => store.getProfile();

export function useTransactions() {
  return useSyncExternalStore(subscribe, snapTx, snapTx);
}
export function useBudgets() {
  return useSyncExternalStore(subscribe, snapBudgets, snapBudgets);
}
export function useCategories() {
  return useSyncExternalStore(subscribe, snapCats, snapCats);
}
export function useRecurringExpenses() {
  return useSyncExternalStore(subscribe, snapRecurring, snapRecurring);
}
export function useSavingsGoals() {
  return useSyncExternalStore(subscribe, snapGoals, snapGoals);
}
export function useProfile() {
  return useSyncExternalStore(subscribe, snapProfile, snapProfile);
}

// Re-export store methods so pages can mutate without importing store directly
export { store };
