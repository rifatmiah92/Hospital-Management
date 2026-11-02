'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CreditCard, CheckCircle, Download, ArrowRight, User as UserIcon, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { CarePlusStore } from '@/lib/store';
import { Doctor, Department, PaymentMethod } from '@/lib/types';
import { downloadAppointmentTicketPDF } from '@/lib/pdf-generator';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
}

export default function BookingModal({ onClose, preselectedDoctorId, preselectedDepartmentId }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  // Form Selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-07-26');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Patient details
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  useEffect(() => {
    const depts = CarePlusStore.getDepartments();
    const docs = CarePlusStore.getDoctors();
    const user = CarePlusStore.getCurrentUser();

    setDepartments(depts);
    setDoctors(docs);

    if (user) {
      setPatientName(user.name);
      setPatientPhone(user.phone);
    }

    if (preselectedDepartmentId) {
      setSelectedDeptId(preselectedDepartmentId);
      setFilteredDoctors(docs.filter(d => d.departmentId === preselectedDepartmentId));
    } else {
      setSelectedDeptId(depts[0]?.id || '');
      setFilteredDoctors(docs.filter(d => d.departmentId === depts[0]?.id));
    }

    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
      const doc = docs.find(d => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedDeptId(doc.departmentId);
        setFilteredDoctors(docs.filter(d => d.departmentId === doc.departmentId));
      }
    } else if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    }
  }, [preselectedDoctorId, preselectedDepartmentId]);

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docsInDept = doctors.filter(d => d.departmentId === deptId);
    setFilteredDoctors(docsInDept);
    if (docsInDept.length > 0) {
      setSelectedDoctorId(docsInDept[0].id);
    } else {
      setSelectedDoctorId('');
    }
  };

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const handleCompleteBooking = () => {
    if (!selectedDoctor || !selectedTimeSlot) return;

    setIsProcessing(true);

    setTimeout(() => {
      const currentUser = CarePlusStore.getCurrentUser();
      const newApt = CarePlusStore.createAppointment({
        patientId: currentUser.id,
        patientName: patientName || currentUser.name,
        patientPhone: patientPhone || currentUser.phone,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorTitle: selectedDoctor.title,
        doctorPhoto: selectedDoctor.photo,
        departmentName: selectedDoctor.departmentName,
        date: bookingDate,
        timeSlot: selectedTimeSlot,
        status: 'confirmed',
        consultationType: 'In-person',
        fee: selectedDoctor.consultationFee,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod,
        notes: notes,
      });

      setCreatedAppointment(newApt);
      setIsProcessing(false);
      setStep(5);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.log('Confetti effect triggered');
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#0D0F14]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E7E4D9] flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#12151C] p-3.5 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F2CB05]/20 text-[#F2CB05] flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit']">Book Doctor Appointment</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">CarePlus OPD Consultation Ticket System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#F2F0E8] px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#E7E4D9] flex items-center justify-between text-xs font-semibold">
          {[
            { s: 1, label: 'Doctor' },
            { s: 2, label: 'Slot' },
            { s: 3, label: 'Patient' },
            { s: 4, label: 'Payment' },
            { s: 5, label: 'Ticket' },
          ].map(({ s, label }) => (
            <div key={s} className="flex items-center gap-1 sm:gap-1.5">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-extrabold ${
                  step === s
                    ? 'bg-[#F2CB05] text-[#0D0F14] shadow-sm'
                    : step > s
                    ? 'bg-[#12151C] text-white'
                    : 'bg-[#E7E4D9] text-[#5B5F66]'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className={`hidden sm:inline text-xs font-['Outfit'] ${step === s ? 'text-[#12151C] font-extrabold' : 'text-[#5B5F66] font-medium'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
          {/* STEP 1: Department & Doctor */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  1. Select Department
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleDeptChange(dept.id)}
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left text-xs font-semibold transition-all ${
                        selectedDeptId === dept.id
                          ? 'border-[#F2CB05] bg-[#F2CB05]/20 text-[#12151C] shadow-sm font-bold ring-1 ring-[#F2CB05]'
                          : 'border-[#E7E4D9] hover:border-slate-300 text-[#12151C] bg-white'
                      }`}
                    >
                      <div className="font-bold font-['Outfit'] truncate">{dept.name}</div>
                      <div className="text-[10px] text-[#5B5F66]">{dept.doctorCount} Doctors</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  2. Select Consultant Doctor
                </label>
                {filteredDoctors.length === 0 ? (
                  <p className="text-xs text-[#5B5F66] italic p-4 bg-[#F2F0E8] rounded-xl">
                    No active doctors available for this department.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          selectedDoctorId === doc.id
                            ? 'border-[#F2CB05] bg-[#F2CB05]/20 shadow-sm ring-1 ring-[#F2CB05]'
                            : 'border-[#E7E4D9] hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={doc.photo}
                            alt={doc.name}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#E7E4D9] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[#12151C] text-xs font-['Outfit'] truncate">{doc.name}</div>
                            <div className="text-[11px] text-[#C9A400] font-semibold truncate">{doc.designation}</div>
                            <div className="text-[10px] text-[#5B5F66] truncate">{doc.qualifications}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-extrabold text-[#12151C] text-xs sm:text-sm">৳{doc.consultationFee}</div>
                          <div className="text-[10px] text-[#5B5F66]">⭐ {doc.rating}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slots */}
          {step === 2 && selectedDoctor && (
            <div className="space-y-4 sm:space-y-6">
              <div className="p-3.5 sm:p-4 bg-[#F2F0E8] rounded-2xl border border-[#E7E4D9] flex items-center gap-3">
                <img src={selectedDoctor.photo} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-[#12151C] text-sm font-['Outfit'] truncate">{selectedDoctor.name}</h4>
                  <p className="text-xs text-[#C9A400] font-semibold">{selectedDoctor.departmentName}</p>
                  <p className="text-[11px] text-[#5B5F66]">Consultation Fee: ৳{selectedDoctor.consultationFee}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  Select Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min="2026-07-25"
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 sm:p-3 rounded-xl border border-[#E7E4D9] bg-[#F2F0E8] text-xs font-semibold focus:outline-none focus:border-[#C9A400]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-[#F2CB05] bg-[#F2CB05] text-[#0D0F14] shadow-sm'
                          : 'border-[#E7E4D9] bg-white text-[#12151C] hover:border-[#F2CB05]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Info */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-[#12151C] text-sm border-b border-[#E7E4D9] pb-2 font-['Outfit']">Patient Details</h4>
              <div>
                <label className="block text-xs font-semibold text-[#12151C] mb-1">Full Patient Name *</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full p-2.5 border border-[#E7E4D9] bg-[#F2F0E8] rounded-xl text-xs outline-none focus:border-[#C9A400]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#12151C] mb-1">Contact Phone Number *</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full p-2.5 border border-[#E7E4D9] bg-[#F2F0E8] rounded-xl text-xs outline-none focus:border-[#C9A400]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#12151C] mb-1">Visit Reason / Medical Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe symptoms..."
                  className="w-full p-2.5 border border-[#E7E4D9] bg-[#F2F0E8] rounded-xl text-xs outline-none focus:border-[#C9A400]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Payment Simulation */}
          {step === 4 && selectedDoctor && (
            <div className="space-y-4 sm:space-y-5">
              <div className="p-3.5 sm:p-4 bg-[#F2F0E8] rounded-2xl border border-[#E7E4D9] text-xs space-y-1.5">
                <div className="flex justify-between text-[#5B5F66]">
                  <span>Doctor Consultation Fee:</span>
                  <span className="font-bold text-[#12151C]">৳{selectedDoctor.consultationFee}</span>
                </div>
                <div className="flex justify-between text-[#5B5F66]">
                  <span>Hospital Service Charge:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-[#E7E4D9] pt-2 flex justify-between font-extrabold text-sm text-[#12151C] font-['Outfit']">
                  <span>Total Payable:</span>
                  <span className="text-[#C9A400]">৳{selectedDoctor.consultationFee}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#12151C] uppercase tracking-wider mb-2 font-['Outfit']">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['bKash', 'Nagad', 'Card'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === method
                          ? 'border-[#F2CB05] bg-[#F2CB05]/20 text-[#12151C] shadow-sm ring-1 ring-[#F2CB05]'
                          : 'border-[#E7E4D9] bg-white text-[#12151C] hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A400]" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12151C] mb-1">
                  {paymentMethod} Account / Card Number
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 01700000000"
                  className="w-full p-2.5 border border-[#E7E4D9] bg-[#F2F0E8] rounded-xl text-xs outline-none focus:border-[#C9A400]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Success Ticket */}
          {step === 5 && createdAppointment && (
            <div className="text-center py-4 sm:py-6 space-y-4 sm:space-y-5 animate-fadeIn">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#12151C] font-['Outfit']">Appointment Confirmed!</h3>
                <p className="text-xs text-[#5B5F66] mt-1">
                  Ticket No: <strong className="text-[#C9A400]">{createdAppointment.appointmentNo}</strong>
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-[#F2F0E8] rounded-2xl border border-[#E7E4D9] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#5B5F66]">Doctor:</span>
                  <span className="font-bold text-[#12151C]">{createdAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B5F66]">Date & Slot:</span>
                  <span className="font-bold text-[#12151C]">{createdAppointment.date} at {createdAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5B5F66]">Patient:</span>
                  <span className="font-bold text-[#12151C]">{createdAppointment.patientName}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={() => downloadAppointmentTicketPDF(createdAppointment)}
                  className="btn-gold w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold px-5 py-3 rounded-xl shadow-md"
                >
                  <Download className="w-4 h-4 text-[#0D0F14]" />
                  <span>Download Ticket PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto text-xs font-bold text-[#12151C] bg-[#E7E4D9] hover:bg-[#F2F0E8] px-5 py-3 rounded-xl transition-all"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="p-3.5 sm:p-4 bg-[#F2F0E8] border-t border-[#E7E4D9] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="text-xs font-bold text-[#5B5F66] hover:text-[#12151C] px-2 py-1"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#5B5F66] hover:text-[#12151C] px-2 py-1"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && !selectedDoctorId) ||
                  (step === 2 && (!bookingDate || !selectedTimeSlot)) ||
                  (step === 3 && (!patientName || !patientPhone))
                }
                onClick={() => setStep((step + 1) as any)}
                className="btn-gold flex items-center gap-2 text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompleteBooking}
                className="btn-gold flex items-center gap-2 text-xs font-bold px-4 sm:px-6 py-2.5 rounded-xl shadow-md"
              >
                {isProcessing ? 'Processing...' : `Pay ৳${selectedDoctor?.consultationFee} & Confirm`}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
