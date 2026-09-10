import { createContext, useContext, useState } from "react";
import {
  Activity,
  Stethoscope,
  Pill,
  FileText,
} from "lucide-react";

const MedicalHistoryContext = createContext();

const initialHistory = [
  {
    id: 1,
    date: "Sep 04, 2026",
    title: "General Health Checkup",
    doctor: "Dr. Ahmed Hassan",
    type: "Checkup",
    description:
      "Routine health checkup and review of recent laboratory results.",
    icon: Stethoscope,
  },
  {
    id: 2,
    date: "Aug 28, 2026",
    title: "Blood Test",
    doctor: "Dr. Sara Ali",
    type: "Lab Test",
    description:
      "Complete blood count and lipid profile were reviewed.",
    icon: Activity,
  },
  {
    id: 3,
    date: "Aug 15, 2026",
    title: "Medication Update",
    doctor: "Dr. Omar Khaled",
    type: "Medication",
    description:
      "Medication dosage was reviewed and updated during the visit.",
    icon: Pill,
  },
  {
    id: 4,
    date: "Jul 30, 2026",
    title: "Liver Function Test",
    doctor: "Dr. Ahmed Hassan",
    type: "Lab Test",
    description:
      "Liver function tests were performed and added to medical records.",
    icon: FileText,
  },
];

export const MedicalHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState(initialHistory);

  const addHistory = (newRecord) => {
    setHistory((prevHistory) => [
      {
        id: Date.now(),
        ...newRecord,
      },
      ...prevHistory,
    ]);
  };

  const updateHistory = (id, updatedRecord) => {
    setHistory((prevHistory) =>
      prevHistory.map((record) =>
        record.id === id
          ? {
              ...record,
              ...updatedRecord,
            }
          : record
      )
    );
  };

  const deleteHistory = (id) => {
    setHistory((prevHistory) =>
      prevHistory.filter(
        (record) => record.id !== id
      )
    );
  };

  return (
    <MedicalHistoryContext.Provider
      value={{
        history,
        addHistory,
        updateHistory,
        deleteHistory,
      }}
    >
      {children}
    </MedicalHistoryContext.Provider>
  );
};

export const useMedicalHistory = () => {
  return useContext(MedicalHistoryContext);
};