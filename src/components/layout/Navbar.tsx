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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Departments', href: '/departments' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const getDashboardPath = () => {
    return `/dashboard/${role}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#12151C] border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo with logo4.jpeg image */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img
                src="/logo4.jpeg"
                alt="CarePlus Medical Logo"
                className="h-8 sm:h-11 w-auto object-contain rounded-xl mix-blend-screen group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1 sm:gap-1.5 font-['Outfit']">
                  Care<span className="text-[#F2CB05]">Plus</span>
                  <span className="text-[9px] sm:text-[10px] bg-[#F2CB05]/20 text-[#F2CB05] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full border border-[#F2CB05]/30 uppercase tracking-wider">
                    Medical
                  </span>
                </span>
                <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-wider uppercase hidden xs:block">
                  Smart Hospital System
                </p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

            {/* Desktop Right Action Controls */}
            <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
              {/* AI Symptom Triage */}
              <button
                onClick={() => setIsSymptomCheckerOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#F2CB05] bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 px-3 py-2 rounded-xl transition-all border border-[#F2CB05]/30 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2CB05]" />
                <span className="whitespace-nowrap">AI Symptom Triage</span>
              </button>

              {/* Notification Bell */}
              <NotificationBell />

              {/* Live Role Switcher */}
              <RoleSwitcher />

              {/* Dashboard Link */}
              <Link
                href={getDashboardPath()}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-all border border-slate-700 whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4 text-[#F2CB05]" />
                <span>Portal</span>
              </Link>

              {/* Book Appointment CTA */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0D0F14] bg-[#F2CB05] hover:bg-[#C9A400] px-3.5 xl:px-4.5 py-2.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 font-['Inter'] whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#0D0F14]" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile / Tablet Controls (< lg) */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              <NotificationBell />
              <RoleSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#F2CB05]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12151C] border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-fadeIn shadow-2xl">
            {/* Quick Action CTA Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSymptomCheckerOpen(true);
                }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-[#F2CB05] bg-[#F2CB05]/10 hover:bg-[#F2CB05]/20 px-3 py-3 rounded-xl border border-[#F2CB05]/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#F2CB05]" />
                <span>AI Symptom Triage</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-[#0D0F14] bg-[#F2CB05] hover:bg-[#C9A400] px-3 py-3 rounded-xl transition-colors shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#0D0F14]" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-1 pt-1 border-t border-slate-800/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    pathname === link.href
                      ? 'bg-slate-800 text-[#F2CB05] font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {pathname === link.href && (
                    <span className="w-2 h-2 rounded-full bg-[#F2CB05]" />
                  )}
                </Link>
              ))}

              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-between border border-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#F2CB05]" />
                  <span>Go to User Portal ({role})</span>
                </span>
                <span className="text-xs text-[#F2CB05] font-semibold">Open →</span>
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
