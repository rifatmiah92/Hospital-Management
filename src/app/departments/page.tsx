'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_DEPARTMENTS } from '@/lib/mock-data';
import { HeartPulse, ChevronRight, Search, Calendar } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string | undefined>(undefined);

  const filteredDepts = INITIAL_DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Clinical Specialties</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">All Medical Departments</h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Explore our specialized clinical centers, state-of-the-art diagnostic facilities, and expert consultant teams.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-lift flex flex-col justify-between"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={dept.image}
                alt={dept.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs bg-teal-600/90 text-white font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                  {dept.doctorCount} Doctors
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {dept.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-xs font-bold text-slate-700 hover:text-teal-600 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    setIsBookingOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 rounded-xl shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Slot</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isBookingOpen && (
        <BookingModal
          onClose={() => setIsBookingOpen(false)}
          preselectedDepartmentId={selectedDeptId}
        />
      )}
    </div>
  );
}
