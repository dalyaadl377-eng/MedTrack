import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

const initialNotifications = [
  {
    id: 1,
    title: "New Report Available",
    message:
      "Your Complete Blood Count report is now available.",
    time: "10 minutes ago",
    type: "report",
    read: false,
   path: "/patient/reports/1",
  },
  {
    id: 2,
    title: "Upcoming Appointment",
    message:
      "You have an appointment with Dr. Sara Ali on September 15.",
    time: "1 hour ago",
    type: "appointment",
    read: false,
   path: "/patient/appointments",
  },
  {
    id: 3,
    title: "Medication Reminder",
    message:
      "It is time to take your Metformin 500 mg.",
    time: "2 hours ago",
    type: "medication",
    read: false,
   path: "/patient/reminders",
  },
  {
    id: 4,
    title: "Health Update",
    message:
      "Your latest health measurements have been updated.",
    time: "Yesterday",
    type: "health",
    read: true,
    path: "/patient/health-summary",
  },
];

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const addNotification = (newNotification) => {
    setNotifications((prevNotifications) => [
      {
        id: Date.now(),
        read: false,
        time: "Just now",
        ...newNotification,
      },
      ...prevNotifications,
    ]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};