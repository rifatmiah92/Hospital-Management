'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CarePlusStore } from '@/lib/store';
import { UserRole, User } from '@/lib/types';
import { UserCheck, Shield, Stethoscope, Microchip, User as UserIcon, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoleSwitcher() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(CarePlusStore.getCurrentUser());
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    patient: <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />,
    doctor: <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />,
    lab: <Microchip className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 shrink-0" />,
    admin: <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />,
  };

  const roleLabels: Record<UserRole, string> = {
    patient: 'Patient Portal',
    doctor: 'Doctor Panel',
    lab: 'Lab Tech Panel',
    admin: 'Super Admin',
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 text-slate-100 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-slate-800 transition-all border border-slate-700 shadow-sm shrink-0"
        title="Switch active role for live demo"
      >
        <span className="flex items-center gap-1 sm:gap-1.5">
          {roleIcons[currentUser.role]}
          <span className="capitalize hidden md:inline-block max-w-[90px] truncate">{currentUser.name}</span>
          <span className="bg-teal-500/20 text-teal-300 text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-teal-500/30">
            {currentUser.role}
          </span>
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-24px)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1.5 text-xs z-50">
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
              {currentUser.role === role && <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
