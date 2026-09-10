import { LayoutDashboard, Users, CalendarClock, Stethoscope, FileText, FlaskConical, Activity, MessageSquare, Bell, BarChart3, Sparkles, Settings, User, GitCompare } from "lucide-react";

export const doctorNav = [
  {
    group: "",
    items: [{ label: "Dashboard", to: "/doctor/dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    group: "Patient Management",
    items: [
      { label: "Patients", to: "/doctor/patients", icon: Users },
      { label: "Appointments", to: "/doctor/appointments", icon: CalendarClock },
      { label: "Consultations", to: "/doctor/consultations", icon: Stethoscope },
    ],
  },
  {
    group: "Medical Records",
    items: [
      { label: "All Reports", to: "/doctor/reports", icon: FileText },
      { label: "Lab Results", to: "/doctor/lab-results", icon: FlaskConical },
      { label: "Compare Reports", to: "/doctor/compare", icon: GitCompare },
      { label: "Medical History", to: "/doctor/history", icon: Activity },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Messages", to: "/doctor/messages", icon: MessageSquare, badge: 2 },
      { label: "Notifications", to: "/doctor/notifications", icon: Bell, badge: 4 },
    ],
  },
  {
    group: "Tools & Analytics",
    items: [
      { label: "Analytics", to: "/doctor/analytics", icon: BarChart3 },
      { label: "AI Insights", to: "/doctor/ai-insights", icon: Sparkles },
    ],
  },
  {
    group: "Settings",
    items: [
      { label: "Profile", to: "/doctor/profile", icon: User },
      { label: "Settings", to: "/doctor/settings", icon: Settings },
    ],
  },
];
