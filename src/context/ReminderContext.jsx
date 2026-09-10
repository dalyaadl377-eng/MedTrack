import { createContext, useContext, useState } from "react";
import {
  Pill,
  CalendarDays,
  Stethoscope,
} from "lucide-react";

const RemindersContext = createContext();

const initialReminders = [
  {
    id: 1,
    title: "Take Metformin",
    type: "Medication",
    time: "08:00 AM",
    date: "Today",
    description: "Take 500 mg after breakfast.",
    status: "Active",
    icon: Pill,
  },
  {
    id: 2,
    title: "Cardiology Appointment",
    type: "Appointment",
    time: "02:00 PM",
    date: "Sep 15, 2026",
    description:
      "Video consultation with Dr. Sara Ali.",
    status: "Active",
    icon: CalendarDays,
  },
  {
    id: 3,
    title: "Take Vitamin D3",
    type: "Medication",
    time: "09:00 AM",
    date: "Today",
    description:
      "Take one Vitamin D3 tablet.",
    status: "Active",
    icon: Pill,
  },
  {
    id: 4,
    title: "Annual Health Checkup",
    type: "Checkup",
    time: "10:30 AM",
    date: "Sep 20, 2026",
    description:
      "Routine health checkup appointment.",
    status: "Active",
    icon: Stethoscope,
  },
];

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] =
    useState(initialReminders);

  const addReminder = (newReminder) => {
    setReminders((prevReminders) => [
      {
        id: Date.now(),
        status: "Active",
        ...newReminder,
      },
      ...prevReminders,
    ]);
  };

  const updateReminder = (
    id,
    updatedReminder
  ) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              ...updatedReminder,
            }
          : reminder
      )
    );
  };

  const markReminderDone = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              status: "Completed",
            }
          : reminder
      )
    );
  };

  const deleteReminder = (id) => {
    setReminders((prevReminders) =>
      prevReminders.filter(
        (reminder) => reminder.id !== id
      )
    );
  };

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        markReminderDone,
        deleteReminder,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  return useContext(RemindersContext);
};