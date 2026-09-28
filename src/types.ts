export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  gender: 'male' | 'female';
  languages: string[];
  consultationFee: number;
  availableDays: string[];
  availableModes: ('in-person' | 'video')[];
  about: string;
  specializations: string[];
  education: string[];
  achievements?: string[];
  isHeadOfDept?: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  bannerImage: string;
  headDoctorName: string;
  headDoctorId: string;
  keyServices: string[];
  commonConditions: string[];
  technologies: string[];
  bedCapacity: number;
  emergencyAvailable: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  allergies?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  departmentId: string;
  departmentName: string;
  doctorAvatar: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 10:30 AM"
  mode: 'in-person' | 'video';
  reasonForVisit: string;
  hasPreviousVisit: boolean;
  status: 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: string;
  fee: number;
  roomNumber?: string;
}

export interface Review {
  id: string;
  patientName: string;
  doctorName?: string;
  departmentName: string;
  rating: number;
  date: string;
  comment: string;
  patientLocation: string;
  verified: boolean;
}

export interface HospitalStat {
  label: string;
  value: string;
  icon: string;
  description: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  testsIncludedCount: number;
  targetAudience: string;
  features: string[];
  popular?: boolean;
}
