import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import api from '../../lib/api';
import { format } from 'date-fns';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  transaction?: any;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess, transaction }) => {
  const isEdit = !!transaction;
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      type: 'expense',
      amount: '',
      categoryId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    }
  });

  const type = watch('type');

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen && transaction) {
      reset({
        type: transaction.type,
        amount: (transaction.amountMinorUnits / 100).toString(),
        categoryId: transaction.categoryId?._id || '',
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        notes: transaction.notes || ''
      });
    } else if (isOpen && !transaction) {
      reset({
        type: 'expense',
        amount: '',
        categoryId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    }
  }, [isOpen, transaction, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        amountMinorUnits: Math.round(parseFloat(data.amount) * 100)
      };
      if (isEdit) {
        return api.patch(`/transactions/${transaction._id}`, payload);
      }
      return api.post('/transactions', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Transaction ${isEdit ? 'updated' : 'added'} successfully`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save transaction');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const categories = categoriesData || [];
  const filteredCategories = categories.filter((c: any) => c.type === type || !c.type);
  const categoryOptions = filteredCategories.map((c: any) => ({ value: c._id, label: c.name }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'expense' ? 'bg-white dark:bg-gray-700 shadow-sm text-red-600' : 'text-gray-500'}`}
            onClick={() => setValue('type', 'expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600' : 'text-gray-500'}`}
            onClick={() => setValue('type', 'income')}
          >
            Income
          </button>
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Must be > 0' } })}
          error={errors.amount?.message as string}
        />

        <Select
          label="Category"
          options={categoryOptions}
          placeholder={loadingCategories ? 'Loading...' : 'Select a category'}
          {...register('categoryId', { required: 'Category is required' })}
          error={errors.categoryId?.message as string}
        />

        <Input
          label="Date"
          type="date"
          {...register('date', { required: 'Date is required' })}
          error={errors.date?.message as string}
        />

        <Input
          label="Notes (Optional)"
          as="textarea"
          placeholder="Enter notes..."
          {...register('notes')}
        />

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};
