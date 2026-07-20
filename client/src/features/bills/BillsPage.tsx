import React, { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { Plus, Calendar, Pencil, Trash2, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { BillModal } from './BillModal';

const BillsPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const res = await api.get('/bills');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/bills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Bill deleted');
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast.error('Failed to delete bill');
      setDeleteConfirmId(null);
    }
  });

  const markPaidMutation = useMutation({
    mutationFn: async ({ id, paid }: { id: string, paid: boolean }) => {
      return api.patch(`/bills/${id}`, { paid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Bill status updated');
    },
    onError: () => {
      toast.error('Failed to update bill');
    }
  });

  const handleEdit = (bill: any) => {
    setEditingBill(bill);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingBill(null);
    setIsModalOpen(true);
  };

  const bills = data || [];
  
  const filteredBills = bills.filter((bill: any) => {
    const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
    if (filterType === 'all') return true;
    if (filterType === 'paid') return bill.paid;
    if (filterType === 'upcoming') return !bill.paid && daysUntilDue >= 0;
    if (filterType === 'overdue') return !bill.paid && daysUntilDue < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Upcoming Bills</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Never miss a payment again.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={handleAddNew} className="w-full sm:w-auto shadow-lg shadow-emerald-500/20">
            <Plus size={18} className="mr-2" /> Add Bill
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex space-x-2 overflow-x-auto custom-scrollbar">
          <div className="type-toggle w-full sm:w-auto">
            {['all', 'upcoming', 'overdue', 'paid'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`type-toggle-btn capitalize ${filterType === type ? 'active-income' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
          ) : filteredBills.length > 0 ? (
            <table className="sw-table">
              <thead>
                <tr>
                  <th>Bill Name</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill: any) => {
                  const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
                  const isOverdue = !bill.paid && daysUntilDue < 0;
                  const isDueSoon = !bill.paid && daysUntilDue >= 0 && daysUntilDue <= 7;
                  
                  return (
                    <tr key={bill._id} className={`group ${bill.paid ? 'opacity-50 hover:opacity-100' : ''}`}>
                      <td>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${bill.paid ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : isOverdue ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 'bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'}`}>
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className={`font-bold text-lg mb-0.5 ${bill.paid ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>{bill.name}</p>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{bill.category} • {bill.recurrence}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-extrabold text-slate-900 dark:text-white text-lg">
                        {formatCurrency(bill.amountMinorUnits)}
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className={`text-sm ${isOverdue ? 'text-red-500 font-bold' : isDueSoon ? 'text-amber-500 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                            {format(new Date(bill.dueDate), 'MMM d, yyyy')}
                          </span>
                          {isOverdue && <AlertCircle size={16} className="text-red-500 ml-2" />}
                        </div>
                        {!bill.paid && (
                          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : daysUntilDue === 0 ? 'Due today' : `in ${daysUntilDue} days`}
                          </p>
                        )}
                      </td>
                      <td>
                        {bill.paid ? (
                          <Badge variant="green" className="shadow-sm border border-emerald-200 dark:border-emerald-800">Paid</Badge>
                        ) : isOverdue ? (
                          <Badge variant="red" className="shadow-sm border border-red-200 dark:border-red-800">Overdue</Badge>
                        ) : isDueSoon ? (
                          <Badge variant="yellow" className="shadow-sm border border-amber-200 dark:border-amber-800">Due Soon</Badge>
                        ) : (
                          <Badge variant="blue" className="shadow-sm border border-blue-200 dark:border-blue-800">Upcoming</Badge>
                        )}
                      </td>
                      <td>
                        <div className="flex justify-center items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant={bill.paid ? "ghost" : "secondary"} 
                            size="sm" 
                            onClick={() => markPaidMutation.mutate({ id: bill._id, paid: !bill.paid })}
                            isLoading={markPaidMutation.isPending && markPaidMutation.variables?.id === bill._id}
                            className={bill.paid ? '' : 'shadow-sm'}
                          >
                            <Check size={16} className={`mr-1 ${bill.paid ? 'text-slate-400' : 'text-emerald-500'}`} />
                            {bill.paid ? 'Unmark' : 'Mark Paid'}
                          </Button>
                          <button onClick={() => handleEdit(bill)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(bill._id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState 
              icon={<Calendar size={40} />}
              title={`No ${filterType !== 'all' ? filterType : ''} bills found`}
              description="Keep track of your recurring subscriptions and utility bills here."
              action={{ label: 'Add Bill', onClick: handleAddNew }}
            />
          )}
        </div>
      </motion.div>

      <BillModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bill={editingBill}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
        title="Delete Bill"
        description="Are you sure you want to delete this bill? This will not refund any payments already made."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default BillsPage;
