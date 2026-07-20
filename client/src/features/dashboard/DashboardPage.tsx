import React from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, Target, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const CircularProgress = ({ score }: { score: number }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          stroke="white"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Failed to load dashboard data. 
        {error instanceof Error && <p className="text-sm text-red-400 mt-2">{error.message}</p>}
      </div>
    );
  }

  const { summary, healthScore, healthStatus, monthlyTrend, categoryBreakdown, budgets, recentTransactions } = data;

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl text-white">
          <p className="text-slate-300 mb-2 font-semibold text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300">{entry.name}:</span>
              <span className="font-bold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track your financial pulse with precision.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-6 w-full lg:w-auto relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <CircularProgress score={healthScore || 0} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-emerald-200" />
              <p className="text-emerald-100 text-sm font-bold tracking-widest uppercase">Financial Health</p>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="text-2xl font-extrabold">{healthStatus || 'Good'}</h3>
              <p className="text-emerald-100 text-xs font-medium max-w-[200px]">Keep saving and reduce unnecessary expenses to reach Excellent.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary?.totalBalance || 0)}
          icon={<Wallet size={24} />}
          color="blue"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.income || 0)}
          icon={<ArrowDownRight size={24} />}
          color="green"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.expense || 0)}
          icon={<ArrowUpRight size={24} />}
          color="red"
          trend={{ value: 4, positive: false }}
        />
        <StatCard
          title="Net Cash Flow"
          value={formatCurrency(summary?.netCashFlow || 0)}
          icon={<DollarSign size={24} />}
          color="purple"
        />
        <StatCard
          title="Monthly Savings"
          value={formatCurrency(summary?.netCashFlow || 0)}
          icon={<Wallet size={24} />}
          color="green"
        />
        <StatCard
          title="Savings Rate"
          value={`${summary?.savingsRate || 0}%`}
          icon={<Target size={24} />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Cash Flow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/100}`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {categoryBreakdown && categoryBreakdown.length > 0 ? (
              <div className="h-[22rem] w-full flex flex-col">
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {categoryBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-3 max-h-32 overflow-y-auto custom-scrollbar px-2">
                  {categoryBreakdown.map((cat: any, i: number) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color || COLORS[i % COLORS.length] }}></div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 font-medium">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {budgets && budgets.length > 0 ? budgets.slice(0, 4).map((budget: any) => {
              const util = budget.utilizationPercentage;
              const color = util < 75 ? 'green' : util < 90 ? 'yellow' : 'red';
              return (
                <div key={budget._id} className="group">
                  <ProgressBar 
                    value={util} 
                    color={color} 
                    label={budget.category?.name || 'Category'} 
                    showLabel 
                  />
                  <div className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 text-right">
                    {formatCurrency(budget.spentMinorUnits)} / {formatCurrency(budget.limitMinorUnits)}
                  </div>
                </div>
              )
            }) : <p className="text-slate-400 text-sm font-medium">No active budgets.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions && recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
                <div key={tx._id} className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                      {tx.category?.icon || '💰'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{tx.category?.name || 'Uncategorized'}</p>
                      <p className="text-xs font-medium text-slate-500">{format(new Date(tx.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className={`font-extrabold text-base ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amountMinorUnits)}
                  </div>
                </div>
              )) : <p className="text-slate-400 text-sm font-medium">No recent transactions.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
