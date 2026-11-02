'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const u = CarePlusStore.getCurrentUser();
    setCurrentUser(u);
    setSidebarOpen(false);
  }, [pathname]);

  if (!currentUser) return null;

  const role = currentUser.role;

  const roleNavItems: Record<UserRole, { label: string; href: string; icon: React.ReactNode }[]> = {
    patient: [
      { label: 'Overview', href: '/dashboard/patient', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
      { label: 'My Appointments', href: '/dashboard/patient', icon: <Calendar className="w-4 h-4 shrink-0" /> },
      { label: 'My Test Reports', href: '/dashboard/patient', icon: <FileText className="w-4 h-4 shrink-0" /> },
      { label: 'My Prescriptions', href: '/dashboard/patient', icon: <Pill className="w-4 h-4 shrink-0" /> },
      { label: 'Health Profile', href: '/dashboard/patient', icon: <UserIcon className="w-4 h-4 shrink-0" /> },
    ],
    doctor: [
      { label: 'Doctor Overview', href: '/dashboard/doctor', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
      { label: "Today's Patient Queue", href: '/dashboard/doctor', icon: <Calendar className="w-4 h-4 shrink-0" /> },
      { label: 'Weekly Schedule', href: '/dashboard/doctor', icon: <Clock className="w-4 h-4 shrink-0" /> },
      { label: 'Patient Medical Records', href: '/dashboard/doctor', icon: <Users className="w-4 h-4 shrink-0" /> },
    ],
    lab: [
      { label: 'Lab Overview', href: '/dashboard/lab', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
      { label: 'Pending Test Orders', href: '/dashboard/lab', icon: <Microchip className="w-4 h-4 shrink-0" /> },
      { label: 'Upload Test Report', href: '/dashboard/lab', icon: <FileText className="w-4 h-4 shrink-0" /> },
    ],
    admin: [
      { label: 'Admin Analytics', href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
      { label: 'Doctor Management', href: '/dashboard/admin', icon: <Stethoscope className="w-4 h-4 shrink-0" /> },
      { label: 'Department Management', href: '/dashboard/admin', icon: <Building2 className="w-4 h-4 shrink-0" /> },
      { label: 'All Appointments', href: '/dashboard/admin', icon: <Calendar className="w-4 h-4 shrink-0" /> },
      { label: 'Billing & Invoices', href: '/dashboard/admin', icon: <Receipt className="w-4 h-4 shrink-0" /> },
    ],
  };

  const navItems = roleNavItems[role] || roleNavItems['patient'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Bar (< md) */}
      <div className="md:hidden bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open Dashboard Navigation"
          >
            <Menu className="w-5 h-5 text-[#F2CB05]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm capitalize">
              {role} Panel
            </span>
            <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-500/30">
              Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <RoleSwitcher />
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Navigation (Desktop fixed + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-20 w-72 md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } min-h-screen md:min-h-0 md:h-auto overflow-y-auto`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center text-white font-bold shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base font-['Outfit'] block leading-none">
                  Care<span className="text-teal-400">Plus</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Portal Navigation
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active User Card */}
          <div className="p-3.5 bg-slate-950/60 m-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="overflow-hidden min-w-0">
              <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
              <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                {currentUser.role} Portal
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
              Menu Navigation
            </div>
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800 hover:text-teal-300 transition-colors text-slate-300 group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400 group-hover:text-teal-400 transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-teal-400 transition-colors" />
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
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Dashboard Header (Desktop md+) */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 capitalize">
              {role} Dashboard
            </h1>
            <p className="text-xs text-slate-500">Welcome back, {currentUser.name}</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[10px] text-teal-600 font-bold uppercase">{currentUser.role} Account</div>
            </div>
          </div>
        </header>

        {/* Dashboard Child View */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

    </div>
  );
}
