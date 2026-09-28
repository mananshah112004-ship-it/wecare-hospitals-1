import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Video, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Stethoscope, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEPARTMENTS_DATA, DOCTORS_DATA, TIME_SLOTS, HOSPITAL_INFO } from '../data/hospitalData';
import { Appointment, Doctor } from '../types';
import { saveAppointmentToDb, generateReferenceNumber, generateICSFile } from '../utils/appointmentStorage';
import { useAuth } from '../context/AuthContext';

interface BookAppointmentPageProps {
  onViewMyAppointments: () => void;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({
  onViewMyAppointments,
}) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS_DATA[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    DOCTORS_DATA.filter(d => d.departmentId === DEPARTMENTS_DATA[0].id)[0]?.id || DOCTORS_DATA[0].id
  );
  const [consultationMode, setConsultationMode] = useState<'in-person' | 'video'>('in-person');

  // Tomorrow by default
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [hasPreviousVisit, setHasPreviousVisit] = useState(false);

  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync profile details if logged in
  useEffect(() => {
    if (currentUser) {
      if (userProfile?.displayName) setPatientName(userProfile.displayName);
      else if (currentUser.displayName) setPatientName(currentUser.displayName);

      if (currentUser.email) setPatientEmail(currentUser.email);
      if (userProfile?.phone) setPatientPhone(userProfile.phone);
      if (userProfile?.age) setPatientAge(userProfile.age);
      if (userProfile?.gender) setPatientGender(userProfile.gender);
    }
  }, [currentUser, userProfile]);

  const currentDoctor = DOCTORS_DATA.find(d => d.id === selectedDoctorId) || DOCTORS_DATA[0];
  const currentDept = DEPARTMENTS_DATA.find(d => d.id === selectedDeptId) || DEPARTMENTS_DATA[0];

  const availableDoctorsInDept = DOCTORS_DATA.filter(d => d.departmentId === selectedDeptId);

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

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) errs.name = 'Patient full name is required';
    if (!patientPhone.trim() || patientPhone.length < 8) errs.phone = 'Valid contact phone is required';
    if (!patientEmail.trim() || !patientEmail.includes('@')) errs.email = 'Valid email is required';
    if (!patientAge || Number(patientAge) <= 0) errs.age = 'Valid age is required';
    if (!reasonForVisit.trim()) errs.reason = 'Please provide symptoms or reason for visit';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    const blockRooms = ['OPD Suite 204, Block A', 'OPD Suite 310, Block B', 'Consultation Wing C, Room 12'];
    const room = blockRooms[Math.floor(Math.random() * blockRooms.length)];

    const newApt: Appointment = {
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

    await saveAppointmentToDb(newApt);
    setIsSubmitting(false);
    setConfirmedAppointment(newApt);
    setStep(4);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#06b6d4', '#3b82f6'],
      });
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Zero Booking Charges • Instant Pass
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Schedule Doctor Consultation
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Select a specialty department, choose from {DOCTORS_DATA.length} top specialists, and book your preferred date & time.
          </p>
        </div>

        <button
          onClick={onViewMyAppointments}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          View My Saved Bookings
        </button>
      </div>

      {/* Main Booking Wizard Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Step Progress Header */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-semibold">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-900' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step === 1 ? 'bg-teal-600 text-white' : step > 1 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200'
                }`}>
                  1
                </span>
                <span>Department & Doctor</span>
              </div>

              <div className="w-12 sm:w-20 h-0.5 bg-slate-200"></div>

              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-900' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step === 2 ? 'bg-teal-600 text-white' : step > 2 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200'
                }`}>
                  2
                </span>
                <span>Date & Slot</span>
              </div>

              <div className="w-12 sm:w-20 h-0.5 bg-slate-200"></div>

              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-900' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                  step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'
                }`}>
                  3
                </span>
                <span>Patient Details</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  1. Choose Speciality Department
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {DEPARTMENTS_DATA.map((dept) => {
                    const isSelected = selectedDeptId === dept.id;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDeptChange(dept.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-600/20'
                            : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="font-bold text-xs leading-snug line-clamp-2">
                          {dept.name.split('&')[0]}
                        </span>
                        <span className={`text-[10px] mt-2 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                          {DOCTORS_DATA.filter(d => d.departmentId === dept.id).length} Specialists
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  2. Select Doctor in {currentDept.name.split('&')[0]}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableDoctorsInDept.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-teal-50/90 to-cyan-50/50 border-teal-600 ring-2 ring-teal-600/20 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {doc.name}
                            </h4>
                            {doc.isHeadOfDept && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                                Head
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {doc.qualification} • {doc.experienceYears}+ yrs exp
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-600 font-semibold">Fee: <strong className="text-teal-900">${doc.consultationFee}</strong></span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              ⭐ {doc.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <span>Select Date & Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Doctor Header */}
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
                  Consultation Mode
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
                      <h4 className="font-bold text-sm">Hospital OPD Visit</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Physical consultation at WeCare Hospitals</p>
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
                      <h4 className="font-bold text-sm">Online Video Teleconsult</h4>
                      <p className="text-xs text-slate-500 mt-0.5">HD video consultation with digital prescription</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Date (Next 14 Days)
                </label>
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
              </div>

              {/* Slot Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Preferred Time Slot
                </label>
                <div className="space-y-3">
                  {TIME_SLOTS.map((group) => (
                    <div key={group.period} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        {group.period} Slots
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
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400'
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
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                >
                  <span>Continue to Patient Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleConfirm} className="space-y-6">
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

              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 flex items-center justify-between flex-wrap gap-2 text-xs text-teal-950">
                <div>
                  <span className="font-semibold">Consulting Doctor:</span>{' '}
                  <strong>{currentDoctor.name}</strong> ({currentDept.name.split('&')[0]})
                </div>
                <div className="font-bold">
                  📅 {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTimeSlot} ({consultationMode.toUpperCase()})
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
                      placeholder="e.g. Eleanor Vance"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                  {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white"
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
                      placeholder="patient@example.com"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white"
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
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gender *
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
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
                  Reason for Visit / Symptoms *
                </label>
                <textarea
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="Describe your symptoms or reason for consulting the doctor..."
                  rows={3}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                ></textarea>
                {errors.reason && <p className="text-rose-600 text-xs mt-1">{errors.reason}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prevVisitPage"
                  checked={hasPreviousVisit}
                  onChange={(e) => setHasPreviousVisit(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="prevVisitPage" className="text-xs text-slate-600">
                  I am an existing patient with an active WeCare Hospital ID
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-600/25 transition-all cursor-pointer text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4 */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Booking Confirmed Successfully!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Reference slip generated and saved to your account.
                </p>
              </div>

              <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl border-2 border-dashed border-teal-400/80 p-6 shadow-md">
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
                    <span className="text-slate-400 font-medium block">Specialist Doctor</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{confirmedAppointment.doctorName}</p>
                    <p className="text-teal-700">{confirmedAppointment.departmentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Patient Information</span>
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
                    <span className="text-slate-400 font-medium block">Location</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {confirmedAppointment.mode === 'in-person' ? 'WeCare Main Campus' : 'Online Tele-Consult'}
                    </p>
                    <p className="text-slate-600">{confirmedAppointment.roomNumber || 'WeCare Medical District'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generateICSFile(confirmedAppointment)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600" />
                      <span>Download Calendar Pass (.ics)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onViewMyAppointments}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    View in My Bookings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
