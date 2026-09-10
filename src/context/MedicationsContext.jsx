import { createContext, useContext, useState } from "react";

const MedicationsContext = createContext();

const initialMedications = [
  {
    id: 1,
    name: "Metformin",
    dosage: "500 mg",
    frequency: "Twice daily",
    time: "08:00 AM & 08:00 PM",
    doctor: "Dr. Ahmed Hassan",
    startDate: "Aug 10, 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "Once daily",
    time: "09:00 AM",
    doctor: "Dr. Sara Ali",
    startDate: "Jul 20, 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20 mg",
    frequency: "Once daily",
    time: "09:00 PM",
    doctor: "Dr. Ahmed Hassan",
    startDate: "Jun 15, 2026",
    status: "Active",
  },
  {
    id: 4,
    name: "Amoxicillin",
    dosage: "500 mg",
    frequency: "Three times daily",
    time: "08:00 AM, 02:00 PM & 08:00 PM",
    doctor: "Dr. Omar Khaled",
    startDate: "May 02, 2026",
    status: "Completed",
  },
];

export const MedicationsProvider = ({
  children,
}) => {
  const [medications, setMedications] =
    useState(initialMedications);

  const addMedication = (newMedication) => {
    setMedications((prevMedications) => [
      {
        id: Date.now(),
        ...newMedication,
      },
      ...prevMedications,
    ]);
  };

  const updateMedication = (
    id,
    updatedMedication
  ) => {
    setMedications((prevMedications) =>
      prevMedications.map((medication) =>
        medication.id === id
          ? {
              ...medication,
              ...updatedMedication,
            }
          : medication
      )
    );
  };

  const deleteMedication = (id) => {
    setMedications((prevMedications) =>
      prevMedications.filter(
        (medication) =>
          medication.id !== id
      )
    );
  };

  return (
    <MedicationsContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
      }}
    >
      {children}
    </MedicationsContext.Provider>
  );
};

export const useMedications = () => {
  return useContext(MedicationsContext);
};