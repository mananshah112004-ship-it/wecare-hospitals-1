# WeCare Hospitals 🏥

A modern, responsive healthcare and specialist appointment booking portal built with React 19, TypeScript, Tailwind CSS, Vite, and Firebase.

Live Website: **[https://mananshah112004-ship-it.github.io/wecare-hospitals-1/](https://mananshah112004-ship-it.github.io/wecare-hospitals-1/)**

---

## 🌟 Key Features

- **Home Page**: Hero section, quick booking wizard, emergency hotline, key medical specialties, patient testimonials, and hospital accreditation badges.
- **About Us**: Hospital mission, 25+ years legacy, modern infrastructure (500+ beds, 45+ ICUs, robotic surgical suites), and leadership board.
- **Departments**: 8 comprehensive medical departments (Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, Ophthalmology, Dental Care, General Medicine) with detailed services, equipment, and dedicated specialist rosters.
- **Doctors Directory**: Multi-specialty doctor profiles with qualifications, years of experience, patient ratings, consultation fees, bios, and direct booking actions.
- **Instant Appointment Booking**: 4-step wizard with department selection, specialist doctor picking, interactive date/slot selection, symptom description, and digital pass generation with `.ics` calendar sync.
- **Firebase Authentication & Cloud Firestore**:
  - Secure patient sign in and sign up (email/password).
  - Cloud synchronization for patient profile and booked appointments.
  - Appointment management: filter by status, search, view digital passes, and cancel appointments.

---

## 🚀 GitHub Pages Automated Deployment

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the application to GitHub Pages whenever changes are pushed to `main` or `master`.

### One-Time Setup in GitHub Repository:
1. Go to your GitHub repository: `https://github.com/mananshah112004-ship-it/wecare-hospitals-1-` (or `wecare-hospitals-1`)
2. Click **Settings** ⚙️
3. In the left sidebar, click **Pages**
4. Under **Build and deployment** > **Source**, select **GitHub Actions**
5. Once selected, pushing any commit to `main` will automatically trigger the workflow and deploy the site!

---

## 🛠️ Local Development & Build

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📦 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations & Effects**: Motion & Canvas Confetti
- **Backend / DB**: Firebase Auth & Cloud Firestore
