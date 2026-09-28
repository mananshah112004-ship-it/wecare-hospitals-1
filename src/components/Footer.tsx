import React, { useState } from 'react';
import { 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Send,
  ExternalLink,
  Award
} from 'lucide-react';
import { HOSPITAL_INFO, DEPARTMENTS_DATA } from '../data/hospitalData';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenBookingModal: (prefillDoctorId?: string, prefillDeptId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Top Banner with Emergency Assistance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-teal-900/60 via-slate-800 to-slate-800 p-6 sm:p-8 rounded-2xl border border-teal-800/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Activity className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Need Immediate Medical Consultation or Ambulance?
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Our 24/7 emergency response team, trauma surgeons, and cath lab units are always active.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/[^0-9]/g, '')}`}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-900/40"
            >
              <Phone className="w-4 h-4" />
              <span>Call 1800-932-273</span>
            </a>
            <button
              onClick={() => onOpenBookingModal()}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-900/30 cursor-pointer"
            >
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                WeCare <span className="text-teal-400">Hospitals</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              WeCare Hospitals is a premier tertiary healthcare institution providing state-of-the-art medical treatments, compassionate patient care, and cutting-edge surgical robotics since {HOSPITAL_INFO.foundedYear}.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{HOSPITAL_INFO.mainAddress}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${HOSPITAL_INFO.email}`} className="hover:text-teal-300 underline underline-offset-2">
                  {HOSPITAL_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>General Enquiry: {HOSPITAL_INFO.generalPhone}</span>
              </div>
            </div>

            {/* Accreditations badges */}
            <div className="pt-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Certified & Accredited by
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  JCI Gold Seal
                </span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  NABH Certified
                </span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  NABL Labs
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About WeCare
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('departments')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Speciality Departments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('doctors')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('book')} 
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors cursor-pointer"
                >
                  Book OPD Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical Departments */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-teal-500 pl-2.5">
              Clinical Specialities
            </h4>
            <ul className="space-y-2.5 text-sm">
              {DEPARTMENTS_DATA.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => onNavigate('departments', { selectedDeptId: dept.id })}
                    className="text-slate-400 hover:text-white transition-colors text-left truncate max-w-full cursor-pointer"
                  >
                    {dept.name.split('&')[0].trim()}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="text-teal-400 text-xs hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <span>View All 10 Departments</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Hospital Branches & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider border-l-2 border-teal-500 pl-2.5">
              Hospital Campuses
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {HOSPITAL_INFO.branches.map((b, idx) => (
                <div key={idx} className="pb-1">
                  <p className="font-semibold text-slate-200">{b.city}</p>
                  <p className="text-slate-400 text-[11px]">{b.address}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h5 className="text-xs font-semibold text-white mb-1.5">Health Tips Newsletter</h5>
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs cursor-pointer transition-colors"
                  title="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Subscribed successfully!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} WeCare Hospitals Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-300">Terms of Care</span>
            <span className="hover:text-slate-300">Patient Charter</span>
            <span className="hover:text-slate-300">Clinical Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
