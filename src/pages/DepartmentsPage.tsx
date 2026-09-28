import React, { useState } from 'react';
import { 
  Search, 
  Activity, 
  ChevronRight, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Bed, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Star,
  Building2,
  Stethoscope
} from 'lucide-react';
import { DEPARTMENTS_DATA, DOCTORS_DATA } from '../data/hospitalData';
import { Department, Doctor } from '../types';

interface DepartmentsPageProps {
  initialDeptId?: string;
  onOpenBookingModal: (prefillDoctorId?: string, prefillDeptId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  initialDeptId,
  onOpenBookingModal,
  onSelectDoctor,
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    initialDeptId || DEPARTMENTS_DATA[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeDepartment =
    DEPARTMENTS_DATA.find((d) => d.id === selectedDeptId) || DEPARTMENTS_DATA[0];

  const doctorsInActiveDept = DOCTORS_DATA.filter(
    (doc) => doc.departmentId === activeDepartment.id
  );

  const filteredDepartments = DEPARTMENTS_DATA.filter((dept) => {
    return (
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.commonConditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto px-4 sm:px-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
            Specialized Medicine & Clinical Wings
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Clinical Departments
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            WeCare Hospitals features 10 world-class specialized clinical departments, each staffed by distinguished teams of senior consultants, surgeons, and sub-specialists.
          </p>
        </div>
      </section>

      {/* 2. Interactive Department Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Department List & Search */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search department or condition..."
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-teal-500 shadow-xs"
              />
            </div>

            <div className="space-y-2">
              {filteredDepartments.map((dept) => {
                const isSelected = dept.id === activeDepartment.id;
                const docCount = DOCTORS_DATA.filter((d) => d.departmentId === dept.id).length;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-600/20'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className={`font-bold text-sm leading-snug truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {dept.name}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {docCount} Specialist Doctors • {dept.bedCapacity} Beds
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Department Deep Dive & Associated Doctors */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Department Hero Box */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative h-64 sm:h-72">
                <img
                  src={activeDepartment.bannerImage}
                  alt={activeDepartment.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      Center of Excellence
                    </span>
                    {activeDepartment.emergencyAvailable && (
                      <span className="bg-rose-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        24/7 Emergency Available
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {activeDepartment.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                    Led by {activeDepartment.headDoctorName}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 text-slate-700">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Department Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeDepartment.fullDescription}
                  </p>
                </div>

                {/* Key Procedures & Services */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">
                    Key Procedures & Treatments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeDepartment.keyServices.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditions Treated & Technology */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Common Conditions Managed
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDepartment.commonConditions.map((cond, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-medium border border-teal-100"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Technology & Equipment
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {activeDepartment.technologies.map((tech, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0"></span>
                          <span>{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctors in this Department Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Doctors in {activeDepartment.name.split('&')[0]}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {doctorsInActiveDept.length} Board-Certified Specialists Available
                  </p>
                </div>

                <button
                  onClick={() => onOpenBookingModal(undefined, activeDepartment.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Department Appointment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctorsInActiveDept.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-3.5">
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
                              Dept Head
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-teal-700 font-medium truncate mt-0.5">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {doc.qualification}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {doc.rating}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-semibold">${doc.consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onSelectDoctor(doc)}
                        className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onOpenBookingModal(doc.id, doc.departmentId)}
                        className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
