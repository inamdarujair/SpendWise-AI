import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Receipt, PiggyBank, Target, Calendar,
  BarChart2, Settings, LogOut, Menu, X, TrendingUp, Bot
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistant } from './AIAssistant';

const navItems = [
  { label: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
  { label: 'Transactions', path: '/transactions', icon: Receipt },
  { label: 'Budgets',      path: '/budgets',      icon: PiggyBank },
  { label: 'Goals',        path: '/goals',        icon: Target },
  { label: 'Bills',        path: '/bills',        icon: Calendar },
  { label: 'Reports',      path: '/reports',      icon: BarChart2 },
  { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
];

const SidebarInner: React.FC<{ onNavClick: () => void; onLogout: () => void }> = ({ onNavClick, onLogout }) => {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col h-full bg-[rgba(4,7,11,0.5)] backdrop-blur-2xl text-slate-300">
      {/* Logo Area */}
      <div className="pt-6 pb-4 px-6 flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-b from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[17px] font-extrabold text-white tracking-tight leading-none mb-1">
            SpendWise AI
          </div>
          <div className="text-[10px] text-emerald-500/90 font-bold tracking-[0.15em] uppercase leading-none">
            Personal Finance
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 custom-scrollbar pb-4 mt-2">
        <div className="px-6 mb-2">
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500/80">
            Main Menu
          </p>
        </div>
        
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavClick}
            className={({ isActive }) => 
              `group relative flex items-center gap-3.5 px-3.5 py-2.5 mx-3 rounded-[12px] text-[14px] font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-[rgba(16,185,129,0.1)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-[rgba(16,185,129,0.2)] backdrop-blur-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute -left-3 top-[20%] bottom-[20%] w-1 bg-emerald-400 rounded-r-full shadow-[0_0_15px_var(--neon-emerald),0_0_30px_var(--neon-teal)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`} 
                />
                <span className="truncate tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="px-6 mb-2 mt-6">
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500/80">
            Account
          </p>
        </div>
        <NavLink
          to="/settings"
          onClick={onNavClick}
          className={({ isActive }) => 
            `group relative flex items-center gap-3.5 px-3.5 py-2.5 mx-3 rounded-[12px] text-[14px] font-medium transition-all duration-300 ${
              isActive 
                ? 'bg-[rgba(16,185,129,0.1)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-[rgba(16,185,129,0.2)] backdrop-blur-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-indicator"
                  className="absolute -left-3 top-[20%] bottom-[20%] w-1 bg-emerald-400 rounded-r-full shadow-[0_0_15px_var(--neon-emerald),0_0_30px_var(--neon-teal)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Settings 
                size={18} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
                }`} 
              />
              <span className="truncate tracking-wide">Settings</span>
            </>
          )}
        </NavLink>
      </div>

      {/* User footer */}
      <div className="p-4 mt-auto">
        <div className="bg-[rgba(255,255,255,0.01)] border-t border-[rgba(255,255,255,0.08)] border-x border-b border-[rgba(255,255,255,0.03)] rounded-2xl overflow-hidden hover:bg-[rgba(255,255,255,0.04)] hover:shadow-[0_4px_24px_var(--neon-emerald)] transition-all duration-300 backdrop-blur-md">
          <div className="flex items-center gap-3 p-3.5 border-b border-[var(--border)]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0 text-sm ring-2 ring-white/10">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white m-0 truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-400 m-0 truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 text-[13px] font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
          >
            <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="app-shell flex font-sans min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[var(--sidebar-width)] flex-shrink-0 h-screen sticky top-0 z-10 border-r border-[var(--glass-border)] bg-transparent">
        <SidebarInner onNavClick={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar drawer */}
      <aside className={`fixed top-0 left-0 h-screen w-[280px] z-[101] bg-transparent transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden shadow-2xl border-r border-[var(--glass-border)]`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 z-10 bg-[rgba(255,255,255,0.1)] text-slate-300 hover:text-white hover:bg-[rgba(255,255,255,0.2)] p-2 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarInner onNavClick={() => setMobileOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-16 bg-[var(--bg-card)] backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-white">SpendWise AI</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-300 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
        
        {/* Floating AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
};

export default DashboardLayout;
