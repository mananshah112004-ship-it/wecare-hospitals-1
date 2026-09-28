import React from 'react';
import { 
  X, 
  Star, 
  Calendar, 
  GraduationCap, 
  Award, 
  Languages, 
  Clock, 
  CheckCircle, 
  Video, 
  Building2, 
  Stethoscope, 
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctorId: string, deptId: string) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              />
              {doctor.isHeadOfDept && (
                <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow border border-white">
                  Head of Dept
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {doctor.departmentName}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating.toFixed(1)}</span>
                  <span className="text-slate-300 font-normal">({doctor.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {doctor.name}
              </h2>
              <p className="text-teal-200 text-sm font-medium">
                {doctor.title}
              </p>
              <p className="text-xs text-slate-300">
                {doctor.qualification} • {doctor.experienceYears}+ Years Clinical Experience
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Experience</span>
              <span className="font-bold text-slate-900 text-base">{doctor.experienceYears} Years</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Consultation Fee</span>
              <span className="font-bold text-teal-700 text-base">${doctor.consultationFee}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Languages</span>
              <span className="font-semibold text-slate-800 text-xs">{doctor.languages.join(', ')}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Modes</span>
              <span className="font-semibold text-slate-800 text-xs capitalize">
                {doctor.availableModes.join(' & ')}
              </span>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              About & Clinical Practice
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {doctor.about}
            </p>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Key Areas of Clinical Specialization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctor.specializations.map((spec, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 text-slate-800 text-xs font-medium">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Fellowships */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Education & Advanced Fellowships
            </h3>
            <ul className="space-y-2">
              {doctor.education.map((edu, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements if any */}
          {doctor.achievements && doctor.achievements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Honors & Key Accolades
              </h3>
              <ul className="space-y-2">
                {doctor.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Days Schedule */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              OPD Clinic Schedule & Available Days
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                const isAvail = doctor.availableDays.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      isAvail
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-200/60 text-slate-400 line-through decoration-slate-400/60'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Standard OPD Fee</span>
              <span className="text-xl font-extrabold text-slate-900">${doctor.consultationFee}</span>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Instant Confirmation</p>
              <p>Zero cancellation charges</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor.id, doctor.departmentId);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
