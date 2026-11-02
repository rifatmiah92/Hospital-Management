'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Calendar,
  Sparkles,
  FileText,
  PhoneCall,
  ShieldCheck,
  Search,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle2,
  Stethoscope,
  Microchip,
  Activity,
  Award,
  Users,
  Clock,
  MapPin,
  Send,
  Building2,
  Brain,
  Baby,
  Bone
} from 'lucide-react';
import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS } from '@/lib/mock-data';
import BookingModal from '@/components/booking/BookingModal';
import SymptomCheckerModal from '@/components/symptom-checker/SymptomCheckerModal';

export default function HomePage() {
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<string | undefined>(undefined);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

  // Contact Form State
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  const openBookingForDoctor = (docId: string) => {
    setSelectedDoctorForBooking(docId);
    setIsBookingOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const filteredDoctorsHero = INITIAL_DOCTORS.filter((doc) => {
    if (!heroSearchQuery.trim()) return true;
    const q = heroSearchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.departmentName.toLowerCase().includes(q) ||
      doc.qualifications.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#FBFAF6] space-y-0 text-[#141414]">
      
      {/* 1. HERO SECTION (DARK NAVY #12151C + GOLD #F2CB05) */}
      <section className="relative overflow-hidden bg-[#12151C] text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="eyebrow text-[#C9A400]">
                <span>Smart Hospital & Medical Care System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] tracking-tight leading-[1.08] text-white">
                World-Class Medical Care, <br />
                <span className="text-[#F2CB05]">
                  Delivered With Excellence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl font-['Inter'] leading-relaxed">
                Experience instant specialist appointment booking, 24/7 emergency care, automated bio-lab report downloads, and digital prescriptions.
              </p>

              {/* Instant Search Engine */}
              <div className="bg-[#1B2029] p-3 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xl space-y-2">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-[#F2CB05] absolute left-3.5" />
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Search doctor, department, or medical condition..."
                    className="w-full pl-11 pr-24 py-3 rounded-xl text-xs font-semibold text-white bg-[#12151C] border border-slate-800 placeholder-slate-400 outline-none focus:border-[#F2CB05] transition-all"
                  />
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="absolute right-1.5 flex items-center gap-1 text-xs font-bold text-[#0D0F14] bg-[#F2CB05] hover:bg-[#C9A400] px-4 py-2.5 rounded-xl shadow-md transition-all font-['Inter']"
                  >
                    <span>Search</span>
                  </button>
                </div>

                {/* Search Chips */}
                <div className="flex items-center gap-1.5 flex-wrap px-2 pt-1 text-[11px] text-slate-400">
                  <span className="font-bold text-[#F2CB05]">Popular:</span>
                  {['Cardiology', 'Pediatrics', 'Dr. Sabrina', 'ECG Test', 'Neurology'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setHeroSearchQuery(chip)}
                      className="px-2.5 py-0.5 rounded-md bg-[#272E3A] hover:bg-[#F2CB05] hover:text-[#0D0F14] font-semibold transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hero Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="btn-gold flex items-center gap-2 text-xs font-bold px-7 py-3.5 rounded-xl transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#0D0F14]" />
                  <span>Book Appointment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsSymptomCheckerOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold text-[#F2CB05] bg-[#272E3A] hover:bg-[#1B2029] border border-slate-700 px-6 py-3.5 rounded-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F2CB05]" />
                  <span>AI Symptom Triage</span>
                </button>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-8 pt-6 border-t border-slate-800">
                <div>
                  <b className="font-['Outfit'] text-2xl text-white block">50+</b>
                  <span className="text-xs text-slate-400">Specialist Consultants</span>
                </div>
                <div>
                  <b className="font-['Outfit'] text-2xl text-[#F2CB05] block">24/7</b>
                  <span className="text-xs text-slate-400">Emergency & ICU</span>
                </div>
                <div>
                  <b className="font-['Outfit'] text-2xl text-white block">99.8%</b>
                  <span className="text-xs text-slate-400">Patient Satisfaction</span>
                </div>
              </div>

            </div>

            {/* Right Card Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[#1B2029] p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
                <div className="relative h-72 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
                    alt="CarePlus Medical Hospital"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <span className="bg-[#F2CB05] text-[#0D0F14] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        Main Medical Center
                      </span>
                      <h3 className="font-bold text-lg font-['Outfit'] text-white mt-1">CarePlus Medical Banani</h3>
                      <p className="text-xs text-slate-300">Plot 42, Road 11, Block D, Banani, Dhaka</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#12151C] rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#F2CB05] shrink-0" />
                    <div>
                      <div className="font-bold text-white">BMDC Certified</div>
                      <div className="text-[10px] text-slate-400">Verified Specialists</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#12151C] rounded-xl border border-slate-800 flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-[#F2CB05] shrink-0" />
                    <div>
                      <div className="font-bold text-white">Instant Reports</div>
                      <div className="text-[10px] text-slate-400">E-Portal Download</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E4D9]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#E7E4D9]">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
                alt="Hospital Facility"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="eyebrow">About CarePlus Hospital</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12151C] font-['Outfit']">
              Setting New Benchmarks in Patient-Centric Medical Care
            </h2>
            <p className="text-sm text-[#5B5F66] leading-relaxed">
              CarePlus Medical Center is dedicated to combining state-of-the-art diagnostic bio-laboratories, BMDC registered specialist consultants, and a seamless digital health platform for patients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 bg-[#F2F0E8] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C9A400] font-bold shadow-sm shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-sm font-bold text-[#12151C] font-['Outfit'] block">BMDC Certified Specialists</b>
                  <span className="text-xs text-[#5B5F66]">Over 50+ senior consultant doctors.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-[#F2F0E8] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C9A400] font-bold shadow-sm shrink-0">
                  <Microchip className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-sm font-bold text-[#12151C] font-['Outfit'] block">Automated BioLab</b>
                  <span className="text-xs text-[#5B5F66]">ISO 15189 accredited diagnostics.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CLINICAL DEPARTMENTS SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E4D9]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="eyebrow justify-center">Specialized Departments</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12151C] font-['Outfit']">Our Clinical Specialty Centers</h2>
          <p className="text-xs text-[#5B5F66]">Explore our specialized clinical departments staffed by leading medical consultants.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="card-hover p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#F2F0E8] text-[#12151C] flex items-center justify-center font-bold mb-4">
                  <Building2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-[#12151C] text-base font-['Outfit']">{dept.name}</h4>
                <span className="text-xs text-[#C9A400] font-bold block mt-1">{dept.doctorCount} Specialist Doctors</span>
                <p className="text-xs text-[#5B5F66] mt-2 line-clamp-3 leading-relaxed">{dept.description}</p>
              </div>

              <div className="pt-4 border-t border-[#E7E4D9] mt-6 flex items-center justify-between">
                <Link
                  href={`/departments/${dept.slug}`}
                  className="text-xs font-bold text-[#12151C] hover:text-[#C9A400] flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="text-xs font-bold text-[#0D0F14] bg-[#F2CB05] hover:bg-[#C9A400] px-3 py-1.5 rounded-lg"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SENIOR CONSULTANT DOCTORS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E4D9]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="eyebrow">Medical Specialists</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12151C] font-['Outfit'] mt-1">Our Senior Specialist Consultants</h2>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#12151C] bg-[#F2F0E8] hover:bg-[#E7E4D9] px-4 py-2.5 rounded-xl transition-all self-start md:self-auto"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctorsHero.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-[#E7E4D9] rounded-3xl overflow-hidden hover:border-[#F2CB05] transition-all hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#12151C]/90 text-[#F2CB05] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#F2CB05]" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-1">
                  <h4 className="font-bold text-[#12151C] text-base font-['Outfit'] group-hover:text-[#C9A400] transition-colors">
                    {doc.name}
                  </h4>
                  <span className="text-xs font-semibold text-[#C9A400] block">{doc.designation}</span>
                  <span className="text-[11px] text-[#5B5F66] block">{doc.departmentName}</span>
                  <p className="text-[11px] text-[#5B5F66] mt-2 line-clamp-2 leading-relaxed">{doc.qualifications}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between border-t border-[#E7E4D9] pt-3 mb-3">
                  <span className="text-[10px] text-[#5B5F66] uppercase font-semibold">Consultation Fee</span>
                  <span className="text-base font-extrabold text-[#12151C]">৳{doc.consultationFee}</span>
                </div>

                <button
                  onClick={() => openBookingForDoctor(doc.id)}
                  className="w-full btn-gold text-xs font-bold py-2.5 rounded-xl shadow-md"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REPORTS BAND SECTION */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reports-band flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="eyebrow text-[#F2CB05]">Patient Report Download Portal</div>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] leading-tight">
              Access Your BioLab Test Reports Online Anytime
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Skip hospital queues. Download officially verified lab diagnostic reports and digital prescriptions in 1-click PDF format.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Link
              href="/dashboard/patient"
              className="btn-gold w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-[#0D0F14] text-center"
            >
              Download Lab Reports
            </Link>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </section>

      {/* 6. CONTACT PANEL SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E7E4D9] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Navy Contact Info */}
          <div className="lg:col-span-5 bg-[#12151C] text-white p-8 sm:p-12 space-y-6">
            <div className="eyebrow text-[#F2CB05]">Emergency Response & Desk</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">Get in Touch With CarePlus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our patient relations team is available 24/7 for ambulance dispatch, appointment assistance, and test report inquiries.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F2CB05]/20 text-[#F2CB05] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Emergency Hotline</div>
                  <div className="font-extrabold text-[#F2CB05] text-base">10666 / 09666-700700</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F2CB05]/20 text-[#F2CB05] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Hospital Address</div>
                  <div className="text-xs text-slate-200">Plot 42, Road 11, Banani, Dhaka</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form Grid */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <h3 className="text-xl font-bold text-[#12151C] font-['Outfit']">Send an Inquiry or Feedback</h3>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-[#12151C] text-base font-['Outfit']">Message Sent Successfully!</h4>
                <p className="text-xs text-[#5B5F66]">Our desk officer will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#12151C] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full p-3 rounded-xl border border-[#E7E4D9] bg-[#F2F0E8] text-xs outline-none focus:border-[#C9A400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#12151C] mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="01700000000"
                      className="w-full p-3 rounded-xl border border-[#E7E4D9] bg-[#F2F0E8] text-xs outline-none focus:border-[#C9A400]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12151C] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="yourname@gmail.com"
                    className="w-full p-3 rounded-xl border border-[#E7E4D9] bg-[#F2F0E8] text-xs outline-none focus:border-[#C9A400]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#12151C] mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we assist you?"
                    className="w-full p-3 rounded-xl border border-[#E7E4D9] bg-[#F2F0E8] text-xs outline-none focus:border-[#C9A400]"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold flex items-center justify-center gap-2 text-xs font-bold px-6 py-3 rounded-xl shadow-md w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          onClose={() => setIsBookingOpen(false)}
          preselectedDoctorId={selectedDoctorForBooking}
        />
      )}

      {/* Symptom Checker Modal */}
      {isSymptomCheckerOpen && (
        <SymptomCheckerModal
          onClose={() => setIsSymptomCheckerOpen(false)}
          onBookDoctor={(docId) => {
            setIsSymptomCheckerOpen(false);
            openBookingForDoctor(docId);
          }}
        />
      )}

    </div>
  );
}
