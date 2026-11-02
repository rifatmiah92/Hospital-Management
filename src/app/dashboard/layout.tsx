'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CarePlusStore } from '@/lib/store';
import { User, UserRole } from '@/lib/types';
import {
  HeartPulse,
  User as UserIcon,
  Calendar,
  FileText,
  Pill,
  Users,
  Stethoscope,
  Microchip,
  Shield,
  Clock,
  LogOut,
  LayoutDashboard,
  Building2,
  Receipt,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import RoleSwitcher from '@/components/layout/RoleSwitcher';
import NotificationBell from '@/components/layout/NotificationBell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const u = CarePlusStore.getCurrentUser();
    setCurrentUser(u);
  }, [pathname]);

  if (!currentUser) return null;

  const role = currentUser.role;

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ReactNode }[]> = {
    patient: [
      { label: 'Overview', href: '/dashboard/patient', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'My Appointments', href: '/dashboard/patient', icon: <Calendar className="w-4 h-4" /> },
      { label: 'My Test Reports', href: '/dashboard/patient', icon: <FileText className="w-4 h-4" /> },
      { label: 'My Prescriptions', href: '/dashboard/patient', icon: <Pill className="w-4 h-4" /> },
      { label: 'Health Profile', href: '/dashboard/patient', icon: <UserIcon className="w-4 h-4" /> },
    ],
    doctor: [
      { label: 'Doctor Overview', href: '/dashboard/doctor', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: "Today's Patient Queue", href: '/dashboard/doctor', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Weekly Schedule', href: '/dashboard/doctor', icon: <Clock className="w-4 h-4" /> },
      { label: 'Patient Medical Records', href: '/dashboard/doctor', icon: <Users className="w-4 h-4" /> },
    ],
    lab: [
      { label: 'Lab Overview', href: '/dashboard/lab', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Pending Test Orders', href: '/dashboard/lab', icon: <Microchip className="w-4 h-4" /> },
      { label: 'Upload Test Report', href: '/dashboard/lab', icon: <FileText className="w-4 h-4" /> },
    ],
    admin: [
      { label: 'Admin Analytics', href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Doctor Management', href: '/dashboard/admin', icon: <Stethoscope className="w-4 h-4" /> },
      { label: 'Department Management', href: '/dashboard/admin', icon: <Building2 className="w-4 h-4" /> },
      { label: 'All Appointments', href: '/dashboard/admin', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Lab Reports Monitor', href: '/dashboard/admin', icon: <FileText className="w-4 h-4" /> },
      { label: 'Billing & Invoices', href: '/dashboard/admin', icon: <Receipt className="w-4 h-4" /> },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems['patient'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">
                Care<span className="text-teal-400">Plus</span>
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Active User Card */}
          <div className="p-4 bg-slate-950/60 m-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                {currentUser.role} Portal
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className={`p-3 space-y-1 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
              Menu Navigation
            </div>
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 hover:text-teal-300 transition-colors text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <RoleSwitcher />
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-rose-400 transition-colors w-full px-2 py-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Dashboard Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 capitalize">
              {role} Dashboard
            </h1>
            <p className="text-xs text-slate-500">Welcome back, {currentUser.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[10px] text-teal-600 font-bold uppercase">{currentUser.role} Account</div>
            </div>
          </div>
        </header>

        {/* Dashboard Child View */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
