// Mock user records. In production this table lives server-side —
// authService.js is the only file that should ever read this directly.
export const mockUsers = [
  {
    id: "u_patient_1",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "Patient123!",
    role: "PATIENT",
    verified: true,
    avatar: null,
  },
  {
    id: "u_doctor_1",
    fullName: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    password: "Doctor123!",
    role: "DOCTOR",
    specialty: "Cardiologist",
    verified: true,
    avatar: null,
  },
];
