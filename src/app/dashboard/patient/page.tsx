'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { Appointment, TestReport, Prescription, PatientProfile, User } from '@/lib/types';
import { downloadAppointmentTicketPDF, downloadPrescriptionPDF, downloadTestReportPDF } from '@/lib/pdf-generator';
import { Calendar, FileText, Pill, Download, Plus, Eye, X } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

export default function PatientDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [selectedReportView, setSelectedReportView] = useState<TestReport | null>(null);

  const loadData = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setAppointments(CarePlusStore.getAppointmentsByPatient(user.id));
      setReports(CarePlusStore.getTestReportsByPatient(user.id));
      setPrescriptions(CarePlusStore.getPrescriptionsByPatient(user.id));
      setProfile(CarePlusStore.getPatientProfile(user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Appointments</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{appointments.length}</div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Ready Lab Reports</div>
            <div className="text-2xl font-extrabold text-sky-600 mt-1">{reports.length}</div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Digital Prescriptions</div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">{prescriptions.length}</div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* 2. Appointments Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">My Appointments</h3>
            <p className="text-xs text-slate-500">Scheduled consultations and appointment history</p>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No appointment records found.</div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={apt.doctorPhoto}
                    alt={apt.doctorName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                        {apt.appointmentNo}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-medium">{apt.departmentName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>📅 {apt.date} at {apt.timeSlot}</span>
                      <span>• Fee: ৳{apt.fee}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'completed'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status}
                  </span>

                  <button
                    onClick={() => downloadAppointmentTicketPDF(apt)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ticket PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. My Test Reports Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">My Test Reports</h3>
          <p className="text-xs text-slate-500">Download officially verified lab diagnostic reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.length === 0 ? (
            <div className="col-span-full p-6 text-center text-xs text-slate-400">No test reports available.</div>
          ) : (
            reports.map((rep) => (
              <div key={rep.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rep.testName}</h4>
                    <p className="text-[11px] text-slate-500">Uploaded: {rep.uploadedAt}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    READY
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{rep.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 gap-2">
                  <button
                    onClick={() => setSelectedReportView(rep)}
                    className="text-xs font-bold text-slate-700 hover:text-teal-600 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Parameters</span>
                  </button>

                  <button
                    onClick={() => downloadTestReportPDF(rep)}
                    className="flex items-center gap-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. My Digital Prescriptions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">My Prescriptions</h3>
          <p className="text-xs text-slate-500">Digital Rx issued by CarePlus specialist doctors</p>
        </div>

        <div className="divide-y divide-slate-100">
          {prescriptions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No prescriptions issued yet.</div>
          ) : (
            prescriptions.map((pres) => (
              <div key={pres.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Rx: {pres.doctorName}</div>
                  <div className="text-xs text-teal-700 font-medium">Diagnosis: {pres.diagnosis}</div>
                  <div className="text-[11px] text-slate-500">Issued: {pres.date} • Rx No: {pres.prescriptionNo}</div>
                </div>

                <button
                  onClick={() => downloadPrescriptionPDF(pres)}
                  className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-auto transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Rx PDF</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Parameter Viewer Modal */}
      {selectedReportView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 max-h-[88vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedReportView.testName}</h3>
                <p className="text-xs text-slate-500">{selectedReportView.uploadedAt}</p>
              </div>
              <button
                onClick={() => setSelectedReportView(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Test Parameters:</h4>
              <div className="divide-y divide-slate-100 text-xs">
                {selectedReportView.metrics.map((m, idx) => (
                  <div key={idx} className="py-2 flex justify-between gap-2">
                    <div>
                      <div className="font-semibold text-slate-800">{m.parameter}</div>
                      <div className="text-[10px] text-slate-400">Ref: {m.referenceRange}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`font-bold ${m.status === 'abnormal' ? 'text-rose-600' : 'text-slate-900'}`}>
                        {m.value} {m.unit}
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${m.status === 'abnormal' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => downloadTestReportPDF(selectedReportView)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Report PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isBookingOpen && <BookingModal onClose={() => setIsBookingOpen(false)} />}

    </div>
  );
}
