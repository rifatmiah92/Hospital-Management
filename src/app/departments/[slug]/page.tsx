'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS } from '@/lib/mock-data';
import { Calendar, Star, ArrowLeft } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const department = INITIAL_DEPARTMENTS.find(d => d.slug === slug);
  const doctorsInDept = INITIAL_DOCTORS.filter(doc => doc.departmentId === department?.id || doc.departmentName.toLowerCase().includes(slug));

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Department Not Found</h2>
        <button
          onClick={() => router.push('/departments')}
          className="text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl"
        >
          Back to All Departments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => router.push('/departments')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Departments</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <img
          src={department.image}
          alt={department.name}
          className="w-full h-56 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex items-end p-5 sm:p-10">
          <div className="text-white space-y-1.5 sm:space-y-2 max-w-2xl">
            <span className="text-[10px] sm:text-xs bg-teal-500 text-white font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider inline-block">
              Clinical Department
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">{department.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {department.description}
            </p>
          </div>
        </div>
      </div>

      {/* Department Doctors */}
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Assigned Consultant Doctors</h2>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full self-start sm:self-auto">
            {doctorsInDept.length} Specialists
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {doctorsInDept.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-teal-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    <p className="text-xs text-teal-700 font-medium truncate">{doc.designation}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating} ({doc.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3">{doc.bio}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Consultation Fee</div>
                  <div className="text-sm font-extrabold text-teal-700">৳{doc.consultationFee}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDoctorId(doc.id);
                    setIsBookingOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Slot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          onClose={() => setIsBookingOpen(false)}
          preselectedDoctorId={selectedDoctorId}
          preselectedDepartmentId={department.id}
        />
      )}
    </div>
  );
}
