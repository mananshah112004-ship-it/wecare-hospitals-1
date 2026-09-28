import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Phone, 
  Clock, 
  Calendar, 
  UserCheck, 
  Menu, 
  X, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Sparkles,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';
import { getSavedAppointments } from '../utils/appointmentStorage';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenBookingModal: (prefillDoctorId?: string, prefillDeptId?: string) => void;
  onOpenMyAppointments: () => void;
  onOpenUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenBookingModal,
  onOpenMyAppointments,
  onOpenUserProfile,
}) => {
  const { currentUser, userProfile, openAuthModal, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const apts = getSavedAppointments();
      const active = apts.filter(a => a.status === 'confirmed');
      setAppointmentCount(active.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'book', label: 'Book Appointment' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-slate-100 transition-all">
      {/* Top Emergency & Info Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-4 sm:gap-6">
            <a 
              href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 text-rose-400 font-semibold hover:text-rose-300 transition-colors group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>24/7 Emergency: <strong className="text-white tracking-wide">{HOSPITAL_INFO.emergencyPhone}</strong></span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>OPD: Mon-Sat 8:00 AM - 8:00 PM</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>JCI & NABH Accredited Multi-Speciality</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onOpenMyAppointments}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
              title="View and manage booked appointments"
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>My Bookings</span>
              {appointmentCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-500 text-slate-950 font-bold rounded-full text-[10px]">
                  {appointmentCount}
                </span>
              )}
            </button>

            {/* Auth Top Button */}
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('signin', 'Sign in to access your WeCare patient portal')}
                className="flex items-center gap-1.5 text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900/80 px-2.5 py-1 rounded border border-teal-800/60 transition-colors cursor-pointer text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Patient Login</span>
              </button>
            ) : (
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-1.5 text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900/80 px-2.5 py-1 rounded border border-teal-800/60 transition-colors cursor-pointer text-xs font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{userProfile?.displayName || currentUser.displayName || 'Patient'}</span>
              </button>
            )}

            <a 
              href={`tel:${HOSPITAL_INFO.ambulancePhone.split('/')[0].trim()}`}
              className="hidden sm:inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Ambulance: <strong>108</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  WeCare
                </span>
                <span className="font-bold text-xl sm:text-2xl text-teal-600">
                  Hospitals
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                Healing with Compassion
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/80">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-sm border border-slate-200/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {!currentUser ? (
              <button
                onClick={() => openAuthModal('signin', 'Sign in to access your appointments & medical records')}
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-teal-700 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-full hover:bg-teal-50/80 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-teal-600" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                    {(userProfile?.displayName || currentUser.displayName || 'P').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">
                    {userProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {userProfile?.displayName || currentUser.displayName || 'Patient'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={onOpenUserProfile}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>Patient Profile & History</span>
                    </button>
                    <button
                      onClick={onOpenMyAppointments}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>My Bookings ({appointmentCount})</span>
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => logOut()}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-sm shadow-teal-600/25 hover:shadow-md hover:shadow-teal-600/35 transition-all transform active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenBookingModal()}
              className="sm:hidden inline-flex items-center gap-1 bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          {/* User Status banner in mobile */}
          {currentUser ? (
            <div className="mb-3 p-3 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {(userProfile?.displayName || currentUser.displayName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {userProfile?.displayName || currentUser.displayName || 'Patient'}
                  </p>
                  <p className="text-[10px] text-teal-800 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenUserProfile();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                Profile
              </button>
            </div>
          ) : (
            <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Patient Portal</p>
                <p className="text-[11px] text-slate-500">Access synced appointments</p>
              </div>
              <button
                onClick={() => {
                  openAuthModal('signin', 'Sign in to access your appointments & medical records');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}

            <button
              onClick={() => {
                onOpenMyAppointments();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium text-slate-700 hover:bg-slate-50 border-t border-slate-100 mt-1"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                My Bookings & Pass
              </span>
              {appointmentCount > 0 && (
                <span className="px-2 py-0.5 bg-teal-600 text-white rounded-full text-xs font-bold">
                  {appointmentCount} Active
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBookingModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor Appointment</span>
            </button>

            <a
              href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/[^0-9]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 font-semibold py-2.5 rounded-xl text-sm"
            >
              <Phone className="w-4 h-4 text-rose-600" />
              <span>24/7 Emergency: {HOSPITAL_INFO.emergencyPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
