import React, { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subMonths, addMonths } from 'date-fns';
import { Plus, PiggyBank, Pencil, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { BudgetModal } from './BudgetModal';

const BudgetsPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const period = format(currentDate, 'yyyy-MM');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['budgets', period],
    queryFn: async () => {
      const res = await api.get(`/budgets?period=${period}&scope=monthly`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Budget deleted');
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast.error('Failed to delete budget');
      setDeleteConfirmId(null);
    }
  });

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const budgets = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Budgets</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Keep your spending in check.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-1">
            <button onClick={() => setCurrentDate(prev => subMonths(prev, 1))} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-sm w-36 text-center tracking-wide">{format(currentDate, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentDate(prev => addMonths(prev, 1))} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <Button onClick={handleAddNew} className="shadow-lg shadow-emerald-500/20">
            <Plus size={18} className="mr-2" /> Create Budget
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {budgets.map((budget: any) => {
            const util = budget.utilizationPercentage;
            const isOver = util > 100;
            const color = isOver ? 'red' : util > 85 ? 'yellow' : 'green';
            
            return (
              <Card key={budget._id} className="relative group hover:border-emerald-500/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                        {budget.category?.icon || '💰'}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">{budget.category?.name || 'Category'}</h4>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{util.toFixed(1)}% used</p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button onClick={() => handleEdit(budget)} className="text-slate-400 hover:text-blue-500 p-1.5 rounded hover:bg-white dark:hover:bg-slate-800">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(budget._id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-white dark:hover:bg-slate-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {formatCurrency(budget.spentMinorUnits)}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 ml-1">spent</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {formatCurrency(budget.limitMinorUnits)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1 block">limit</span>
                      </div>
                    </div>
                    
                    <ProgressBar value={util} color={color} />
                    
                    {isOver && (
                      <div className="flex items-center text-xs font-bold text-red-600 mt-2 bg-red-50 dark:bg-red-500/10 p-2.5 rounded-lg border border-red-100 dark:border-red-500/20">
                        <AlertTriangle size={14} className="mr-1.5" /> Over budget by {formatCurrency(budget.spentMinorUnits - budget.limitMinorUnits)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={<PiggyBank size={40} />}
          title="No budgets for this month"
          description="Create budgets to track your spending limits and save more."
          action={{ label: 'Create Budget', onClick: handleAddNew }}
        />
      )}

      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        budget={editingBudget}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
        title="Delete Budget"
        description="Are you sure you want to delete this budget?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default BudgetsPage;
