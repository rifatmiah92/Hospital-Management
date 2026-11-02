'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, Menu, X, User as UserIcon } from 'lucide-react';
import RoleSwitcher from './RoleSwitcher';
import NotificationBell from './NotificationBell';
import { CarePlusStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import SymptomCheckerModal from '../symptom-checker/SymptomCheckerModal';
import BookingModal from '../booking/BookingModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [role, setRole] = useState<UserRole>('patient');

  useEffect(() => {
    const u = CarePlusStore.getCurrentUser();
    if (u) setRole(u.role);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Departments', href: '/departments' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'About', href: '/about' },
  ];

  const getDashboardPath = () => {
    return `/dashboard/${role}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#12151C] border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo with logo4.jpeg image */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo4.jpeg"
                alt="CarePlus Medical Logo"
                className="h-11 w-auto object-contain rounded-xl mix-blend-screen group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                  Care<span className="text-[#F2CB05]">Plus</span>
                  <span className="text-[10px] bg-[#F2CB05]/20 text-[#F2CB05] font-extrabold px-2 py-0.5 rounded-full border border-[#F2CB05]/30 uppercase tracking-wider">
                    Medical
                  </span>
                </span>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Smart Hospital System</p>
              </div>
            </Link>

            {/* Nav Links: Services -> Departments -> Doctors -> About */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold relative py-1 transition-colors ${
                      isActive
                        ? 'text-[#F2CB05] font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2CB05] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden md:flex items-center gap-3">
              {/* AI Symptom Triage */}
              <button
                onClick={() => setIsSymptomCheckerOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#F2CB05] bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 px-3.5 py-2 rounded-xl transition-all border border-[#F2CB05]/30 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2CB05] animate-spin" />
                <span>AI Symptom Triage</span>
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              {/* Live Role Switcher */}
              <RoleSwitcher />

              {/* Dashboard Link */}
              <Link
                href={getDashboardPath()}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-all border border-slate-700"
              >
                <UserIcon className="w-4 h-4 text-[#F2CB05]" />
                <span>Portal</span>
              </Link>

              {/* Book Appointment CTA */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex items-center gap-2 text-xs font-bold text-[#0D0F14] bg-[#F2CB05] hover:bg-[#C9A400] px-4.5 py-2.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 font-['Inter']"
              >
                <Calendar className="w-4 h-4 text-[#0D0F14]" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <RoleSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#12151C] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSymptomCheckerOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#F2CB05] bg-[#F2CB05]/10 px-3 py-2.5 rounded-xl border border-[#F2CB05]/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Triage</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0D0F14] bg-[#F2CB05] px-3 py-2.5 rounded-xl"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                    pathname === link.href ? 'bg-slate-800 text-[#F2CB05]' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#F2CB05] text-[#0D0F14] flex items-center justify-between"
              >
                <span>Go to User Portal</span>
                <UserIcon className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Global Modals */}
      {isSymptomCheckerOpen && (
        <SymptomCheckerModal
          onClose={() => setIsSymptomCheckerOpen(false)}
          onBookDoctor={(docId) => {
            setIsSymptomCheckerOpen(false);
            setIsBookingOpen(true);
          }}
        />
      )}

      {isBookingOpen && (
        <BookingModal onClose={() => setIsBookingOpen(false)} />
      )}
    </>
  );
}
