import React, { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Target, Pencil, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { GoalModal } from './GoalModal';
import { AddSavingsModal } from './AddSavingsModal';

const GoalsPage = () => {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const res = await api.get('/goals');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Goal deleted');
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast.error('Failed to delete goal');
      setDeleteConfirmId(null);
    }
  });

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleAddSavings = (goal: any) => {
    setSelectedGoal(goal);
    setIsSavingsModalOpen(true);
  };

  const goals = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Savings Goals</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Track and achieve your financial targets.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={handleAddNew} className="w-full sm:w-auto shadow-lg shadow-emerald-500/20">
            <Plus size={18} className="mr-2" /> New Goal
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
          {goals.map((goal: any) => {
            const percentage = Math.min(100, Math.round((goal.currentAmountMinorUnits / goal.targetAmountMinorUnits) * 100));
            const isCompleted = goal.status === 'completed' || percentage >= 100;
            
            return (
              <Card key={goal._id} className="relative group overflow-hidden border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${goal.color || '#3b82f6'}, #0f172a)` }}
                      >
                        <Target size={28} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">{goal.name}</h4>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Due {format(new Date(goal.deadline), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      <button onClick={() => handleEdit(goal)} className="text-slate-400 hover:text-blue-500 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirmId(goal._id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-lg">
                          {formatCurrency(goal.currentAmountMinorUnits)}
                        </span>
                        <span className="text-slate-500 font-semibold self-end">
                          of {formatCurrency(goal.targetAmountMinorUnits)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3.5 dark:bg-slate-800 overflow-hidden shadow-inner">
                        <div 
                          className="h-3.5 rounded-full transition-all duration-1000 relative overflow-hidden" 
                          style={{ width: `${percentage}%`, backgroundColor: goal.color || '#3b82f6' }}
                        >
                           <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <Badge variant="green" className="py-1 px-3 shadow-sm border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={14} className="mr-1.5" /> Completed
                          </Badge>
                        ) : (
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{percentage}% <span className="font-medium text-slate-400">Achieved</span></span>
                        )}
                      </div>
                      
                      {!isCompleted && (
                        <Button variant="secondary" size="sm" onClick={() => handleAddSavings(goal)} className="shadow-sm">
                          <PlusCircle size={16} className="mr-1.5 text-slate-400" /> Add Funds
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={<Target size={40} />}
          title="No savings goals yet"
          description="Set up financial goals like a vacation fund, emergency fund, or a new car."
          action={{ label: 'New Goal', onClick: handleAddNew }}
        />
      )}

      <GoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        goal={editingGoal}
      />

      <AddSavingsModal 
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        goal={selectedGoal}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? The saved funds will just become regular unallocated money."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default GoalsPage;
