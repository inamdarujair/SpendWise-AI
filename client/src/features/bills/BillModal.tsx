import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import api from '../../lib/api';
import { format } from 'date-fns';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bill?: any;
}

export const BillModal: React.FC<BillModalProps> = ({ isOpen, onClose, onSuccess, bill }) => {
  const isEdit = !!bill;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      amount: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      category: 'Bills',
      recurrence: 'monthly',
      paid: false
    }
  });

  useEffect(() => {
    if (isOpen && bill) {
      reset({
        name: bill.name,
        amount: (bill.amountMinorUnits / 100).toString(),
        dueDate: format(new Date(bill.dueDate), 'yyyy-MM-dd'),
        category: bill.category || 'Bills',
        recurrence: bill.recurrence || 'monthly',
        paid: bill.paid || false
      });
    } else if (isOpen && !bill) {
      reset({
        name: '',
        amount: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        category: 'Bills',
        recurrence: 'monthly',
        paid: false
      });
    }
  }, [isOpen, bill, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        amountMinorUnits: Math.round(parseFloat(data.amount) * 100),
      };
      if (isEdit) {
        return api.patch(`/bills/${bill._id}`, payload);
      }
      return api.post('/bills', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Bill ${isEdit ? 'updated' : 'added'} successfully`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save bill');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Bill' : 'Add Bill'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Bill Name"
          placeholder="e.g. Electricity, Netflix"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message as string}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount', { required: 'Amount is required', min: 0.01 })}
            error={errors.amount?.message as string}
          />
          <Input
            label="Due Date"
            type="date"
            {...register('dueDate', { required: 'Date is required' })}
            error={errors.dueDate?.message as string}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={[
              { value: 'Bills', label: 'Utility Bills' },
              { value: 'Transport', label: 'Transport' },
              { value: 'Entertainment', label: 'Entertainment' },
              { value: 'Healthcare', label: 'Healthcare' },
              { value: 'Others', label: 'Others' },
            ]}
            {...register('category')}
          />
          <Select
            label="Recurrence"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'one-time', label: 'One-time' },
            ]}
            {...register('recurrence')}
          />
        </div>

        <div className="flex items-center mt-2">
          <input
            id="paid-checkbox"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('paid')}
          />
          <label htmlFor="paid-checkbox" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Mark as Paid
          </label>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};
