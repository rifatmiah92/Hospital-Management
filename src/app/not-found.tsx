'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shadow-sm">
        <HeartPulse className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-xs text-slate-600 max-w-sm">
        The requested clinical page or record could not be found. Please check the URL or return to home.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-teal-700 px-5 py-2.5 rounded-xl shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
