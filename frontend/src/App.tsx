import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import Onboarding from "./pages/Onboarding";

// App pages — no auth guard, direct access
import DashboardPage from "./pages/app/Dashboard";
import TransactionsPage from "./pages/app/Transactions";
import BudgetsPage from "./pages/app/Budgets";
import CategoriesPage from "./pages/app/Categories";
import RecurringPage from "./pages/app/RecurringExpenses";
import SavingsGoalsPage from "./pages/app/SavingsGoals";
import ReportsPage from "./pages/app/Reports";
import ProfilePage from "./pages/app/Profile";

export default function App() {
  const location = useLocation();
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            borderRadius: "1rem",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PageTransition>
                <Onboarding />
              </PageTransition>
            }
          />

          {/* App — no auth required */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/transactions" element={<TransactionsPage />} />
          <Route path="/dashboard/budgets" element={<BudgetsPage />} />
          <Route path="/dashboard/categories" element={<CategoriesPage />} />
          <Route path="/dashboard/recurring" element={<RecurringPage />} />
          <Route path="/dashboard/savings" element={<SavingsGoalsPage />} />
          <Route path="/dashboard/reports" element={<ReportsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
