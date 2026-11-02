'use client';

import {
  User,
  UserRole,
  PatientProfile,
  Department,
  Doctor,
  Appointment,
  TestOrder,
  TestReport,
  Prescription,
  Invoice,
  AppNotification
} from './types';
import {
  INITIAL_USERS,
  INITIAL_PATIENT_PROFILES,
  INITIAL_DEPARTMENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_TEST_ORDERS,
  INITIAL_TEST_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS
} from './mock-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'careplus_current_user',
  USERS: 'careplus_users',
  PATIENTS: 'careplus_patient_profiles',
  DEPARTMENTS: 'careplus_departments',
  DOCTORS: 'careplus_doctors',
  APPOINTMENTS: 'careplus_appointments',
  TEST_ORDERS: 'careplus_test_orders',
  TEST_REPORTS: 'careplus_test_reports',
  PRESCRIPTIONS: 'careplus_prescriptions',
  INVOICES: 'careplus_invoices',
  NOTIFICATIONS: 'careplus_notifications',
};

// Helper for client-side storage retrieval
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

export const CarePlusStore = {
  // --- Auth & User State ---
  getCurrentUser(): User {
    return getStorageItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  setCurrentUser(user: User): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  switchRole(role: UserRole): User {
    const users = this.getUsers();
    const userForRole = users.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    this.setCurrentUser(userForRole);
    return userForRole;
  },

  getUsers(): User[] {
    return getStorageItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getPatientProfile(userId: string): PatientProfile {
    const profiles = getStorageItem<Record<string, PatientProfile>>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENT_PROFILES);
    return profiles[userId] || {
      userId,
      age: 30,
      gender: 'Male',
      bloodGroup: 'O+',
      address: 'Dhaka, Bangladesh',
      emergencyContact: '01700000000',
    };
  },

  updatePatientProfile(profile: PatientProfile): void {
    const profiles = getStorageItem<Record<string, PatientProfile>>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENT_PROFILES);
    profiles[profile.userId] = profile;
    setStorageItem(STORAGE_KEYS.PATIENTS, profiles);
  },

  // --- Departments ---
  getDepartments(): Department[] {
    return getStorageItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  getDepartmentBySlug(slug: string): Department | undefined {
    return this.getDepartments().find(d => d.slug === slug);
  },

  addDepartment(department: Omit<Department, 'id'>): Department {
    const departments = this.getDepartments();
    const newDept: Department = {
      ...department,
      id: `dept-${Date.now()}`,
    };
    departments.push(newDept);
    setStorageItem(STORAGE_KEYS.DEPARTMENTS, departments);
    return newDept;
  },

  // --- Doctors ---
  getDoctors(): Doctor[] {
    return getStorageItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find(d => d.id === id);
  },

  addDoctor(doctor: Omit<Doctor, 'id'>): Doctor {
    const doctors = this.getDoctors();
    const newDoctor: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`,
    };
    doctors.push(newDoctor);
    setStorageItem(STORAGE_KEYS.DOCTORS, doctors);
    return newDoctor;
  },

  // --- Appointments ---
  getAppointments(): Appointment[] {
    return getStorageItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return this.getAppointments().filter(a => a.patientId === patientId);
  },

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return this.getAppointments().filter(a => a.doctorId === doctorId);
  },

  createAppointment(data: Omit<Appointment, 'id' | 'appointmentNo' | 'createdAt'>): Appointment {
    const appointments = this.getAppointments();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      appointmentNo: `CP-${new Date().getFullYear()}-${randomSeq}`,
      createdAt: new Date().toISOString(),
    };
    appointments.unshift(newAppointment);
    setStorageItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Also trigger notification for patient
    this.addNotification({
      userId: data.patientId,
      title: 'Appointment Booked 🎉',
      message: `Your appointment with ${data.doctorName} on ${data.date} at ${data.timeSlot} is ${data.status}.`,
      type: 'appointment',
    });

    // Generate Invoice automatically
    this.createInvoice({
      patientId: data.patientId,
      patientName: data.patientName,
      items: [{ description: `Consultation Fee (${data.doctorName})`, amount: data.fee }],
      totalAmount: data.fee,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod || 'bKash',
      issuedDate: data.date,
    });

    return newAppointment;
  },

  updateAppointmentStatus(id: string, status: Appointment['status']): void {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].status = status;
      setStorageItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    }
  },

  // --- Test Orders & Reports ---
  getTestOrders(): TestOrder[] {
    return getStorageItem<TestOrder[]>(STORAGE_KEYS.TEST_ORDERS, INITIAL_TEST_ORDERS);
  },

  getTestReports(): TestReport[] {
    return getStorageItem<TestReport[]>(STORAGE_KEYS.TEST_REPORTS, INITIAL_TEST_REPORTS);
  },

  getTestReportsByPatient(patientId: string): TestReport[] {
    return this.getTestReports().filter(r => r.patientId === patientId);
  },

  createTestReport(data: Omit<TestReport, 'id' | 'uploadedAt'>): TestReport {
    const reports = this.getTestReports();
    const newReport: TestReport = {
      ...data,
      id: `rep-${Date.now()}`,
      uploadedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    };
    reports.unshift(newReport);
    setStorageItem(STORAGE_KEYS.TEST_REPORTS, reports);

    // Update Test Order Status to ready
    const orders = this.getTestOrders();
    const orderIndex = orders.findIndex(o => o.id === data.testOrderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'ready';
      orders[orderIndex].readyDate = newReport.uploadedAt;
      setStorageItem(STORAGE_KEYS.TEST_ORDERS, orders);
    }

    // Trigger notification
    this.addNotification({
      userId: data.patientId,
      title: 'Lab Report Ready 📄',
      message: `Your report for ${data.testName} is now available in your CarePlus Patient Portal.`,
      type: 'report',
    });

    return newReport;
  },

  // --- Prescriptions ---
  getPrescriptions(): Prescription[] {
    return getStorageItem<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },

  getPrescriptionsByPatient(patientId: string): Prescription[] {
    return this.getPrescriptions().filter(p => p.patientId === patientId);
  },

  createPrescription(data: Omit<Prescription, 'id' | 'prescriptionNo'>): Prescription {
    const prescriptions = this.getPrescriptions();
    const seq = Math.floor(10000 + Math.random() * 90000);
    const newPrescription: Prescription = {
      ...data,
      id: `pres-${Date.now()}`,
      prescriptionNo: `RX-${seq}`,
    };
    prescriptions.unshift(newPrescription);
    setStorageItem(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);

    // Mark appointment as completed
    this.updateAppointmentStatus(data.appointmentId, 'completed');

    // Trigger Notification
    this.addNotification({
      userId: data.patientId,
      title: 'New Digital Prescription 💊',
      message: `Dr. ${data.doctorName} has issued a digital prescription for your consultation on ${data.date}.`,
      type: 'prescription',
    });

    return newPrescription;
  },

  // --- Invoices ---
  getInvoices(): Invoice[] {
    return getStorageItem<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  },

  createInvoice(data: Omit<Invoice, 'id' | 'invoiceNo'>): Invoice {
    const invoices = this.getInvoices();
    const seq = Math.floor(100 + Math.random() * 900);
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-${new Date().getFullYear()}-${seq}`,
    };
    invoices.unshift(newInvoice);
    setStorageItem(STORAGE_KEYS.INVOICES, invoices);
    return newInvoice;
  },

  // --- Notifications ---
  getNotifications(userId: string): AppNotification[] {
    const notifs = getStorageItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return notifs.filter(n => n.userId === userId);
  },

  addNotification(data: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): void {
    const notifs = getStorageItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  markNotificationsAsRead(userId: string): void {
    const notifs = getStorageItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    notifs.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
};
