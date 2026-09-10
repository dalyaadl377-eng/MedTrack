import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth / Routing
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import GuestRoute from "./routes/GuestRoute";

// Shared
import Splash from "./pages/shared/Splash";
import ComingSoon from "./pages/shared/ComingSoon";
import LandingPage from "./pages/landing/LandingPage";
import About from "./pages/landing/About";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Onboarding from "./pages/auth/Onboarding";

// Layout
import PatientLayout from "./components/layout/PatientLayout";

// Patient Pages
import Dashboard from "./pages/patient/Dashboard";
import Reports from "./pages/patient/Reports";
import ReportDetails from "./pages/patient/ReportDetails";
import HealthSummary from "./pages/patient/HealthSummary";
import MedicalHistory from "./pages/patient/MedicalHistory";
import Insights from "./pages/patient/Insights";
import Medications from "./pages/patient/Medications";
import Appointments from "./pages/patient/Appointments";
import Reminders from "./pages/patient/Reminders";
import Messages from "./pages/patient/Messages";
import Profile from "./pages/patient/Profile";
import Settings from "./pages/patient/Settings";

// Patient Contexts
import { ReportsProvider } from "./context/ReportsContext";
import { HealthProvider } from "./context/HealthContext";
import { MedicationsProvider } from "./context/MedicationsContext";
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { RemindersProvider } from "./context/ReminderContext";
import { MessagesProvider } from "./context/MessagesContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SettingsProvider } from "./context/SettingsContext";
import { MedicalHistoryProvider } from "./context/MedicalHistoryContext";
import { NotificationsProvider } from "./context/NotificationsContext";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Patients from "./pages/doctor/Patients";
import PatientProfile from "./pages/doctor/PatientProfile";
import DoctorAppointments from "./pages/doctor/Appointments";
import Consultations from "./pages/doctor/Consultations";
import DoctorReports from "./pages/doctor/Reports";
import LabResults from "./pages/doctor/LabResults";
import CompareReports from "./pages/doctor/CompareReports";
import DoctorMedicalHistory from "./pages/doctor/MedicalHistory";
import DoctorMessages from "./pages/doctor/Messages";
import DoctorNotifications from "./pages/doctor/Notifications";
import Analytics from "./pages/doctor/Analytics";
import AIInsights from "./pages/doctor/AIInsights";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorSettings from "./pages/doctor/Settings";
import { DoctorDataProvider } from "./context/DoctorDataContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportsProvider>
          <HealthProvider>
            <MedicationsProvider>
              <AppointmentsProvider>
                <RemindersProvider>
                  <MessagesProvider>
                    <ProfileProvider>
                      <SettingsProvider>
                        <MedicalHistoryProvider>
                          <NotificationsProvider>
                          <DoctorDataProvider>
                            <Routes>
                              {/* Public Pages */}
                              <Route path="/" element={<Splash />} />
                              <Route path="/home" element={<LandingPage />} />
                              <Route path="/about" element={<About />} />

                              {/* Guest-only Auth Routes */}
                              <Route element={<GuestRoute />}>
                                <Route
                                  path="/login"
                                  element={<Login />}
                                />

                                <Route
                                  path="/signup"
                                  element={<Signup />}
                                />

                                <Route
                                  path="/verify-otp"
                                  element={<VerifyOtp />}
                                />

                                <Route
                                  path="/forgot-password"
                                  element={<ForgotPassword />}
                                />

                                <Route
                                  path="/reset-password"
                                  element={<ResetPassword />}
                                />
                              </Route>

                              {/* Onboarding */}
                              <Route
                                path="/onboarding"
                                element={<Onboarding />}
                              />

                              {/* Protected Application */}
                              <Route element={<ProtectedRoute />}>
                                {/* ========================= */}
                                {/* PATIENT SIDE */}
                                {/* ========================= */}

                                <Route
                                  element={
                                    <RoleRoute allow={["PATIENT"]} />
                                  }
                                >
                                  <Route
                                    path="/patient"
                                    element={
                                      <Navigate
                                        to="/patient/dashboard"
                                        replace
                                      />
                                    }
                                  />

                                  <Route
                                    path="/patient/dashboard"
                                    element={
                                      <PatientLayout>
                                        <Dashboard />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/reports"
                                    element={
                                      <PatientLayout>
                                        <Reports />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/reports/:id"
                                    element={
                                      <PatientLayout>
                                        <ReportDetails />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/health-summary"
                                    element={
                                      <PatientLayout>
                                        <HealthSummary />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
  path="/patient/medical-history"
  element={
    <PatientLayout>
      <MedicalHistory />
    </PatientLayout>
  }
/>
                                  <Route
                                    path="/patient/insights"
                                    element={
                                      <PatientLayout>
                                        <Insights />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/medications"
                                    element={
                                      <PatientLayout>
                                        <Medications />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/appointments"
                                    element={
                                      <PatientLayout>
                                        <Appointments />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/reminders"
                                    element={
                                      <PatientLayout>
                                        <Reminders />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/messages"
                                    element={
                                      <PatientLayout>
                                        <Messages />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/profile"
                                    element={
                                      <PatientLayout>
                                        <Profile />
                                      </PatientLayout>
                                    }
                                  />

                                  <Route
                                    path="/patient/settings"
                                    element={
                                      <PatientLayout>
                                        <Settings />
                                      </PatientLayout>
                                    }
                                  />
                                </Route>

                                {/* ========================= */}
                                {/* DOCTOR SIDE */}
                                {/* ========================= */}

                                <Route
                                  element={
                                    <RoleRoute allow={["DOCTOR"]} />
                                  }
                                >
                                  <Route
                                    path="/doctor/dashboard"
                                    element={<DoctorDashboard />}
                                  />

                                  <Route
                                    path="/doctor/patients"
                                    element={<Patients />}
                                  />

                                  <Route
                                    path="/doctor/patients/:id"
                                    element={<PatientProfile />}
                                  />

                                  <Route
                                    path="/doctor/appointments"
                                    element={<DoctorAppointments />}
                                  />

                                  <Route
                                    path="/doctor/consultations"
                                    element={<Consultations />}
                                  />

                                  <Route
                                    path="/doctor/reports"
                                    element={<DoctorReports />}
                                  />

                                  <Route
                                    path="/doctor/lab-results"
                                    element={<LabResults />}
                                  />

                                  <Route
                                    path="/doctor/compare"
                                    element={<CompareReports />}
                                  />

                                  <Route
                                    path="/doctor/history"
                                    element={<DoctorMedicalHistory />}
                                  />

                                  <Route
                                    path="/doctor/messages"
                                    element={<DoctorMessages />}
                                  />

                                  <Route
                                    path="/doctor/notifications"
                                    element={<DoctorNotifications />}
                                  />

                                  <Route
                                    path="/doctor/analytics"
                                    element={<Analytics />}
                                  />

                                  <Route
                                    path="/doctor/ai-insights"
                                    element={<AIInsights />}
                                  />

                                  <Route
                                    path="/doctor/profile"
                                    element={<DoctorProfile />}
                                  />

                                  <Route
                                    path="/doctor/settings"
                                    element={<DoctorSettings />}
                                  />
                                </Route>
                              </Route>

                              {/* Fallback */}
                              <Route
                                path="*"
                                element={
                                  <Navigate to="/home" replace />
                                }
                              />
                            </Routes>
                          </DoctorDataProvider>
                          </NotificationsProvider>
                        </MedicalHistoryProvider>
                      </SettingsProvider>
                    </ProfileProvider>
                  </MessagesProvider>
                </RemindersProvider>
              </AppointmentsProvider>
            </MedicationsProvider>
          </HealthProvider>
        </ReportsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}