import { Appointment } from '../types';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const STORAGE_KEY = 'wecare_hospitals_appointments';

export function getSavedAppointments(): Appointment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const sampleAppointments: Appointment[] = [
        {
          id: 'apt-demo-1',
          referenceNumber: 'WCH-882941',
          doctorId: 'doc-cardio-1',
          doctorName: 'Dr. Arthur Vance',
          doctorSpecialty: 'Chief of Cardiac Sciences',
          departmentId: 'cardiology',
          departmentName: 'Cardiology & Cardiac Surgery',
          doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
          patientName: 'Alex Morgan',
          patientEmail: 'alex.morgan@example.com',
          patientPhone: '+1 (555) 234-5678',
          patientAge: 42,
          patientGender: 'male',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          timeSlot: '10:00 AM',
          mode: 'in-person',
          reasonForVisit: 'Annual cardiovascular risk screening and blood pressure consultation',
          hasPreviousVisit: false,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          fee: 120,
          roomNumber: 'OPD Suite 204, Block B',
        },
        {
          id: 'apt-demo-2',
          referenceNumber: 'WCH-710432',
          doctorId: 'doc-pedia-1',
          doctorName: 'Dr. Maya Patel',
          doctorSpecialty: 'Head of Pediatrics & Neonatology',
          departmentId: 'pediatrics',
          departmentName: 'Pediatrics & Neonatology',
          doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
          patientName: 'Emily & Baby Lucas',
          patientEmail: 'emily.lucas@example.com',
          patientPhone: '+1 (555) 987-6543',
          patientAge: 2,
          patientGender: 'male',
          date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          timeSlot: '11:30 AM',
          mode: 'in-person',
          reasonForVisit: '18-month developmental milestones and vaccination checkup',
          hasPreviousVisit: true,
          status: 'confirmed',
          fee: 95,
          createdAt: new Date().toISOString(),
          roomNumber: 'Children Clinic 102, Wing A',
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleAppointments));
      return sampleAppointments;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading appointments from localStorage', e);
    return [];
  }
}

export async function saveAppointmentToDb(appointment: Appointment): Promise<Appointment> {
  // 1. Always save to localStorage for instant UI response and offline fallback
  saveAppointment(appointment);

  // 2. Persist in Firestore
  try {
    const aptRef = doc(db, 'appointments', appointment.id);
    await setDoc(aptRef, {
      ...appointment,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Could not save appointment to Firestore, kept in local state:', err);
  }

  return appointment;
}

export function saveAppointment(appointment: Appointment): Appointment {
  try {
    const existing = getSavedAppointments();
    const filtered = existing.filter(a => a.id !== appointment.id);
    const updated = [appointment, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return appointment;
  } catch (e) {
    console.error('Error saving appointment', e);
    return appointment;
  }
}

export async function updateAppointmentStatusInDb(id: string, status: Appointment['status']): Promise<boolean> {
  updateAppointmentStatus(id, status);
  try {
    const aptRef = doc(db, 'appointments', id);
    await updateDoc(aptRef, { status, updatedAt: new Date().toISOString() });
    return true;
  } catch (err) {
    console.warn('Error updating appointment in Firestore:', err);
    return true;
  }
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): boolean {
  try {
    const existing = getSavedAppointments();
    const updated = existing.map(apt => apt.id === id ? { ...apt, status } : apt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (e) {
    console.error('Error updating appointment status', e);
    return false;
  }
}

export async function fetchUserAppointmentsFromDb(userId?: string, userEmail?: string): Promise<Appointment[]> {
  const localApts = getSavedAppointments();
  
  if (!userId && !userEmail) {
    return localApts;
  }

  try {
    const aptsRef = collection(db, 'appointments');
    let q;
    if (userId) {
      q = query(aptsRef, where('userId', '==', userId));
    } else if (userEmail) {
      q = query(aptsRef, where('patientEmail', '==', userEmail));
    }

    if (q) {
      const snap = await getDocs(q);
      const dbApts: Appointment[] = [];
      snap.forEach(d => {
        dbApts.push(d.data() as Appointment);
      });

      if (dbApts.length > 0) {
        // Merge with local items avoiding duplicates
        const map = new Map<string, Appointment>();
        dbApts.forEach(a => map.set(a.id, a));
        localApts.forEach(a => {
          if (!map.has(a.id)) {
            if ((userId && a.userId === userId) || (userEmail && a.patientEmail === userEmail)) {
              map.set(a.id, a);
            }
          }
        });
        const combined = Array.from(map.values()).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        return combined;
      }
    }
  } catch (e) {
    console.warn('Firestore fetch failed, using local cache:', e);
  }

  return localApts.filter(a => (userId && a.userId === userId) || (userEmail && a.patientEmail === userEmail) || !a.userId);
}

export function generateReferenceNumber(): string {
  const prefix = 'WCH';
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

export function generateICSFile(apt: Appointment): void {
  const dateParts = apt.date.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  
  const startTimeClean = apt.timeSlot.replace(/[^0-9APMapm:]/g, '');
  const isPM = startTimeClean.includes('PM');
  const [hourStr, minStr] = startTimeClean.replace(/[APMapm]/g, '').split(':');
  let hour = parseInt(hourStr, 10);
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const startISO = `${year}${month}${day}T${pad(hour)}${minStr || '00'}00`;
  const endHour = hour + 1 > 23 ? 23 : hour + 1;
  const endISO = `${year}${month}${day}T${pad(endHour)}${minStr || '00'}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WeCare Hospitals//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${apt.referenceNumber}@wecarehospitals.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startISO}`,
    `DTEND:${endISO}`,
    `SUMMARY:Medical Appointment with ${apt.doctorName} (${apt.departmentName})`,
    `DESCRIPTION:Appointment Reference: ${apt.referenceNumber}\\nDoctor: ${apt.doctorName}\\nDepartment: ${apt.departmentName}\\nMode: ${apt.mode.toUpperCase()}\\nPatient: ${apt.patientName}\\nLocation: WeCare Hospitals, 742 Healthcare Blvd`,
    'LOCATION:WeCare Hospitals - 742 Healthcare Blvd, Medical District',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `WeCare_Appointment_${apt.referenceNumber}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
