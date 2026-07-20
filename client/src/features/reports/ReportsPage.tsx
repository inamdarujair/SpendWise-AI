import React, { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery } from '@tanstack/react-query';
import { Download, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import api from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { StatCard } from '../../components/ui/StatCard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsPage = () => {
  const [period, setPeriod] = useState('6'); // months
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', period], 
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    }
  });

  const handleExport = async () => {
    try {
      const res = await api.get('/transactions?limit=1000'); 
      const txs = res.data.data;
      
      const csvContent = [
        ['Date', 'Type', 'Category', 'Amount', 'Notes'].join(','),
        ...txs.map((t: any) => [
          format(new Date(t.date), 'yyyy-MM-dd'),
          t.type,
          `"${t.category?.name || ''}"`,
          (t.amountMinorUnits / 100).toFixed(2),
          `"${(t.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `spendwise-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const { summary, monthlyTrend, categoryBreakdown } = data || {};
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f87171', '#34d399'];

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Reports</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Analyze your spending patterns.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center space-x-3 w-full sm:w-auto">
          <Select 
            options={[
              { value: '3', label: 'Last 3 Months' },
              { value: '6', label: 'Last 6 Months' },
              { value: '12', label: 'Last Year' },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-48 shadow-sm"
          />
          <Button variant="secondary" onClick={handleExport} className="shadow-sm">
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
        </motion.div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {['overview', 'expenses'].map((tab) => (
          <button
            key={tab}
            className={`py-3 px-8 font-bold text-sm tracking-wide uppercase transition-colors relative whitespace-nowrap ${
              activeTab === tab ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="tab-indicator" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" 
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
           <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 flex justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
           </motion.div>
        ) : activeTab === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
              <StatCard title="Total Income" value={formatCurrency(summary?.income || 0)} icon={<TrendingUp size={24} />} color="green" />
              <StatCard title="Total Expenses" value={formatCurrency(summary?.expense || 0)} icon={<PieChartIcon size={24} />} color="red" />
              <StatCard title="Net Savings" value={formatCurrency(summary?.netCashFlow || 0)} icon={<BarChart2 size={24} />} color="blue" />
              <StatCard title="Savings Rate" value={`${summary?.savingsRate || 0}%`} icon={<TrendingUp size={24} />} color="purple" />
            </div>

            <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle>Income vs Expenses (Last {period} Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrend} margin={{ top: 20, right: 10, left: -20, bottom: 5 }} barGap={8}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(148,163,184,0.2)" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/100}`} dx={-10} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="expenses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={130}
                        paddingAngle={4}
                        dataKey="value"
                        labelLine={false}
                        stroke="none"
                      >
                        {categoryBreakdown?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryBreakdown?.map((cat: any, i: number) => {
                    const percentage = (cat.value / (summary?.expense || 1)) * 100;
                    const color = cat.color || COLORS[i % COLORS.length];
                    return (
                      <div key={cat.name} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: color }}></span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                          </div>
                          <span className="text-slate-900 dark:text-white font-extrabold">{formatCurrency(cat.value)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 dark:bg-slate-800 overflow-hidden shadow-inner">
                          <div 
                            className="h-2.5 rounded-full relative overflow-hidden" 
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          >
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
