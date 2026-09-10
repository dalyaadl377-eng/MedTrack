import { createContext, useContext, useState } from "react";

const AppointmentsContext = createContext();

const initialAppointments = [
  {
    id: 1,
    doctor: "Dr. Ahmed Hassan",
    specialty: "Internal Medicine",
    date: "Sep 10, 2026",
    time: "10:30 AM",
    location: "MedTrack Medical Center",
    type: "In Person",
    status: "Upcoming",
  },
  {
    id: 2,
    doctor: "Dr. Sara Ali",
    specialty: "Cardiology",
    date: "Sep 15, 2026",
    time: "02:00 PM",
    location: "Online Consultation",
    type: "Video Call",
    status: "Upcoming",
  },
  {
    id: 3,
    doctor: "Dr. Omar Khaled",
    specialty: "Radiology",
    date: "Aug 20, 2026",
    time: "11:00 AM",
    location: "MedTrack Medical Center",
    type: "In Person",
    status: "Completed",
  },
  {
    id: 4,
    doctor: "Dr. Ahmed Hassan",
    specialty: "Internal Medicine",
    date: "Jul 12, 2026",
    time: "09:30 AM",
    location: "MedTrack Medical Center",
    type: "In Person",
    status: "Cancelled",
  },
];

export const AppointmentsProvider = ({
  children,
}) => {
  const [appointments, setAppointments] =
    useState(initialAppointments);

  const addAppointment = (newAppointment) => {
    setAppointments((prevAppointments) => [
      {
        id: Date.now(),
        status: "Upcoming",
        ...newAppointment,
      },
      ...prevAppointments,
    ]);
  };

  const updateAppointment = (
    id,
    updatedAppointment
  ) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              ...updatedAppointment,
            }
          : appointment
      )
    );
  };

  const cancelAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "Cancelled",
            }
          : appointment
      )
    );
  };

  const deleteAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter(
        (appointment) =>
          appointment.id !== id
      )
    );
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  return useContext(AppointmentsContext);
};