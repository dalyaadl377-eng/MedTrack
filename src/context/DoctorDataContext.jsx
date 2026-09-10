import { createContext, useContext, useState, useCallback } from "react";
import {
  initialPatients,
  initialAppointments,
  initialConversations,
  initialNotifications,
} from "../data/doctorMockData";

const DoctorDataContext = createContext(null);

let idCounter = 1000;
const nextId = (prefix) => `${prefix}_${Date.now()}_${idCounter++}`;

export function DoctorDataProvider({ children }) {
  const [patients, setPatients] = useState(initialPatients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [conversations, setConversations] = useState(initialConversations);
  const [notifications, setNotifications] = useState(initialNotifications);

  // ---------------- Patients ----------------
  const getPatientById = useCallback((id) => patients.find((p) => p.id === id), [patients]);

  const addPatient = useCallback((data) => {
    const id = nextId("p");
    const mrnNumber = 1000 + patients.length + 1;
    const newPatient = {
      id,
      mrn: `MT-${mrnNumber}`,
      status: "Active",
      lastVisit: new Date().toISOString().slice(0, 10),
      allergies: [],
      vitals: { heartRate: "-", bloodPressure: "-", weight: "-", height: "-", temperature: "-" },
      history: [],
      reports: [],
      trends: [],
      avatarColor: "#17b9c4",
      ...data,
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, [patients.length]);

  const updatePatient = useCallback((id, updates) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePatient = useCallback((id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---------------- Reports (nested under patient) ----------------
  const addReport = useCallback((patientId, report) => {
    const id = nextId("r");
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, reports: [{ id, status: "Pending Review", values: [], ...report }, ...p.reports] }
          : p
      )
    );
    return id;
  }, []);

  const updateReport = useCallback((patientId, reportId, updates) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, reports: p.reports.map((r) => (r.id === reportId ? { ...r, ...updates } : r)) }
          : p
      )
    );
  }, []);

  const deleteReport = useCallback((patientId, reportId) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, reports: p.reports.filter((r) => r.id !== reportId) } : p
      )
    );
  }, []);

  // ---------------- Medical history (nested under patient) ----------------
  const addHistoryEntry = useCallback((patientId, entry) => {
    const id = nextId("h");
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, history: [{ id, ...entry }, ...p.history] } : p
      )
    );
    return id;
  }, []);

  const updateHistoryEntry = useCallback((patientId, entryId, updates) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, history: p.history.map((h) => (h.id === entryId ? { ...h, ...updates } : h)) }
          : p
      )
    );
  }, []);

  const deleteHistoryEntry = useCallback((patientId, entryId) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, history: p.history.filter((h) => h.id !== entryId) } : p
      )
    );
  }, []);

  // ---------------- Appointments ----------------
  const addAppointment = useCallback((data) => {
    const id = nextId("a");
    setAppointments((prev) => [{ id, status: "Upcoming", notes: "", ...data }, ...prev]);
    return id;
  }, []);

  const updateAppointment = useCallback((id, updates) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const deleteAppointment = useCallback((id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ---------------- Messages ----------------
  const sendMessage = useCallback((conversationId, text) => {
    const id = nextId("m");
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, { id, sender: "doctor", text, time }] }
          : c
      )
    );
  }, []);

  const markConversationRead = useCallback((conversationId) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)));
  }, []);

  // ---------------- Notifications ----------------
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    patients,
    getPatientById,
    addPatient,
    updatePatient,
    deletePatient,
    addReport,
    updateReport,
    deleteReport,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    conversations,
    sendMessage,
    markConversationRead,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  };

  return <DoctorDataContext.Provider value={value}>{children}</DoctorDataContext.Provider>;
}

export function useDoctorData() {
  const ctx = useContext(DoctorDataContext);
  if (!ctx) throw new Error("useDoctorData must be used within a DoctorDataProvider");
  return ctx;
}
