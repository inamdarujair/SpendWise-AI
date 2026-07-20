import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import api from '../../lib/api';
import { format, addMonths } from 'date-fns';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  budget?: any;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSuccess, budget }) => {
  const isEdit = !!budget;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      categoryId: '',
      limit: '',
      period: format(new Date(), 'yyyy-MM')
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen && budget) {
      reset({
        categoryId: budget.categoryId?._id || '',
        limit: (budget.limitMinorUnits / 100).toString(),
        period: budget.period
      });
    } else if (isOpen && !budget) {
      reset({
        categoryId: '',
        limit: '',
        period: format(new Date(), 'yyyy-MM')
      });
    }
  }, [isOpen, budget, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        limitMinorUnits: Math.round(parseFloat(data.limit) * 100),
        scope: 'monthly'
      };
      if (isEdit) {
        return api.patch(`/budgets/${budget._id}`, payload);
      }
      return api.post('/budgets', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Budget ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save budget');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const categories = categoriesData || [];
  const expenseCategories = categories.filter((c: any) => c.type === 'expense' || !c.type);
  const categoryOptions = expenseCategories.map((c: any) => ({ value: c._id, label: c.name }));

  const now = new Date();
  const periodOptions = Array.from({ length: 6 }).map((_, i) => {
    const d = addMonths(now, i);
    return { value: format(d, 'yyyy-MM'), label: format(d, 'MMMM yyyy') };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Budget' : 'Create Budget'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Category"
          options={categoryOptions}
          placeholder="Select a category"
          {...register('categoryId', { required: 'Category is required' })}
          error={errors.categoryId?.message as string}
          disabled={isEdit}
        />

        <Input
          label="Budget Limit"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('limit', { required: 'Limit is required', min: { value: 0.01, message: 'Must be > 0' } })}
          error={errors.limit?.message as string}
        />

        <Select
          label="Month"
          options={periodOptions}
          {...register('period', { required: 'Period is required' })}
          error={errors.period?.message as string}
        />

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};
