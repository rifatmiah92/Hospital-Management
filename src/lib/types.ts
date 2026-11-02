export type UserRole = 'patient' | 'doctor' | 'lab' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface PatientProfile {
  userId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  emergencyContact: string;
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  doctorCount: number;
  featured: boolean;
  image: string;
}

export interface DoctorSchedule {
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00 AM'
  endTime: string;   // '05:00 PM'
  slotDurationMinutes: number; // e.g. 30
}

export interface Doctor {
  id: string;
  userId: string;
  bmdcRegNo: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  qualifications: string;
  experienceYears: number;
  bio: string;
  photo: string;
  consultationFee: number; // BDT
  rating: number;
  reviewCount: number;
  schedules: DoctorSchedule[];
  availableDays: string[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Card' | 'Cash';

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorPhoto: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. '10:30 AM'
  status: AppointmentStatus;
  consultationType: 'In-person' | 'Video Consultation';
  fee: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export type TestOrderStatus = 'pending' | 'processing' | 'ready';

export interface TestOrder {
  id: string;
  orderNo: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  testName: string;
  category: string;
  status: TestOrderStatus;
  orderedDate: string;
  sampleCollectedDate?: string;
  readyDate?: string;
  cost: number;
}

export interface TestReport {
  id: string;
  testOrderId: string;
  testName: string;
  patientId: string;
  patientName: string;
  uploadedBy: string;
  uploadedAt: string;
  summary: string;
  metrics: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  notes?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string; // e.g. "1 + 0 + 1"
  timing: 'Before Food' | 'After Food' | 'With Food';
  durationDays: number;
}

export interface Prescription {
  id: string;
  prescriptionNo: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorQualifications: string;
  doctorBmdcNo: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advisedTests: string[];
  generalAdvice: string;
  followUpDate?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientId: string;
  patientName: string;
  items: {
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  issuedDate: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'report' | 'prescription' | 'system';
  isRead: boolean;
  createdAt: string;
}
