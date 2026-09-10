import {
  Bell,
  Mail,
  MessageSquare,
  ChevronDown,
  FileText,
  CalendarDays,
  Pill,
  HeartPulse,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../context/NotificationsContext";
import { useProfile } from "../../context/ProfileContext";

const Topbar = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const { profile } = useProfile();

  const [showNotifications, setShowNotifications] = useState(false);

  const getInitials = () => {
    const firstInitial = profile?.firstName?.charAt(0) || "";
    const lastInitial = profile?.lastName?.charAt(0) || "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const getFullName = () => {
    return `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    setShowNotifications(false);

    if (notification.path) {
      navigate(notification.path);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "report":
        return FileText;

      case "appointment":
        return CalendarDays;

      case "medication":
        return Pill;

      case "health":
        return HeartPulse;

      case "message":
        return MessageSquare;

      default:
        return Bell;
    }
  };

  return (
    <header className="topbar">

      {/* Welcome */}
      <div className="topbar-welcome">
        <strong>
          Good evening, {profile?.firstName || "Patient"} 👋
        </strong>

        <span>
          Here's your health overview for today
        </span>
      </div>

      {/* Actions */}
      <div className="topbar-actions">

        {/* Notifications */}
        <div className="notification-wrapper">
          <button
            className="topbar-icon"
            type="button"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
            title="Notifications"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notifications-dropdown">

              <div className="notifications-header">
                <div>
                  <h3>Notifications</h3>

                  <span>{unreadCount} unread</span>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="mark-all-button"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={15} />
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notifications-list">

                {notifications.length === 0 ? (
                  <div className="notifications-empty">
                    <Bell size={28} />

                    <strong>No notifications</strong>

                    <span>
                      You're all caught up.
                    </span>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getNotificationIcon(
                      notification.type
                    );

                    return (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.read ? "unread" : ""
                        }`}
                      >

                        <button
                          type="button"
                          className="notification-content"
                          onClick={() =>
                            handleNotificationClick(notification)
                          }
                        >
                          <div className="notification-icon">
                            <Icon size={18} />
                          </div>

                          <div className="notification-text">
                            <strong>
                              {notification.title}
                            </strong>

                            <p>
                              {notification.message}
                            </p>

                            <span>
                              {notification.time}
                            </span>
                          </div>

                          {!notification.read && (
                            <span className="unread-dot" />
                          )}
                        </button>

                        <button
                          type="button"
                          className="notification-delete"
                          onClick={() =>
                            deleteNotification(notification.id)
                          }
                          title="Delete notification"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    );
                  })
                )}

              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button
          className="topbar-icon"
          type="button"
          onClick={() => navigate("/patient/messages")}
          title="Messages"
        >
          <Mail size={21} />
        </button>

        {/* Profile */}
        <button
          className="profile-button"
          type="button"
          onClick={() => navigate("/patient/profile")}
          title="Profile"
        >
          <div className="profile-avatar">
            {getInitials()}
          </div>

          <div className="profile-info">
            <strong>
              {getFullName()}
            </strong>

            <span>Patient</span>
          </div>

          <ChevronDown size={17} />
        </button>

      </div>
    </header>
  );
};

export default Topbar;