import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  Video, 
  Download, 
  Printer, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEPARTMENTS_DATA, DOCTORS_DATA, TIME_SLOTS } from '../data/hospitalData';
import { Appointment, Doctor, Department } from '../types';
import { saveAppointmentToDb, generateReferenceNumber, generateICSFile } from '../utils/appointmentStorage';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillDoctorId?: string;
  prefillDeptId?: string;
  onViewMyAppointments: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  prefillDoctorId,
  prefillDeptId,
  onViewMyAppointments,
}) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [consultationMode, setConsultationMode] = useState<'in-person' | 'video'>('in-person');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [hasPreviousVisit, setHasPreviousVisit] = useState(false);

  // Confirmed Appointment Result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill user details if logged in
  useEffect(() => {
    if (currentUser) {
      if (userProfile?.displayName) setPatientName(userProfile.displayName);
      else if (currentUser.displayName) setPatientName(currentUser.displayName);

      if (currentUser.email) setPatientEmail(currentUser.email);
      if (userProfile?.phone) setPatientPhone(userProfile.phone);
      if (userProfile?.age) setPatientAge(userProfile.age);
      if (userProfile?.gender) setPatientGender(userProfile.gender);
    }
  }, [currentUser, userProfile, isOpen]);

  // Initialize or update when prefill changes or opened
  useEffect(() => {
    if (isOpen) {
      if (prefillDoctorId) {
        const doc = DOCTORS_DATA.find(d => d.id === prefillDoctorId);
        if (doc) {
          setSelectedDoctorId(doc.id);
          setSelectedDeptId(doc.departmentId);
        }
      } else if (prefillDeptId) {
        setSelectedDeptId(prefillDeptId);
        // Default to head or first doctor of dept
        const firstDoc = DOCTORS_DATA.find(d => d.departmentId === prefillDeptId);
        if (firstDoc) setSelectedDoctorId(firstDoc.id);
      } else if (!selectedDeptId) {
        setSelectedDeptId(DEPARTMENTS_DATA[0].id);
        const firstDoc = DOCTORS_DATA.find(d => d.departmentId === DEPARTMENTS_DATA[0].id);
        if (firstDoc) setSelectedDoctorId(firstDoc.id);
      }

      // Default date to tomorrow if empty
      if (!selectedDate) {
        const tomorrow = new Date(Date.now() + 86400000);
        setSelectedDate(tomorrow.toISOString().split('T')[0]);
      }
      if (!selectedTimeSlot) {
        setSelectedTimeSlot('10:00 AM');
      }
    }
  }, [isOpen, prefillDoctorId, prefillDeptId]);

  if (!isOpen) return null;

  const currentDoctor = DOCTORS_DATA.find(d => d.id === selectedDoctorId) || DOCTORS_DATA[0];
  const currentDept = DEPARTMENTS_DATA.find(d => d.id === selectedDeptId) || DEPARTMENTS_DATA[0];

  // Doctors in current department
  const availableDoctorsInDept = DOCTORS_DATA.filter(d => d.departmentId === selectedDeptId);

  // Generate next 14 days
  const upcomingDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    const isoString = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayFullName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isDocAvailable = currentDoctor?.availableDays.includes(dayFullName);
    return {
      isoString,
      dayName,
      dayFullName,
      dayNumber,
      monthName,
      isAvailable: isDocAvailable,
    };
  });

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const docs = DOCTORS_DATA.filter(d => d.departmentId === deptId);
    if (docs.length > 0) {
      setSelectedDoctorId(docs[0].id);
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!selectedDeptId) errs.dept = 'Please select a department';
    if (!selectedDoctorId) errs.doctor = 'Please select a specialist doctor';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!selectedDate) errs.date = 'Please select a consultation date';
    if (!selectedTimeSlot) errs.slot = 'Please select a time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) errs.name = 'Patient full name is required';
    if (!patientPhone.trim() || patientPhone.length < 8) errs.phone = 'Valid contact phone number is required';
    if (!patientEmail.trim() || !patientEmail.includes('@')) errs.email = 'Valid email address is required';
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) errs.age = 'Valid age is required';
    if (!reasonForVisit.trim()) errs.reason = 'Please briefly state symptoms or reason for visit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    // Room assignment
    const blockRooms = ['OPD Suite 201, Block A', 'OPD Suite 204, Block B', 'Consultation Pod 3, Wing C', 'Specialist Cabin 108'];
    const room = blockRooms[Math.floor(Math.random() * blockRooms.length)];

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      referenceNumber: generateReferenceNumber(),
      userId: currentUser?.uid,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.title,
      departmentId: currentDept.id,
      departmentName: currentDept.name,
      doctorAvatar: currentDoctor.avatar,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: Number(patientAge),
      patientGender,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      mode: consultationMode,
      reasonForVisit: reasonForVisit.trim(),
      hasPreviousVisit,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      fee: currentDoctor.consultationFee,
      roomNumber: room,
    };

    await saveAppointmentToDb(newAppointment);
    setIsSubmitting(false);
    setConfirmedAppointment(newAppointment);
    setStep(4);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#06b6d4', '#3b82f6', '#10b981'],
      });
    } catch (err) {
      // ignore
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setConfirmedAppointment(null);
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setReasonForVisit('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-teal-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {step === 4 ? 'Appointment Confirmed!' : 'Book Doctor Appointment'}
              </h2>
              <p className="text-xs text-teal-200">
                {step === 4 ? 'Your booking has been scheduled at WeCare Hospitals' : 'Fast, reliable OPD & video consultations with top specialists'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? 'bg-teal-600 text-white' : step > 1 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span className={`text-xs font-medium ${step === 1 ? 'text-teal-900 font-bold' : 'text-slate-500'}`}>
                  Specialist & Dept
                </span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-200"></div>

              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-teal-600 text-white' : step > 2 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step > 2 ? '✓' : '2'}
                </span>
                <span className={`text-xs font-medium ${step === 2 ? 'text-teal-900 font-bold' : 'text-slate-500'}`}>
                  Date & Slot
                </span>
              </div>
              <div className="w-8 sm:w-16 h-0.5 bg-slate-200"></div>

              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  3
                </span>
                <span className={`text-xs font-medium ${step === 3 ? 'text-teal-900 font-bold' : 'text-slate-500'}`}>
                  Patient Info
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-slate-800">
          {/* STEP 1: Select Department and Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Clinical Department / Specialty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {DEPARTMENTS_DATA.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDeptChange(dept.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-teal-900 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-semibold text-xs leading-tight line-clamp-2">
                          {dept.name.split('&')[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-2">
                          {DOCTORS_DATA.filter(d => d.departmentId === dept.id).length} Doctors
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.dept && <p className="text-rose-600 text-xs mt-1">{errors.dept}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Choose Specialist Doctor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableDoctorsInDept.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-teal-50/90 to-cyan-50/50 border-teal-600 ring-2 ring-teal-600/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {doc.name}
                            </h4>
                            {doc.isHeadOfDept && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                                Dept Head
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {doc.experienceYears}+ yrs exp • ⭐ {doc.rating}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-600 font-medium">Fee: <strong className="text-teal-900">${doc.consultationFee}</strong></span>
                            <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                              {doc.availableDays.length} days / wk
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.doctor && <p className="text-rose-600 text-xs mt-1">{errors.doctor}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Select Mode, Date and Time Slot */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Doctor Summary Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentDoctor.avatar}
                    alt={currentDoctor.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{currentDoctor.name}</h4>
                    <p className="text-xs text-teal-700">{currentDoctor.departmentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Consultation Fee</span>
                  <p className="text-base font-bold text-teal-900">${currentDoctor.consultationFee}</p>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Consultation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationMode('in-person')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      consultationMode === 'in-person'
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-teal-950'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${consultationMode === 'in-person' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Hospital OPD In-Person Visit</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Physical consultation at WeCare Hospitals Medical District</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationMode('video')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      consultationMode === 'video'
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-teal-950'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${consultationMode === 'video' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Online Video Teleconsultation</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Secure HD video conference with digital prescription</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Select Appointment Date
                  </label>
                  <span className="text-xs text-slate-500">
                    Doctor active on: {currentDoctor.availableDays.map(d => d.slice(0, 3)).join(', ')}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {upcomingDates.slice(0, 7).map((d) => {
                    const isSelected = selectedDate === d.isoString;
                    return (
                      <button
                        key={d.isoString}
                        type="button"
                        disabled={!d.isAvailable}
                        onClick={() => setSelectedDate(d.isoString)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          !d.isAvailable
                            ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md font-bold'
                            : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-800'
                        }`}
                      >
                        <span className="text-[11px] uppercase font-semibold">{d.dayName}</span>
                        <span className="text-lg font-extrabold my-0.5">{d.dayNumber}</span>
                        <span className="text-[10px]">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.date && <p className="text-rose-600 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Select Preferred Time Slot
                </label>
                <div className="space-y-3">
                  {TIME_SLOTS.map((group) => (
                    <div key={group.period} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        {group.period} Sessions
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {group.slots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-white'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.slot && <p className="text-rose-600 text-xs mt-1">{errors.slot}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-5">
              {/* Auth Prompt or Authenticated Status */}
              {!currentUser ? (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
                  <div className="flex items-start gap-2.5">
                    <LogIn className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900">Have a WeCare Patient Account?</p>
                      <p className="text-amber-800">Sign in or create an account to auto-fill details and sync bookings to cloud.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin', 'Sign in to auto-fill patient profile and sync this appointment')}
                    className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Sign Up</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Booking as: <strong>{userProfile?.displayName || currentUser.displayName || currentUser.email}</strong> ({currentUser.email})
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    Cloud Synced
                  </span>
                </div>
              )}

              {/* Summary of Selection */}
              <div className="bg-teal-50/80 p-4 rounded-2xl border border-teal-200 flex items-center justify-between flex-wrap gap-2 text-xs text-teal-950">
                <div>
                  <span className="font-semibold text-teal-800">Booking with:</span>{' '}
                  <strong>{currentDoctor.name}</strong> ({currentDept.name.split('&')[0]})
                </div>
                <div className="flex items-center gap-3">
                  <span>📅 {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot}</span>
                  <span className="capitalize px-2 py-0.5 bg-teal-200/80 rounded font-bold">
                    {consultationMode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                  {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-rose-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Age"
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    />
                    {errors.age && <p className="text-rose-600 text-xs mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender *
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Visit / Main Symptoms *
                </label>
                <textarea
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="Describe your symptoms, previous medical history, or specific questions for the doctor..."
                  rows={3}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                ></textarea>
                {errors.reason && <p className="text-rose-600 text-xs mt-1">{errors.reason}</p>}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prevVisitCheck"
                  checked={hasPreviousVisit}
                  onChange={(e) => setHasPreviousVisit(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="prevVisitCheck" className="text-xs text-slate-600 cursor-pointer">
                  I have previously consulted or been admitted at WeCare Hospitals
                </label>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p>
                  Zero prepayment required. You may pay at the OPD billing counter via Cash, Credit/Debit Card, UPI, or Cashless Insurance.
                </p>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Digital Pass */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Appointment Confirmed!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  We have reserved your consultation slot and sent confirmation details to{' '}
                  <strong className="text-slate-900">{confirmedAppointment.patientEmail}</strong>
                </p>
              </div>

              {/* Digital Pass / Slip Card */}
              <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl border-2 border-dashed border-teal-400/80 p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-teal-600 text-white font-extrabold text-xs uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                  Confirmed
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                      Appointment Reference Number
                    </span>
                    <span className="text-2xl font-extrabold tracking-wider text-teal-900">
                      {confirmedAppointment.referenceNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                      Consultation Fee
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      ${confirmedAppointment.fee} (Pay at desk)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400 font-medium block">Specialist Physician</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{confirmedAppointment.doctorName}</p>
                    <p className="text-teal-700">{confirmedAppointment.departmentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Patient Name & Details</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{confirmedAppointment.patientName}</p>
                    <p className="text-slate-600">{confirmedAppointment.patientAge} yrs • {confirmedAppointment.patientGender} • {confirmedAppointment.patientPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Date & Time</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {new Date(confirmedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-teal-700 font-semibold">{confirmedAppointment.timeSlot}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Location / Mode</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {confirmedAppointment.mode === 'in-person' ? 'WeCare Main Campus' : 'Online Tele-Consult'}
                    </p>
                    <p className="text-slate-600">{confirmedAppointment.roomNumber || 'WeCare Medical OPD'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generateICSFile(confirmedAppointment)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600" />
                      <span>Add to Calendar (.ics)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Need help? Call: 1800-932-273
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            {step === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Date & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-xl shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Booking</span>
              </button>
            )}

            {step === 4 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onViewMyAppointments();
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-teal-400" />
                  <span>View in My Bookings</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
