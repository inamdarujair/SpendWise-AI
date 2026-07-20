import React from 'react';
import { formatCurrency } from '../../lib/format';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';

interface AddSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: any;
}

export const AddSavingsModal: React.FC<AddSavingsModalProps> = ({ isOpen, onClose, goal }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { amount: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: { amount: string }) => {
      const addedMinor = Math.round(parseFloat(data.amount) * 100);
      const newTotal = goal.currentAmountMinorUnits + addedMinor;
      return api.patch(`/goals/${goal._id}`, { currentAmountMinorUnits: newTotal });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Savings added successfully!');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add savings');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Funds to ${goal.name}`} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Current balance: <span className="font-bold">{formatCurrency(goal.currentAmountMinorUnits)}</span>
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Target: {formatCurrency(goal.targetAmountMinorUnits)}
          </p>
        </div>

        <Input
          label="Amount to Add"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { required: 'Amount is required', min: 0.01 })}
          error={errors.amount?.message as string}
        />

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Add Funds</Button>
        </div>
      </form>
    </Modal>
  );
};



