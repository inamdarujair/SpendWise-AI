import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import api from '../../lib/api';
import { format } from 'date-fns';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  goal?: any;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSuccess, goal }) => {
  const isEdit = !!goal;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: format(new Date(), 'yyyy-MM-dd'),
      color: '#3b82f6',
      icon: 'target'
    }
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const presetColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
  const presetIcons = ['target', 'shield', 'home', 'laptop', 'plane', 'car', 'gift'];

  useEffect(() => {
    if (isOpen && goal) {
      reset({
        name: goal.name,
        targetAmount: (goal.targetAmountMinorUnits / 100).toString(),
        currentAmount: (goal.currentAmountMinorUnits / 100).toString(),
        deadline: format(new Date(goal.deadline), 'yyyy-MM-dd'),
        color: goal.color || '#3b82f6',
        icon: goal.icon || 'target'
      });
    } else if (isOpen && !goal) {
      reset({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: format(new Date(), 'yyyy-MM-dd'),
        color: '#3b82f6',
        icon: 'target'
      });
    }
  }, [isOpen, goal, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        targetAmountMinorUnits: Math.round(parseFloat(data.targetAmount) * 100),
        currentAmountMinorUnits: Math.round(parseFloat(data.currentAmount) * 100),
      };
      if (isEdit) {
        return api.patch(`/goals/${goal._id}`, payload);
      }
      return api.post('/goals', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Goal ${isEdit ? 'updated' : 'created'} successfully`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save goal');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Goal' : 'Create Goal'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Goal Name"
          placeholder="e.g. New Car, Emergency Fund"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message as string}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Target Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('targetAmount', { required: 'Target is required', min: 1 })}
            error={errors.targetAmount?.message as string}
          />
          <Input
            label="Saved So Far"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('currentAmount', { required: 'Amount is required', min: 0 })}
            error={errors.currentAmount?.message as string}
          />
        </div>

        <Input
          label="Deadline"
          type="date"
          {...register('deadline', { required: 'Deadline is required' })}
          error={errors.deadline?.message as string}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Theme</label>
          <div className="flex gap-2">
            {presetColors.map(color => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setValue('color', color)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {presetIcons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`px-3 py-1 rounded-full text-sm border capitalize transition-colors ${selectedIcon === icon ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/30' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}
                onClick={() => setValue('icon', icon)}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  );
};
