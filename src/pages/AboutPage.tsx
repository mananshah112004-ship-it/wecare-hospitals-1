import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Award, 
  Building2, 
  Users, 
  Activity, 
  CheckCircle2, 
  Stethoscope, 
  Calendar, 
  Phone, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

interface AboutPageProps {
  onNavigate: (page: string) => void;
  onOpenBookingModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBookingModal }) => {
  const leadership = [
    {
      name: 'Dr. Arthur Vance, MD, DM, FACC',
      role: 'Chief Executive Officer & Director of Cardiac Sciences',
      qualification: 'Johns Hopkins & Columbia Alumnus',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      bio: 'Over 24 years leading multi-speciality tertiary care hospitals, spearheading clinical governance and healthcare innovations.',
    },
    {
      name: 'Dr. Elena Rostova, MD, MCh, FAANS',
      role: 'Chief Medical Officer & Director of Neurosciences',
      qualification: 'Charité Berlin & UCSF Fellow',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      bio: 'Renowned neurosurgeon guiding hospital-wide patient safety protocols, surgical quality metrics, and academic research.',
    },
    {
      name: 'Dr. Marcus Sterling, MS, FRCS',
      role: 'Head of Surgical Quality & Robotic Sciences',
      qualification: 'Oxford & Hospital for Special Surgery NY',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      bio: 'Leader in robotic surgery adoption, minimally invasive orthopedic protocols, and infection-free OT environments.',
    },
    {
      name: 'Dr. Samantha Chen, MD, DM, FACP',
      role: 'Chair of Multidisciplinary Tumor Board',
      qualification: 'MD Anderson Cancer Center Alumna',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80',
      bio: 'Pioneer in precision oncology, genomic tumor matching, and holistic palliative care.',
    }
  ];

  const milestones = [
    { year: '1998', title: 'Foundation of WeCare', desc: 'Inaugurated as a 100-bed specialty care hospital with dedicated cardiology and trauma bays.' },
    { year: '2006', title: 'JCI Gold Seal Accreditation', desc: 'Achieved Joint Commission International accreditation, setting benchmarks for clinical outcomes.' },
    { year: '2014', title: 'Robotic Surgery Institute', desc: 'Installed the first Da Vinci and MAKO robotic systems, completing over 5,000 robotic procedures since.' },
    { year: '2021', title: 'Comprehensive Cancer & Bone Marrow Wing', desc: 'Expanded with TrueBeam radiotherapy and state-of-the-art organ transplant suites.' },
    { year: '2025', title: 'Smart Digital Hospital Era', desc: 'Integrated teleconsultation, AI imaging analytics, and zero-wait OPD scheduling systems.' },
  ];

  const infrastructureItems = [
    {
      title: '3T Intraoperative MRI & 128-Slice CT',
      desc: 'Real-time high-resolution neuro and cardiac imaging during surgery for optimal surgical resection margins.',
      icon: 'Brain',
    },
    {
      title: 'MAKO & Da Vinci Robotic Platforms',
      desc: 'Sub-millimeter precision for joint replacements and oncologic surgeries, reducing recovery times.',
      icon: 'Zap',
    },
    {
      title: 'Bi-plane Hybrid Cath Labs',
      desc: 'Simultaneous 3D angiographic roadmapping for complex structural heart and stroke thrombectomy.',
      icon: 'Activity',
    },
    {
      title: 'Level-III Advanced NICU & PICU',
      desc: 'Equipped with nitric oxide therapy and high-frequency ventilators for premature infants.',
      icon: 'Heart',
    },
    {
      title: 'Class 100 Laminar Flow OTs',
      desc: 'Ultra-clean positive-pressure operating rooms eliminating surgical site infections.',
      icon: 'ShieldCheck',
    },
    {
      title: '24/7 Automated Pathology & NABL Labs',
      desc: 'Molecular diagnostics, next-gen genetic sequencing, and rapid STAT blood reporting.',
      icon: 'Award',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 max-w-7xl mx-auto px-4 sm:px-8 border border-teal-900/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>26+ Years of Clinical Excellence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            About WeCare Hospitals
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Founded in 1998, WeCare Hospitals has grown into one of the country's most trusted healthcare destinations, serving over 180,000 patients annually with clinical distinction and human warmth.
          </p>
        </div>
      </section>

      {/* 2. Mission, Vision, Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To deliver compassionate, state-of-the-art medical care accessible to all patients, upholding the highest standards of safety, ethics, and clinical precision.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be the globally preferred destination for clinical excellence, pioneering robotic therapies, and empowering medical breakthroughs for human longevity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Core Values</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>Compassion:</strong> Empathy in every interaction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>Excellence:</strong> Zero compromise on quality</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span><strong>Integrity:</strong> Honest and transparent care</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Advanced Technology & Infrastructure */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
              Next-Gen Medical Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hospital Infrastructure & Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Our campus integrates modern surgical suites, sterile environments, and diagnostic labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infrastructureItems.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Clinical Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospital Leadership & Advisory Board
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((leader, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <img
                src={leader.image}
                alt={leader.name}
                referrerPolicy="no-referrer"
                className="w-full h-52 object-cover"
              />
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{leader.name}</h3>
                  <p className="text-xs text-teal-700 font-semibold">{leader.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{leader.qualification}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Journey Milestones */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block mb-1">
            Legacy of Care
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Milestones in Our Journey
          </h2>
        </div>

        <div className="relative border-l-2 border-teal-200 ml-4 sm:ml-32 space-y-8 pl-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-teal-600 border-4 border-white shadow-xs"></div>
              <div className="sm:absolute sm:-left-32 sm:top-1 sm:text-right sm:w-24">
                <span className="text-base font-extrabold text-teal-700">{m.year}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="font-bold text-base text-slate-900">{m.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Accreditations Banner & CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Experience the WeCare Standard of Healthcare
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Schedule an in-person OPD consultation or video appointment with our specialists today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              Book Appointment
            </button>
            <button
              onClick={() => onNavigate('departments')}
              className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              View Departments
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
