'use client';

import React from 'react';
import { ShieldCheck, HeartPulse, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Hero */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-xl text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">About CarePlus Medical</span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Redefining Healthcare Standards in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
          CarePlus Medical Center is built on the philosophy of patient-first medicine. Combining world-class diagnostic machinery, BMDC registered specialist consultants, and a seamless digital health record platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">15+</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold">Specialized Departments</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">50+</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold">Specialist Consultants</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">250K+</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold">Patients Served</div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">24/7</div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-semibold">Emergency & ICU</div>
        </div>
      </div>
    </div>
  );
}
