import React, { useState } from 'react';
import { User, Lock, UserPlus, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onUpdateProfile: (name: string) => void;
  onUpdatePassword: (password: string) => void;
  onCreateAccount: (email: string, password: string) => boolean;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  onUpdateProfile, 
  onUpdatePassword, 
  onCreateAccount 
}) => {
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Profile Form State
  const [name, setName] = useState(user.name);
  
  // Password Form State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Create Account Form State
  const [newAccount, setNewAccount] = useState({
    email: '',
    password: ''
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('error', 'Name cannot be empty');
      return;
    }
    onUpdateProfile(name);
    showNotification('success', 'Profile updated successfully');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new.length < 6) {
      showNotification('error', 'New password must be at least 6 characters');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showNotification('error', 'New passwords do not match');
      return;
    }
    // Mock validation of current password could go here
    onUpdatePassword(passwords.new);
    setPasswords({ current: '', new: '', confirm: '' });
    showNotification('success', 'Password updated successfully');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAccount.email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }
    if (newAccount.password.length < 6) {
      showNotification('error', 'Password must be at least 6 characters');
      return;
    }
    
    const success = onCreateAccount(newAccount.email, newAccount.password);
    
    if (success) {
      setNewAccount({ email: '', password: '' });
      showNotification('success', `New account created for ${newAccount.email}`);
    } else {
      showNotification('error', 'An account with this email already exists');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile and security preferences.</p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg flex items-center shadow-sm animate-in slide-in-from-top-2 ${
          notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleProfileUpdate} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email (Read Only)</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Create Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Create New Account</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6">Add a new user to the organization. They will receive an email to set up their profile.</p>
          <form onSubmit={handleCreateAccount} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="colleague@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
              <input
                type="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};