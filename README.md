# 🧠 MEMORY BRIDGE
> **“Bridging memories, people and care.”**

Memory Bridge is an intelligent full-stack assistance platform designed for elderly people with dementia and their caregivers. It bridges personal memories, daily routine guidance, familiar face recognition, voice interaction, adaptive cognitive stimulation, and real-time caregiver monitoring.

---

## 📌 Problem Statement & Solution

### The Challenge
Dementia affects millions of elderly individuals worldwide, causing memory loss, confusion, difficulty recognizing loved ones, anxiety about daily schedules, and risk of wandering. Caregivers face continuous strain keeping track of medication adherence, safety boundaries, and visitor history.

### The Solution
Memory Bridge offers:
1. **Ultra-Simple Patient UX**: High contrast, calm typography, large action buttons, and live voice & speech synthesis.
2. **Voice Assistant**: Ask natural questions like *"Who is Ananya?"*, *"When is my medicine?"*, or *"What do I have today?"*.
3. **Facial Recognition**: Live camera detection matching familiar family members and logging *"People Met Today"*.
4. **Adaptive Mind & Memory Games**: 4 cognitive games whose difficulty automatically adapts to user engagement and accuracy.
5. **Caregiver Monitoring**: Real-time status, simulated GPS location, medication compliance, safety alert simulation, and messaging.

---

## 🚀 Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, CORS, dotenv.
- **Database**: MongoDB with Mongoose (includes in-memory fallback store for offline testing).
- **Vision & Speech**: Web Speech API (STT & TTS), HTML5 Canvas Face Detector & embedding matcher.

---

## 📁 Folder Structure

```
memory-bridge/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # AccessibilityBar, Navbar, VoiceAssistantModal, FaceDetectorModal, EmergencyModal
│   │   ├── context/          # AuthContext, AccessibilityContext
│   │   ├── hooks/
│   │   ├── pages/            # LandingPage, LoginPage, PatientDashboard, CaregiverDashboard, MemoriesPage, PeoplePage, GamesPage, CaregiverPeopleMet, CaregiverMedsPage
│   │   ├── services/         # api, voiceService, faceService, i18n
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/        # authMiddleware
│   ├── models/            # User, Profiles, MemoryAndPeople, AppModels
│   ├── routes/            # auth, patients, memories, people, people-met, medications, routines, games, alerts, messages, location
│   ├── utils/             # seedData, memoryStore
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔑 Demo Credentials

Fast 1-click **Hackathon Quick Login** buttons are provided on the Login page!

| Role | Email | Password |
|---|---|---|
| **Patient (Ravi Kumar)** | `patient@memorybridge.org` | `demo123` |
| **Caregiver (Meera Sharma)** | `caregiver@memorybridge.org` | `demo123` |

---

## 💻 How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install   # or pnpm install
npm run seed  # Seed fictional demo data
npm start     # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install   # or pnpm install
npm run dev   # Starts Vite React dev server on http://localhost:3000
```

---

## 📡 API Overview

- `POST /api/auth/demo-login` - Instant JWT token generation for hackathon demo.
- `GET /api/patients/:id` - Fetch patient profile, location, and safety status.
- `GET /api/memories/:patientId` - Fetch personal memory stories and photos.
- `GET /api/people/:patientId` - Fetch familiar family & caregiver directory.
- `GET /api/people-met/:patientId` - Fetch daily encounter logs.
- `PUT /api/people-met/:id/identify` - Assign identity to an unknown visitor.
- `POST /api/medications/:id/take` - Log medication compliance.
- `POST /api/games/session` - Submit game session & calculate adaptive difficulty.
- `POST /api/alerts/simulate-safety` - Trigger simulated wandering alert.
- `POST /api/alerts/emergency` - Dispatch emergency call request.

---

## 🔒 Privacy, Security & Prototype Scope

1. **Biometric Data**: In production, facial embeddings require explicit consent and encrypted secure enclave storage.
2. **Medical Positioning**: Memory Bridge is an **assistance, cognitive engagement, and routine support tool**. It does **NOT** diagnose, treat, or predict dementia progression.

---

## 🌟 Future Scope

- Integration with wearable GPS geofencing.
- Native mobile app builds (React Native).
- Advanced multi-language voice models.
