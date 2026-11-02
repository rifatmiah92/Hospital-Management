'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_DOCTORS, INITIAL_DEPARTMENTS } from '@/lib/mock-data';
import { Search, Star, Calendar, ArrowRight, Stethoscope } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  const filteredDoctors = INITIAL_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Specialist Registry</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Find Your Specialist Doctor</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Book appointments with BMDC registered senior consultants, professors, and surgeons across 15+ specialties.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="w-full sm:w-48 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="all">All Departments</option>
            {INITIAL_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all duration-300 hover-lift flex flex-col justify-between group"
          >
            <div>
              <div className="relative mb-4">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-full h-56 object-cover rounded-2xl border border-slate-100"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 text-[11px] font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{doc.rating}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-600 transition-colors">
                {doc.name}
              </h3>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">{doc.designation}</p>
              <p className="text-[11px] text-slate-500 mt-1">{doc.departmentName}</p>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{doc.qualifications}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-medium uppercase">Consultation Fee</div>
                <div className="text-base font-extrabold text-teal-700">৳{doc.consultationFee}</div>
              </div>

              <button
                onClick={() => {
                  setSelectedDoctorId(doc.id);
                  setIsBookingOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-2 rounded-xl shadow-md transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isBookingOpen && (
        <BookingModal
          onClose={() => setIsBookingOpen(false)}
          preselectedDoctorId={selectedDoctorId}
        />
      )}
    </div>
  );
}
