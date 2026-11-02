'use client';

import React, { useState, useEffect } from 'react';
import { CarePlusStore } from '@/lib/store';
import { Doctor, Department, Appointment, Invoice, User } from '@/lib/types';
import {
  Users,
  Stethoscope,
  Building2,
  Calendar,
  Receipt,
  Plus,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  X,
  Download,
  Filter
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'doctors' | 'departments' | 'appointments' | 'billing'>('analytics');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Add Doctor Form State
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDesignation, setNewDocDesignation] = useState('');
  const [newDocFee, setNewDocFee] = useState(1200);
  const [newDocDeptId, setNewDocDeptId] = useState('');

  const loadData = () => {
    const user = CarePlusStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setDoctors(CarePlusStore.getDoctors());
      setDepartments(CarePlusStore.getDepartments());
      setAppointments(CarePlusStore.getAppointments());
      setInvoices(CarePlusStore.getInvoices());
      if (CarePlusStore.getDepartments().length > 0) {
        setNewDocDeptId(CarePlusStore.getDepartments()[0].id);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0) + appointments.reduce((acc, apt) => acc + apt.fee, 0);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === newDocDeptId) || departments[0];

    CarePlusStore.addDoctor({
      userId: `usr-doc-${Date.now()}`,
      bmdcRegNo: `A-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newDocName || 'Dr. New Specialist',
      title: 'MBBS, FCPS',
      departmentId: dept.id,
      departmentName: dept.name,
      designation: newDocDesignation || 'Consultant Specialist',
      qualifications: 'MBBS (Dhaka Medical College), FCPS',
      experienceYears: 8,
      bio: 'Expert specialist doctor added to CarePlus Medical Center panel.',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      consultationFee: Number(newDocFee),
      rating: 5.0,
      reviewCount: 1,
      schedules: [
        { dayOfWeek: 'Sunday', startTime: '10:00 AM', endTime: '02:00 PM', slotDurationMinutes: 30 },
      ],
      availableDays: ['Sunday', 'Tuesday'],
    });

    setIsAddDoctorModalOpen(false);
    setNewDocName('');
    setNewDocDesignation('');
    loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Admin Tab Navigation - fully responsive touch-scrollable */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none -mx-1 px-1">
        {[
          { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> },
          { key: 'doctors', label: 'Doctors', icon: <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> },
          { key: 'departments', label: 'Departments', icon: <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> },
          { key: 'appointments', label: 'Appointments', icon: <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> },
          { key: 'billing', label: 'Billing & Invoices', icon: <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setSearchTerm('');
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Revenue (BDT)</span>
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">৳{totalRevenue.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 font-bold">↑ 18.5% from last month</div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Appointments</span>
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{appointments.length}</div>
              <div className="text-[11px] text-teal-600 font-bold">100% online booking sync</div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Active Consultants</span>
                <div className="p-2 bg-sky-50 rounded-xl">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctors.length}</div>
              <div className="text-[11px] text-sky-600 font-bold">BMDC Registered</div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Clinical Departments</span>
                <div className="p-2 bg-purple-50 rounded-xl">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{departments.length}</div>
              <div className="text-[11px] text-purple-600 font-bold">Specialized OPD/IPD</div>
            </div>
          </div>

          {/* Recent System Activity Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Recent Hospital Appointments</h3>
                <p className="text-xs text-slate-500">Real-time appointments booked across all hospital departments</p>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
                {appointments.length} Total Registered
              </span>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 whitespace-nowrap">Ticket No</th>
                      <th className="p-3 whitespace-nowrap">Patient</th>
                      <th className="p-3 whitespace-nowrap">Doctor</th>
                      <th className="p-3 whitespace-nowrap">Department</th>
                      <th className="p-3 whitespace-nowrap">Fee</th>
                      <th className="p-3 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{apt.appointmentNo}</td>
                        <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{apt.patientName}</td>
                        <td className="p-3 text-teal-700 font-medium whitespace-nowrap">{apt.doctorName}</td>
                        <td className="p-3 whitespace-nowrap">{apt.departmentName}</td>
                        <td className="p-3 font-bold whitespace-nowrap">৳{apt.fee}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                            apt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR MANAGEMENT */}
      {activeTab === 'doctors' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Hospital Doctor Registry</h3>
              <p className="text-xs text-slate-500">Manage consultant list, credentials & consultation fees</p>
            </div>

            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-xl shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Specialist Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
                <div className="flex items-center gap-3.5">
                  <img src={doc.photo} alt={doc.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-teal-500/20 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                    <p className="text-xs text-teal-700 font-medium truncate">{doc.designation}</p>
                    <p className="text-[10px] text-slate-400">BMDC: {doc.bmdcRegNo}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate mr-2">{doc.departmentName}</span>
                  <span className="font-extrabold text-teal-700 shrink-0">Fee: ৳{doc.consultationFee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Clinical Departments</h3>
            <p className="text-xs text-slate-500">Hospital active clinical centers & assigned specialist doctors</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:border-teal-500/40 transition-colors">
                <h4 className="font-bold text-slate-900 text-base">{dept.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{dept.description}</p>
                <div className="pt-3 border-t border-slate-100 text-xs font-bold text-teal-600">
                  {dept.doctorCount} Active Doctors Assigned
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS OVERVIEW */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">All Hospital Appointments</h3>
              <p className="text-xs text-slate-500">Filter, review, and track clinical visits</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap">Ticket No</th>
                    <th className="p-3.5 whitespace-nowrap">Patient Name</th>
                    <th className="p-3.5 whitespace-nowrap">Phone</th>
                    <th className="p-3.5 whitespace-nowrap">Doctor</th>
                    <th className="p-3.5 whitespace-nowrap">Date & Slot</th>
                    <th className="p-3.5 whitespace-nowrap">Fee</th>
                    <th className="p-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments
                    .filter(a =>
                      !searchTerm ||
                      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.appointmentNo.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">{apt.appointmentNo}</td>
                        <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">{apt.patientName}</td>
                        <td className="p-3.5 whitespace-nowrap">{apt.patientPhone}</td>
                        <td className="p-3.5 text-teal-700 font-medium whitespace-nowrap">{apt.doctorName}</td>
                        <td className="p-3.5 whitespace-nowrap">{apt.date} • {apt.timeSlot}</td>
                        <td className="p-3.5 font-bold whitespace-nowrap">৳{apt.fee}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'completed' ? 'bg-sky-100 text-sky-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Hospital Billing & Invoices</h3>
            <p className="text-xs text-slate-500">Track digital payment transactions, invoice history and receipts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Total Invoiced</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">৳{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Payment Methods</div>
              <div className="text-sm font-bold text-teal-700 mt-1">bKash, Nagad, Card, Cash</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Transactions Count</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{invoices.length + appointments.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap">Invoice ID</th>
                    <th className="p-3.5 whitespace-nowrap">Patient</th>
                    <th className="p-3.5 whitespace-nowrap">Description</th>
                    <th className="p-3.5 whitespace-nowrap">Amount</th>
                    <th className="p-3.5 whitespace-nowrap">Method</th>
                    <th className="p-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">{inv.invoiceNo}</td>
                      <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">{inv.patientName}</td>
                      <td className="p-3.5 whitespace-nowrap">{inv.items.map(i => i.description).join(', ')}</td>
                      <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">৳{inv.totalAmount}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {inv.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                          {inv.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal - Responsive */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 sm:space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Doctor to Panel</h3>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anisur Rahman"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Consultant"
                  value={newDocDesignation}
                  onChange={(e) => setNewDocDesignation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                <select
                  value={newDocDeptId}
                  onChange={(e) => setNewDocDeptId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (BDT) *</label>
                <input
                  type="number"
                  required
                  value={newDocFee}
                  onChange={(e) => setNewDocFee(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
