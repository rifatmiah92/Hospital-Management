'use client';

import React from 'react';
import { PhoneCall, Clock, MapPin, ShieldCheck } from 'lucide-react';

export default function EmergencyBar() {
  return (
    <div className="bg-[#0D0F14] text-slate-300 text-[11px] sm:text-xs py-2 px-3 sm:px-4 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Left Status */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold tracking-tight text-[#F2CB05]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2CB05] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2CB05]"></span>
            </span>
            <span>CarePlus Medical</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">24/7 ER, BioLab & ICU Emergency Active</span>
            <span className="sm:hidden">24/7 Emergency Active</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Banani & Dhanmondi, Dhaka</span>
          </div>
        </div>

        {/* Right Call & Certifications */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2CB05] shrink-0" />
            <span>BMDC & ISO Certified</span>
          </div>

          <a
            href="tel:10666"
            className="flex items-center gap-1.5 bg-[#F2CB05] hover:bg-[#C9A400] text-[#0D0F14] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full font-bold shadow-md transition-all text-[11px] sm:text-xs"
          >
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Hotline: 10666</span>
          </a>
        </div>

      </div>
    </div>
  );
}
