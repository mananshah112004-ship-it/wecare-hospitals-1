import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { AppointmentModal } from './components/AppointmentModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthProvider } from './context/AuthContext';
import { Doctor } from './types';
import { Phone, Calendar, ArrowUp } from 'lucide-react';
import { HOSPITAL_INFO } from './data/hospitalData';

function MainAppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedDeptId, setSelectedDeptId] = useState<string | undefined>(undefined);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPrefillDoctorId, setBookingPrefillDoctorId] = useState<string | undefined>(undefined);
  const [bookingPrefillDeptId, setBookingPrefillDeptId] = useState<string | undefined>(undefined);

  const [isMyAppointmentsOpen, setIsMyAppointmentsOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [selectedDoctorForDetail, setSelectedDoctorForDetail] = useState<Doctor | null>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: string, params?: Record<string, any>) => {
    if (params?.selectedDeptId) {
      setSelectedDeptId(params.selectedDeptId);
    }
    setCurrentPage(page);
  };

  const handleOpenBookingModal = (prefillDoctorId?: string, prefillDeptId?: string) => {
    setBookingPrefillDoctorId(prefillDoctorId);
    setBookingPrefillDeptId(prefillDeptId);
    setIsBookingModalOpen(true);
  };

  const handleSelectDoctorForDetail = (doctor: Doctor) => {
    setSelectedDoctorForDetail(doctor);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Header Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
        onOpenMyAppointments={() => setIsMyAppointmentsOpen(true)}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
      />

      {/* Main Page Render */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenBookingModal={handleOpenBookingModal}
            onSelectDoctor={handleSelectDoctorForDetail}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenBookingModal={() => handleOpenBookingModal()}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            initialDeptId={selectedDeptId}
            onOpenBookingModal={handleOpenBookingModal}
            onSelectDoctor={handleSelectDoctorForDetail}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onOpenBookingModal={handleOpenBookingModal}
            onSelectDoctor={handleSelectDoctorForDetail}
          />
        )}

        {currentPage === 'book' && (
          <BookAppointmentPage
            onViewMyAppointments={() => setIsMyAppointmentsOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenBookingModal={handleOpenBookingModal}
      />

      {/* Floating Emergency & Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5 items-end">
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-white text-slate-700 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all transform hover:scale-105 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <a
            href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/[^0-9]/g, '')}`}
            className="hidden sm:inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-3 rounded-full shadow-lg shadow-rose-900/30 transition-all text-xs transform hover:scale-105"
            title="24/7 Emergency Line"
          >
            <Phone className="w-4 h-4 animate-pulse" />
            <span>Emergency 1800-932-273</span>
          </a>

          <button
            onClick={() => handleOpenBookingModal()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold px-5 py-3.5 rounded-full shadow-xl shadow-teal-900/30 transition-all text-xs sm:text-sm transform hover:scale-105 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointment Booking Wizard Modal */}
      <AppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        prefillDoctorId={bookingPrefillDoctorId}
        prefillDeptId={bookingPrefillDeptId}
        onViewMyAppointments={() => {
          setIsBookingModalOpen(false);
          setIsMyAppointmentsOpen(true);
        }}
      />

      {/* My Appointments Modal */}
      <MyAppointmentsModal
        isOpen={isMyAppointmentsOpen}
        onClose={() => setIsMyAppointmentsOpen(false)}
        onBookNew={() => {
          setIsMyAppointmentsOpen(false);
          handleOpenBookingModal();
        }}
      />

      {/* Doctor Bio & Schedule Modal */}
      <DoctorDetailModal
        doctor={selectedDoctorForDetail}
        onClose={() => setSelectedDoctorForDetail(null)}
        onBookAppointment={(docId, deptId) => {
          setSelectedDoctorForDetail(null);
          handleOpenBookingModal(docId, deptId);
        }}
      />

      {/* Patient Profile & History Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onViewAppointments={() => {
          setIsUserProfileOpen(false);
          setIsMyAppointmentsOpen(true);
        }}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
