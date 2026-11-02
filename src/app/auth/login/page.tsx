'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CarePlusStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { HeartPulse, Stethoscope, Microchip, Shield, User as UserIcon, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('patient');
  const [email, setEmail] = useState('tanvir@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = CarePlusStore.switchRole(activeRoleTab);
    router.push(`/dashboard/${user.role}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Banner */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white text-center space-y-2">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center mx-auto text-white shadow-lg">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">CarePlus Portal Login</h2>
          <p className="text-xs text-slate-400">Access your hospital records, schedule & management panel</p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-4 bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold text-slate-600">
          {[
            { role: 'patient' as UserRole, label: 'Patient', icon: <UserIcon className="w-3.5 h-3.5" /> },
            { role: 'doctor' as UserRole, label: 'Doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
            { role: 'lab' as UserRole, label: 'Lab Tech', icon: <Microchip className="w-3.5 h-3.5" /> },
            { role: 'admin' as UserRole, label: 'Admin', icon: <Shield className="w-3.5 h-3.5" /> },
          ].map(({ role, label, icon }) => (
            <button
              key={role}
              onClick={() => {
                setActiveRoleTab(role);
                if (role === 'patient') setEmail('tanvir@gmail.com');
                else if (role === 'doctor') setEmail('sabrina.cardio@careplus.com');
                else if (role === 'lab') setEmail('biolab@careplus.com');
                else if (role === 'admin') setEmail('admin@careplus.com');
              }}
              className={`py-2 sm:py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all ${
                activeRoleTab === role
                  ? 'bg-white text-teal-700 shadow-sm font-extrabold'
                  : 'hover:text-slate-900 text-slate-500'
              }`}
            >
              {icon}
              <span className="text-[10px] sm:text-xs">{label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email / User ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-xs font-bold text-white bg-slate-900 hover:bg-teal-600 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Login as {activeRoleTab.toUpperCase()}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Demo credentials automatically prefilled for testing.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
