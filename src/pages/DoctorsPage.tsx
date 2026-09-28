import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Video, 
  Building2, 
  Award, 
  Languages, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  SlidersHorizontal,
  Stethoscope
} from 'lucide-react';
import { DOCTORS_DATA, DEPARTMENTS_DATA } from '../data/hospitalData';
import { Doctor } from '../types';

interface DoctorsPageProps {
  onOpenBookingModal: (prefillDoctorId?: string, prefillDeptId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onOpenBookingModal,
  onSelectDoctor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedExp, setSelectedExp] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'feeAsc' | 'feeDesc'>('rating');

  const filteredDoctors = DOCTORS_DATA.filter((doc) => {
    // Search query match (name, specialty, title, qualifications, specializations)
    const q = searchQuery.toLowerCase();
    const matchSearch =
      doc.name.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.departmentName.toLowerCase().includes(q) ||
      doc.qualification.toLowerCase().includes(q) ||
      doc.specializations.some((s) => s.toLowerCase().includes(q));

    const matchDept = selectedDepartment === 'all' || doc.departmentId === selectedDepartment;
    const matchGender = selectedGender === 'all' || doc.gender === selectedGender;
    const matchMode = selectedMode === 'all' || doc.availableModes.includes(selectedMode as any);

    let matchExp = true;
    if (selectedExp === '15+') matchExp = doc.experienceYears >= 15;
    if (selectedExp === '20+') matchExp = doc.experienceYears >= 20;
    if (selectedExp === '10+') matchExp = doc.experienceYears >= 10;

    return matchSearch && matchDept && matchGender && matchMode && matchExp;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    if (sortBy === 'feeAsc') return a.consultationFee - b.consultationFee;
    if (sortBy === 'feeDesc') return b.consultationFee - a.consultationFee;
    return 0;
  });

  return (
    <div className="space-y-10 py-8">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto px-4 sm:px-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
            Medical Faculty & Consultants
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Find a Specialist Doctor
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our distinguished directory of {DOCTORS_DATA.length} board-certified consultants across all clinical disciplines. Book an in-person or video consultation in minutes.
          </p>
        </div>
      </section>

      {/* 2. Filters & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, symptom, disease (e.g. Heart, Knee, Migraine, Baby)..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Department Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500"
              >
                <option value="all">All Departments ({DEPARTMENTS_DATA.length})</option>
                {DEPARTMENTS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="experience">Sort: Most Experienced</option>
                <option value="feeAsc">Sort: Fee (Lowest First)</option>
                <option value="feeDesc">Sort: Fee (Highest First)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills (Experience, Gender, Mode) */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Experience:</span>
              {['all', '10+', '15+', '20+'].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExp(exp)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedExp === exp
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {exp === 'all' ? 'All' : `${exp} Years`}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Mode:</span>
              {[
                { id: 'all', label: 'All Modes' },
                { id: 'in-person', label: 'OPD Visit' },
                { id: 'video', label: 'Video Call' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedMode === m.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> specialist doctors
            </div>
          </div>
        </div>
      </section>

      {/* 3. Doctor Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No doctors match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try resetting your search query or choosing "All Departments".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('all');
                setSelectedGender('all');
                setSelectedExp('all');
                setSelectedMode('all');
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 space-y-4 flex-1">
                  {/* Doctor Avatar & Department Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                      {doc.isHeadOfDept && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                          Dept Head
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block truncate">
                        {doc.departmentName.split('&')[0]}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug truncate mt-0.5">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-slate-400">({doc.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications & Experience */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <p className="text-slate-700 font-medium line-clamp-1">
                      🎓 {doc.qualification}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{doc.experienceYears}+ Yrs Clinical Exp</span>
                      <span>Languages: {doc.languages.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  {/* Specializations Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Key Clinical Focus:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {doc.specializations.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[11px] font-medium rounded-md border border-teal-100/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schedule & Consultation Fee */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">OPD Fee</span>
                      <span className="font-extrabold text-base text-slate-900">${doc.consultationFee}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Available</span>
                      <span className="font-semibold text-slate-700">{doc.availableDays.length} Days / Week</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectDoctor(doc)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View Bio & Schedule
                  </button>
                  <button
                    onClick={() => onOpenBookingModal(doc.id, doc.departmentId)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-teal-600/20"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
