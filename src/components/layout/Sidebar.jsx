import {
  LayoutDashboard,
  FileText,
  HeartPulse,
  History,
  Lightbulb,
  Pill,
  CalendarDays,
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/patient/dashboard",
  },
  {
    label: "My Reports",
    icon: FileText,
    path: "/patient/reports",
  },
  {
    label: "Health Summary",
    icon: HeartPulse,
    path: "/patient/health-summary",
  },
  {
    label: "Medical History",
    icon: History,
    path: "/patient/medical-history",
  },
  {
    label: "Insights",
    icon: Lightbulb,
    path: "/patient/insights",
  },
  {
    label: "Medications",
    icon: Pill,
    path: "/patient/medications",
  },
  {
    label: "Appointments",
    icon: CalendarDays,
    path: "/patient/appointments",
  },
  {
    label: "Reminders",
    icon: Bell,
    path: "/patient/reminders",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    path: "/patient/messages",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">M</div>

        <div>
          <h2>MedTrack</h2>
          <span>Patient Portal</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">
        <p className="nav-title">ACCOUNT</p>

        <NavLink
          to="/patient/profile"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <User size={19} strokeWidth={1.8} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/patient/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={19} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;