'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0D0F14] text-slate-400 pt-12 sm:pt-16 pb-8 border-t border-slate-900 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
              <img
                src="/logo4.jpeg"
                alt="CarePlus Medical Logo"
                className="h-9 sm:h-10 w-auto object-contain rounded-xl mix-blend-screen"
              />
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight font-['Outfit']">
                Care<span className="text-[#F2CB05]">Plus</span> Medical
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CarePlus Medical Center is a premier smart hospital & diagnostic ecosystem in Bangladesh, integrating multi-specialty OPD/IPD care, bio-laboratories, and digital patient record portals.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 bg-[#12151C] px-3 py-1.5 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#F2CB05]" />
                <span>BMDC Reg. Hospital</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#12151C] px-3 py-1.5 rounded-xl border border-slate-800">
                <Clock className="w-4 h-4 text-[#F2CB05]" />
                <span>24/7 ER & ICU</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/services" className="hover:text-[#F2CB05] transition-colors">Diagnostic Services</Link></li>
              <li><Link href="/departments" className="hover:text-[#F2CB05] transition-colors">Specialized Departments</Link></li>
              <li><Link href="/doctors" className="hover:text-[#F2CB05] transition-colors">Specialist Doctors</Link></li>
              <li><Link href="/about" className="hover:text-[#F2CB05] transition-colors">About CarePlus Hospital</Link></li>
              <li><Link href="/contact" className="hover:text-[#F2CB05] transition-colors">Contact & Emergency Map</Link></li>
            </ul>
          </div>

          {/* Patient Portal Links */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Patient Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/dashboard/patient" className="hover:text-[#F2CB05] transition-colors">Online Appointment Portal</Link></li>
              <li><Link href="/dashboard/patient" className="hover:text-[#F2CB05] transition-colors">E-Report Download System</Link></li>
              <li><Link href="/dashboard/patient" className="hover:text-[#F2CB05] transition-colors">Digital Prescription History</Link></li>
              <li><Link href="/dashboard/doctor" className="hover:text-[#F2CB05] transition-colors">Doctor Consultation Portal</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-[#F2CB05] transition-colors">Super Admin Management</Link></li>
            </ul>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">Emergency Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2CB05]/10 flex items-center justify-center text-[#F2CB05] shrink-0 mt-0.5">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Emergency Hotline</div>
                  <div className="text-[#F2CB05] font-bold">10666 / 09666-700700</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2CB05]/10 flex items-center justify-center text-[#F2CB05] shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Email Desk</div>
                  <div className="break-all">care@careplusmedical.com</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2CB05]/10 flex items-center justify-center text-[#F2CB05] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Main Hospital</div>
                  <div>Plot 42, Road 11, Banani, Dhaka</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 text-center sm:text-left">
          <p>© 2026 CarePlus Medical Center Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
