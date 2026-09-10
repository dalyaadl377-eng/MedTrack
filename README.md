# MedTrack — Frontend (Auth & Landing scope)

React + Vite + Tailwind v4 frontend for MedTrack, covering this contributor's
scope: Splash, Landing Page (Navbar/Footer/About/How It Works/Features),
Login, Sign Up, OTP Verification, Forgot/Reset Password, Onboarding,
Protected Routes, and Role-Based Routing.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

## Architecture notes

- **Mock service layer**: `src/services/authService.js` is the single place
  that knows about "the backend." Every function (`login`, `signup`,
  `verifyOtp`, `resendOtp`, `forgotPassword`, `resetPassword`, `logout`)
  currently reads/writes an in-memory mock user table
  (`src/data/mockUsers.js`) with an artificial delay. To integrate the real
  API, replace the internals of these functions with `axios` calls — no
  other file needs to change, because pages and `AuthContext` only ever call
  through this module.
- **Auth state**: `src/context/AuthContext.jsx` centralizes `currentUser`,
  `role`, and all auth actions. Components read it via `useAuth()`.
- **Route guards**: `src/routes/ProtectedRoute.jsx` blocks unauthenticated
  users, `src/routes/RoleRoute.jsx` restricts a route group to a role
  (`PATIENT` / `DOCTOR`), `src/routes/GuestRoute.jsx` redirects already
  logged-in users away from Login/Signup. All are wired in `src/App.jsx`.
- **Dashboards**: `PatientDashboard` and `DoctorDashboard` are minimal but
  functional landing points after login so role routing has something real
  to point at. Everything else under `/patient/*` and `/doctor/*` is a
  `ComingSoon` placeholder — those pages belong to other parts of the team
  and are intentionally not built out here.
- **Reusable UI kit**: `src/components/ui/` — Button, Input, PasswordInput
  (strength meter), OTPInput (auto-focus/backspace/paste), Card, Badge,
  Alert, Loader, EmptyState, ErrorState, SectionHeader, Logo.

## Demo accounts

| Role    | Email                     | Password    |
|---------|---------------------------|-------------|
| Patient | sarah.johnson@example.com | Patient123! |
| Doctor  | ahmed.hassan@example.com  | Doctor123!  |

New signups go through the real mock flow: Sign Up → OTP (check the browser
console for the generated code) → Onboarding → Dashboard.

## Still to do (by design, out of this scope)

- Reports, History, Insights, Medications, Appointments, Messages, Profile,
  Settings pages (patient side)
- Patients, Consultations, Lab Results, Analytics, AI Insights pages
  (doctor side)
- Real API integration (swap `authService.js` internals)
