import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Search, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Star, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Building2, 
  Stethoscope, 
  ChevronRight, 
  Sparkles,
  Zap,
  Bed,
  HeartHandshake
} from 'lucide-react';
import { 
  HOSPITAL_INFO, 
  DEPARTMENTS_DATA, 
  DOCTORS_DATA, 
  HOSPITAL_STATS, 
  REVIEWS_DATA, 
  HEALTH_PACKAGES_DATA, 
  HOSPITAL_FAQS 
} from '../data/hospitalData';
import { Doctor } from '../types';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenBookingModal: (prefillDoctorId?: string, prefillDeptId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBookingModal,
  onSelectDoctor,
}) => {
  const [selectedHeroDept, setSelectedHeroDept] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredDoctors = DOCTORS_DATA.filter(d => d.isHeadOfDept || d.rating >= 4.9).slice(0, 4);

  const handleHeroQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBookingModal(undefined, selectedHeroDept || undefined);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Subtle Background Glow Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>JCI & NABH Accredited Tertiary Care Hospital</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                World-Class Care, <br />
                <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Centered Around You
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                At WeCare Hospitals, world-renowned clinicians leverage state-of-the-art robotic surgery, dedicated 24/7 cardiac and stroke critical care, and empathetic nursing to restore your health with precision.
              </p>

              {/* Quick Callouts */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold px-7 py-3.5 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                >
                  <Calendar className="w-5 h-5 text-slate-950" />
                  <span>Book OPD Appointment</span>
                </button>

                <button
                  onClick={() => onNavigate('doctors')}
                  className="inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-full border border-slate-700 transition-all cursor-pointer text-sm sm:text-base"
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Find a Specialist</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white block">50+</span>
                  <span className="text-xs text-slate-400">Specialist Doctors</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white block">25+</span>
                  <span className="text-xs text-slate-400">Clinical Disciplines</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-teal-400 block">99.4%</span>
                  <span className="text-xs text-slate-400">Positive Outcomes</span>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Booking & Speciality Triage Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Fast Appointment Desk</h3>
                      <p className="text-xs text-slate-500">Instant confirmation • No upfront fees</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    OPD Open
                  </span>
                </div>

                <form onSubmit={handleHeroQuickBook} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Select Department
                    </label>
                    <select
                      value={selectedHeroDept}
                      onChange={(e) => setSelectedHeroDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                    >
                      <option value="">All Specialities (Choose in next step)</option>
                      {DEPARTMENTS_DATA.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Consultation Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl border border-teal-600 bg-teal-50/70 text-xs font-semibold text-teal-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-600" />
                        <span>Hospital OPD</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <span>Online Video</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      <span>Find Doctor & Book Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>⚡ Instant slot reservation</span>
                    <a
                      href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/[^0-9]/g, '')}`}
                      className="text-rose-600 font-semibold hover:underline"
                    >
                      Emergency: 1800-932-273
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOSPITAL_STATS.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{stat.label}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLINICAL DEPARTMENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
              Centers of Clinical Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized Healthcare Departments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group"
          >
            <span>Explore All 10 Departments</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS_DATA.slice(0, 6).map((dept) => {
            const doctorsCount = DOCTORS_DATA.filter(d => d.departmentId === dept.id).length;
            return (
              <div
                key={dept.id}
                className="group rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dept.bannerImage}
                    alt={dept.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-teal-600/90 text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {doctorsCount} Specialist Doctors
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {dept.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('departments', { selectedDeptId: dept.id })}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Specialists & Procedures</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenBookingModal(undefined, dept.id)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Book OPD
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED TOP SPECIALISTS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
                Distinguished Medical Faculty
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Consult With Our Renowned Doctors
              </h2>
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group"
            >
              <span>View Full Directory of {DOCTORS_DATA.length} Doctors</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative p-5 pb-0">
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-100">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {doc.isHeadOfDept && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shadow">
                        Dept Head
                      </span>
                    )}
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                      {doc.departmentName.split('&')[0]}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5 line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {doc.qualification}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {doc.experienceYears}+ years exp • ${doc.consultationFee} fee
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Profile & Schedule
                    </button>
                    <button
                      onClick={() => onOpenBookingModal(doc.id, doc.departmentId)}
                      className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY WECARE HOSPITALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Clinical Rigor & Patient First
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Patients Choose WeCare Hospitals
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Combining modern surgical robotics, dedicated subspecialties, and transparent ethical care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Robotic & Minimally Invasive</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with MAKO robotic joint arthroplasty, Da Vinci Xi surgical platforms, and 4K ultra-HD laparoscopy for minimal blood loss and faster recovery.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Next-day discharge for robotic joints</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Sub-millimeter surgical accuracy</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">24/7 Stroke & Cardiac ICU</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hyperacute stroke team and door-to-balloon primary angioplasty protocols consistently below 45 minutes, with round-the-clock intensivist coverage.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Level-1 Trauma & Emergency Care</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Zero-delay Cath Lab activation</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cashless & Transparent Billing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empaneled with all major insurance TPAs with 24/7 on-site desk support for seamless pre-authorizations and upfront transparent packages.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Cashless claims assistance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>No hidden ICU or consumable surcharges</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. PREVENTIVE HEALTH CHECKUP PACKAGES */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-8 border border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
            Preventive Healthcare
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Health Screening Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Early diagnosis saves lives. Book a comprehensive screening with NABL-accredited diagnostic precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HEALTH_PACKAGES_DATA.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-gradient-to-b from-teal-900/80 to-slate-900 border-2 border-teal-400 shadow-xl relative'
                  : 'bg-slate-800/80 border border-slate-700'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                  Most Recommended
                </span>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                  <p className="text-xs text-teal-200 mt-0.5">{pkg.targetAudience}</p>
                </div>

                <div className="flex items-baseline gap-2 py-2 border-y border-slate-700/60">
                  <span className="text-3xl font-extrabold text-white">${pkg.price}</span>
                  <span className="text-sm text-slate-400 line-through">${pkg.originalPrice}</span>
                  <span className="text-[11px] text-teal-400 font-bold ml-auto">
                    {pkg.testsIncludedCount} Parameters
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 py-2">
                  {pkg.features.slice(0, 5).map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700/60">
                <button
                  onClick={() => onOpenBookingModal()}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    pkg.popular
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-md'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Book This Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Real Stories, Real Recovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Patients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{rev.patientName}</h4>
                  <p className="text-teal-700 text-[11px]">{rev.departmentName}</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified Patient
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {HOSPITAL_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className={`text-teal-600 text-lg transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
