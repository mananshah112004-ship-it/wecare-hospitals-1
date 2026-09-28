import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Download, 
  Printer, 
  Building2, 
  Phone, 
  Plus,
  LogIn,
  RefreshCw
} from 'lucide-react';
import { Appointment } from '../types';
import { 
  fetchUserAppointmentsFromDb, 
  updateAppointmentStatusInDb, 
  generateICSFile 
} from '../utils/appointmentStorage';
import { useAuth } from '../context/AuthContext';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNew: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  onBookNew,
}) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen, currentUser]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchUserAppointmentsFromDb(currentUser?.uid, currentUser?.email || undefined);
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCancelAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment? There are no cancellation fees.')) {
      await updateAppointmentStatusInDb(id, 'cancelled');
      await loadAppointments();
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status: 'cancelled' });
      }
    }
  };

  const filtered = appointments.filter((apt) => {
    const matchSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'all' || apt.status === filterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                My Appointments & Digital Passes
              </h2>
              <p className="text-xs text-slate-400">
                Track, print, or manage your scheduled doctor consultations at WeCare Hospitals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBookNew();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book New</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Account Status Bar */}
        {!currentUser ? (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
            <span>Viewing local appointments on this device. Sign in to access your complete cloud medical history.</span>
            <button
              onClick={() => openAuthModal('signin', 'Sign in to access your cloud-synced bookings')}
              className="inline-flex items-center gap-1 text-amber-800 font-bold hover:underline cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Signed in as <strong>{userProfile?.displayName || currentUser.displayName || currentUser.email}</strong> (Cloud Synced)</span>
            </div>
            <button
              onClick={loadAppointments}
              className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline cursor-pointer"
              title="Refresh from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference #, doctor, or patient..."
              className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: List of Appointments */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                {searchQuery
                  ? 'No scheduled consultations matching your search filter.'
                  : 'You have not booked any appointments yet.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNew();
                }}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book Your First Appointment</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((apt) => {
                const isConfirmed = apt.status === 'confirmed';
                const isCancelled = apt.status === 'cancelled';
                return (
                  <div
                    key={apt.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCancelled
                        ? 'bg-slate-50/60 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-sm tracking-wider text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                          {apt.referenceNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                        <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                          {apt.mode}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 font-medium">
                        Booked for: <strong className="text-slate-900">{apt.patientName}</strong> ({apt.patientAge} yrs)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs text-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={apt.doctorAvatar}
                          alt={apt.doctorName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{apt.doctorName}</p>
                          <p className="text-teal-700 text-[11px]">{apt.departmentName}</p>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] text-slate-400 block font-medium">Schedule</span>
                        <p className="font-semibold text-slate-800">
                          📅 {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-teal-700 font-bold">⏰ {apt.timeSlot}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[11px] text-slate-400 block font-medium">Location & Fee</span>
                        <p className="font-semibold text-slate-800">{apt.roomNumber || 'OPD Desk'}</p>
                        <p className="text-slate-600 font-medium">Fee: ${apt.fee} (Pay at desk)</p>
                      </div>
                    </div>

                    {apt.reasonForVisit && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100">
                        <strong className="text-slate-700">Reason:</strong> {apt.reasonForVisit}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => generateICSFile(apt)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-teal-600" />
                              <span>Calendar (.ics)</span>
                            </button>
                            <button
                              onClick={() => window.print()}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print Pass</span>
                            </button>
                          </>
                        )}
                      </div>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Appointment</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Need to reschedule? Call WeCare Central Desk: 1800-932-273</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
