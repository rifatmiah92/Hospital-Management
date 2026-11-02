'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { UserRole, User } from '@/lib/types';
import { UserCheck, Shield, Stethoscope, Microchip, User as UserIcon, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(CarePlusStore.getCurrentUser());
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const newUser = CarePlusStore.switchRole(role);
    setCurrentUser(newUser);
    setIsOpen(false);
    
    // Redirect to corresponding dashboard
    if (role === 'patient') router.push('/dashboard/patient');
    else if (role === 'doctor') router.push('/dashboard/doctor');
    else if (role === 'lab') router.push('/dashboard/lab');
    else if (role === 'admin') router.push('/dashboard/admin');
  };

  if (!currentUser) return null;

  const roleIcons = {
    patient: <UserIcon className="w-4 h-4 text-emerald-500" />,
    doctor: <Stethoscope className="w-4 h-4 text-sky-500" />,
    lab: <Microchip className="w-4 h-4 text-purple-500" />,
    admin: <Shield className="w-4 h-4 text-amber-500" />,
  };

  const roleLabels: Record<UserRole, string> = {
    patient: 'Patient Portal',
    doctor: 'Doctor Panel',
    lab: 'Lab Tech Panel',
    admin: 'Super Admin',
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-800 transition-all border border-slate-700 shadow-sm"
        title="Switch active role for live demo"
      >
        <span className="flex items-center gap-1.5">
          {roleIcons[currentUser.role]}
          <span className="capitalize">{currentUser.name}</span>
          <span className="bg-teal-500/20 text-teal-300 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-teal-500/30">
            {currentUser.role}
          </span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1.5 text-xs">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-medium text-slate-400">
            ⚡ Quick Demo Role Switcher
          </div>
          {(['patient', 'doctor', 'lab', 'admin'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                currentUser.role === role ? 'bg-teal-950/60 text-teal-300 font-semibold' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {roleIcons[role]}
                <div>
                  <div className="text-slate-100 font-medium">{roleLabels[role]}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{role} Account</div>
                </div>
              </div>
              {currentUser.role === role && <UserCheck className="w-3.5 h-3.5 text-teal-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
