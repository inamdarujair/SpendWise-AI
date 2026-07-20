import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import DashboardLayout from './features/dashboard/DashboardLayout';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';

const DashboardPage = React.lazy(() => import('./features/dashboard/DashboardPage'));
const TransactionsPage = React.lazy(() => import('./features/transactions/TransactionsPage'));
const BudgetsPage = React.lazy(() => import('./features/budgets/BudgetsPage'));
const GoalsPage = React.lazy(() => import('./features/goals/GoalsPage'));
const BillsPage = React.lazy(() => import('./features/bills/BillsPage'));
const ReportsPage = React.lazy(() => import('./features/reports/ReportsPage'));
const AIAssistantPage = React.lazy(() => import('./features/dashboard/AIAssistantPage'));
const SettingsPage = React.lazy(() => import('./features/settings/SettingsPage'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const SuspenseFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ color: '#64748b', fontSize: 14 }}>Loading...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>404</h1>
    <p style={{ color: '#64748b', marginBottom: 24 }}>Page not found</p>
    <a href="/dashboard" style={{ background: '#22c55e', color: 'white', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Go Home</a>
  </div>
);

const App = () => {
  React.useLayoutEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
