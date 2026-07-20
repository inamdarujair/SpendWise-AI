import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import api from '../../lib/api';
import { useMutation } from '@tanstack/react-query';

const SettingsPage = () => {
  const { user, accessToken, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [name, setName] = useState(user?.name || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Force dark mode
    const root = window.document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const profileMutation = useMutation({
    mutationFn: async (data: { name?: string; currency?: string; theme?: string }) => {
      const res = await api.put('/auth/profile', data);
      return res.data;
    },
    onSuccess: (updatedUser) => {
      setAuth(updatedUser, accessToken!);
      toast.success('Preferences updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update preferences');
    }
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put('/auth/password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update password');
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({ name, currency, theme: 'dark' });
  };

  const handleSavePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    passwordMutation.mutate({ currentPassword, newPassword });
  };

  const handleDeleteAccount = () => {
    toast.success('Account deleted (demo)');
    handleLogout();
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    profileMutation.mutate({ currency: newCurrency, theme: 'dark', name });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 h-fit">
          <CardContent className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
            >
              <User size={18} className="mr-3" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
            >
              <Bell size={18} className="mr-3" /> Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
            >
              <Shield size={18} className="mr-3" /> Security
            </button>
          </CardContent>
        </Card>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="animate-in fade-in">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-8">
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl text-white font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Email Address" type="email" defaultValue={user?.email || ''} disabled hint="Email address cannot be changed." />
                  <div className="pt-2">
                    <Button type="submit" isLoading={profileMutation.isPending}>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card className="animate-in fade-in">
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-w-md">


                <Select
                  label="Currency"
                  options={[{ value: 'INR', label: 'INR (₹)' }, { value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }]}
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                    <Input label="Current Password" name="currentPassword" type="password" required />
                    <Input label="New Password" name="newPassword" type="password" required />
                    <Input label="Confirm New Password" name="confirmPassword" type="password" required />
                    <div className="pt-2">
                      <Button type="submit" isLoading={passwordMutation.isPending}>Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-red-100 dark:border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-medium text-gray-900 dark:text-white">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data.</p>
                    </div>
                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
                  </div>
                </CardContent>
              </Card>

              <Button variant="ghost" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" /> Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you absolutely sure you want to delete your account? This action cannot be undone and will erase all your financial data."
        confirmText="Yes, Delete My Account"
      />
    </div>
  );
};

export default SettingsPage;
