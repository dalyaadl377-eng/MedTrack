import { LayoutDashboard, FileText, History, LineChart, Pill, CalendarClock, Bell, MessageSquare, User, Settings } from "lucide-react";

export const patientNav = [
  {
    group: "",
    items: [{ label: "Dashboard", to: "/patient/dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    group: "Records",
    items: [
      { label: "My Reports", to: "/patient/reports", icon: FileText },
     { label: "Medical History", to: "/patient/medical-history", icon: History },
      { label: "Insights", to: "/patient/insights", icon: LineChart },
      { label: "Medications", to: "/patient/medications", icon: Pill },
    ],
  },
  {
    group: "Care",
    items: [
      { label: "Appointments", to: "/patient/appointments", icon: CalendarClock },
      { label: "Reminders", to: "/patient/reminders", icon: Bell },
      { label: "Messages", to: "/patient/messages", icon: MessageSquare, badge: 3 },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Profile", to: "/patient/profile", icon: User },
      { label: "Settings", to: "/patient/settings", icon: Settings },
    ],
  },
];
