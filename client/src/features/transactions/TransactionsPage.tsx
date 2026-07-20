import React, { useState } from 'react';
import { formatCurrency } from '../../lib/format';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, Search, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { TransactionModal } from './TransactionModal';

const TransactionsPage = () => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [deleteConfirmTx, setDeleteConfirmTx] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, filterType],
    queryFn: async () => {
      const typeParam = filterType !== 'all' ? `&type=${filterType}` : '';
      const res = await api.get(`/transactions?page=${page}&limit=15&sort=date&order=desc${typeParam}`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Transaction deleted');
      setDeleteConfirmTx(null);
    },
    onError: () => {
      toast.error('Failed to delete transaction');
      setDeleteConfirmTx(null);
    }
  });

  const handleEdit = (tx: any) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const transactions = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const filteredTransactions = transactions.filter((tx: any) => 
    (tx.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (tx.category?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your income and expenses.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={handleAddNew} className="w-full sm:w-auto shadow-lg shadow-emerald-500/20">
            <Plus size={18} className="mr-2" /> Add Transaction
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="type-toggle w-full sm:w-auto">
            {['all', 'expense', 'income'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`type-toggle-btn capitalize ${filterType === type ? (type === 'income' ? 'active-income' : 'active-expense') : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-72 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search transactions..." 
              className="pl-11 border-none shadow-none bg-slate-100 dark:bg-slate-800" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
          ) : filteredTransactions.length > 0 ? (
            <table className="sw-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx: any) => (
                  <tr key={tx._id} className="group">
                    <td className="font-medium text-slate-500 dark:text-slate-400">
                      {format(new Date(tx.date), 'MMM d, yyyy')}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                          {tx.category?.icon || '🏷️'}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{tx.category?.name || 'Uncategorized'}</span>
                      </div>
                    </td>
                    <td className="text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {tx.notes || '-'}
                    </td>
                    <td className="text-right">
                      <span className={`font-extrabold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amountMinorUnits)}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(tx)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirmTx(tx)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState 
              icon={<ArrowRightLeft size={40} />}
              title="No transactions found"
              description="You haven't recorded any transactions matching your filters yet."
              action={{ label: 'Add Transaction', onClick: handleAddNew }}
            />
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm font-semibold text-slate-500">Page {page} of {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        )}
      </motion.div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTx}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirmTx}
        onClose={() => setDeleteConfirmTx(null)}
        onConfirm={() => deleteConfirmTx && deleteMutation.mutate(deleteConfirmTx._id)}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TransactionsPage;
