import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, ChevronDown } from "lucide-react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

export default function DashboardShell({ navItems, children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:sticky top-0 h-screen w-64 shrink-0 border-r border-ink-border bg-ink-900 z-40",
          "flex flex-col px-4 py-5 transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-1 mb-6">
          <Logo size="sm" />
          <button className="lg:hidden text-mist-400" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navItems.map((group) => (
            <div key={group.group} className="mb-5">
              {group.group && (
                <p className="px-3 text-[11px] font-medium text-mist-500 tracking-wide mb-2">{group.group}</p>
              )}
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        [
                          "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-teal-500/10 text-teal-300"
                            : "text-mist-400 hover:text-mist-100 hover:bg-ink-800",
                        ].join(" ")
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <item.icon size={17} />
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="text-[11px] bg-teal-500 text-ink-950 rounded-full px-1.5 py-0.5 font-semibold">
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-mist-400 hover:text-danger hover:bg-danger/10 transition-colors mt-2"
        >
          <LogOut size={17} /> Log out
        </button>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-ink-border bg-ink-950/90 backdrop-blur-sm px-5 py-3.5">
          <button className="lg:hidden text-mist-300" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => navigate("/doctor/notifications")}
            className="relative text-mist-400 hover:text-mist-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-[10px] font-bold text-ink-950 flex items-center justify-center">
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/doctor/profile")}
            className="flex items-center gap-2.5 pl-3 border-l border-ink-border hover:opacity-80 transition-opacity"
            aria-label="Profile"
          >
            <div className="w-9 h-9 rounded-full bg-ink-700 border border-ink-border flex items-center justify-center text-sm font-medium text-mist-100">
              {currentUser?.fullName?.[0] || "?"}
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm text-mist-100">{currentUser?.fullName}</p>
              <p className="text-xs text-mist-500 capitalize">{currentUser?.role?.toLowerCase()}</p>
            </div>
            <ChevronDown size={15} className="text-mist-500 hidden sm:block" />
          </button>
        </header>

        <main className="flex-1 p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
