'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { Appointment, Doctor, Prescription, User } from '@/lib/types';
import { downloadPrescriptionPDF } from '@/lib/pdf-generator';
import { Calendar, Users, Pill, Plus, CheckCircle2, Clock, FileText, Trash2, X, Download } from 'lucide-react';

export default function DoctorDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Prescription Form State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [generalAdvice, setGeneralAdvice] = useState('');
  const [medicines, setMedicines] = useState<{ name: string; dosage: string; timing: 'Before Food' | 'After Food' | 'With Food'; durationDays: number }[]>([
    { name: 'Tab. Bizoran 5/20 mg', dosage: '1 + 0 + 0', timing: 'After Food', durationDays: 30 },
  ]);
  const [advisedTests, setAdvisedTests] = useState<string[]>(['Lipid Profile', 'ECG 12-Lead']);
  const [newTestInput, setNewTestInput] = useState('');

  const loadData = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const docs = CarePlusStore.getDoctors();
      const currentDoc = docs.find(d => d.userId === user.id) || docs[0];
      setDoctorInfo(currentDoc);
      setAppointments(CarePlusStore.getAppointmentsByDoctor(currentDoc.id));
      setPrescriptions(CarePlusStore.getPrescriptions());
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (aptId: string, status: Appointment['status']) => {
    CarePlusStore.updateAppointmentStatus(aptId, status);
    loadData();
  };

  const openPrescriptionForAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsPrescriptionModalOpen(true);
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '1 + 0 + 1', timing: 'After Food', durationDays: 7 }]);
  };

  const removeMedicineRow = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !doctorInfo) return;

    const newPres = CarePlusStore.createPrescription({
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.patientId,
      patientName: selectedAppointment.patientName,
      patientAge: 32,
      patientGender: 'Male',
      doctorId: doctorInfo.id,
      doctorName: doctorInfo.name,
      doctorQualifications: doctorInfo.qualifications,
      doctorBmdcNo: doctorInfo.bmdcRegNo,
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosis || 'General Clinical Consultation',
      medicines: medicines.filter(m => m.name.trim().length > 0),
      advisedTests: advisedTests,
      generalAdvice: generalAdvice || 'Rest, fluid intake, and follow up in 2 weeks.',
      followUpDate: '2026-08-10',
    });

    setIsPrescriptionModalOpen(false);
    downloadPrescriptionPDF(newPres);
    loadData();
  };

  if (!currentUser || !doctorInfo) return null;

  return (
    <div className="space-y-8">
      
      {/* Doctor Profile Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={doctorInfo.photo}
            alt={doctorInfo.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-teal-400"
          />
          <div>
            <h2 className="text-xl font-extrabold text-white">{doctorInfo.name}</h2>
            <p className="text-xs text-teal-400 font-semibold">{doctorInfo.designation} • {doctorInfo.departmentName}</p>
            <p className="text-[11px] text-slate-400 mt-1">BMDC Registration No: {doctorInfo.bmdcRegNo}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Consultation Fee</div>
            <div className="text-base font-extrabold text-teal-400">৳{doctorInfo.consultationFee}</div>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Patient Rating</div>
            <div className="text-base font-extrabold text-amber-400">⭐ {doctorInfo.rating}</div>
          </div>
        </div>
      </div>

      {/* Appointment Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Today's Consultation Queue</h3>
            <p className="text-xs text-slate-500">Manage patient visits and issue digital prescriptions</p>
          </div>

          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {appointments.length} Appointments Scheduled
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No scheduled patients today.</div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{apt.patientName}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                      {apt.appointmentNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Phone: {apt.patientPhone}</p>
                  <p className="text-[11px] text-slate-500">Slot: ⏰ {apt.timeSlot} | Date: {apt.date}</p>
                  {apt.notes && <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md mt-1 font-medium">Notes: {apt.notes}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value as any)}
                    className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => openPrescriptionForAppointment(apt)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl shadow-sm transition-all"
                  >
                    <Pill className="w-4 h-4" />
                    <span>Create Prescription</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Digital Prescription Generator Modal */}
      {isPrescriptionModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-slate-100">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Digital Prescription Generator</h3>
                <p className="text-xs text-teal-700 font-semibold">
                  Patient: {selectedAppointment.patientName} ({selectedAppointment.appointmentNo})
                </p>
              </div>
              <button onClick={() => setIsPrescriptionModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-5">
              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension, Bronchial Asthma..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Medicines List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Prescribed Medications</label>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                {medicines.map((med, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Medicine Name (e.g. Tab. Napa 500mg)"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...medicines];
                          updated[idx].name = e.target.value;
                          setMedicines(updated);
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Dose (1+0+1)"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...medicines];
                          updated[idx].dosage = e.target.value;
                          setMedicines(updated);
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <select
                        value={med.timing}
                        onChange={(e) => {
                          const updated = [...medicines];
                          updated[idx].timing = e.target.value as any;
                          setMedicines(updated);
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="After Food">After Food</option>
                        <option value="Before Food">Before Food</option>
                        <option value="With Food">With Food</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 text-right">
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicineRow(idx)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* General Advice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doctor Advice & Lifestyle Instructions</label>
                <textarea
                  rows={3}
                  value={generalAdvice}
                  onChange={(e) => setGeneralAdvice(e.target.value)}
                  placeholder="e.g. Low salt diet, drink plenty of water, avoid oily foods..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-xl shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Issue & Download Rx PDF</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
