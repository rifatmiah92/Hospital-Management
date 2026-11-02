'use client';

import React, { useState } from 'react';
import { Microchip, Activity, Stethoscope, HeartPulse, ShieldCheck, CheckCircle2, Calendar, PhoneCall } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function ServicesPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const services = [
    {
      icon: <Microchip className="w-8 h-8 text-teal-600" />,
      title: 'Automated Diagnostic BioLab & Pathology',
      desc: 'Fully automated biochemistry, hematology, immunology, and histology labs operating 24/7 with digital report delivery.',
      badge: 'ISO 15189 Certified',
    },
    {
      icon: <Activity className="w-8 h-8 text-sky-600" />,
      title: '24/7 Emergency, ICU & Cardiac Ambulance',
      desc: 'Advanced Life Support (ALS) ambulances equipped with mobile ECG and ventilators for immediate critical patient transfer.',
      badge: '24/7 Operational',
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-purple-600" />,
      title: 'Specialized Laparoscopic & Modular OT',
      desc: 'Ultra-clean laminar airflow operation theaters for orthopedic joint replacements, neurosurgery, and general surgery.',
      badge: 'Zero Infection Control',
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-rose-600" />,
      title: 'Interventional Cardiac Catheterization Lab (CathLab)',
      desc: 'Primary angioplasty, pacemaker implantations, and coronary angiography performed by senior interventional cardiologists.',
      badge: 'Emergency Angioplasty',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Hospital Facilities</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Advanced Medical & Diagnostic Services</h1>
          <p className="text-xs sm:text-sm text-teal-100">
            CarePlus Medical Center integrates international standard clinical infrastructure with digital patient management.
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white hover:bg-teal-50 px-6 py-3.5 rounded-xl shadow-lg transition-all shrink-0"
        >
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all hover-lift space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">{service.icon}</div>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {service.badge}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{service.desc}</p>

            <ul className="space-y-2 text-xs text-slate-700 font-semibold pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Online report download within 6 hours</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Expert consultant verification</li>
            </ul>
          </div>
        ))}
      </div>

      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} />}
    </div>
  );
}
