import { createContext, useContext, useState } from "react";

const ReportsContext = createContext();

const initialReports = [
  {
    id: 1,
    name: "Complete Blood Count",
    type: "Blood Test",
    date: "Sep 04, 2026",
    doctor: "Dr. Ahmed Hassan",
    status: "Reviewed",
  },
  {
    id: 2,
    name: "Lipid Profile",
    type: "Blood Test",
    date: "Aug 28, 2026",
    doctor: "Dr. Sara Ali",
    status: "Reviewed",
  },
  {
    id: 3,
    name: "Chest X-Ray",
    type: "Imaging",
    date: "Aug 15, 2026",
    doctor: "Dr. Omar Khaled",
    status: "Pending",
  },
  {
    id: 4,
    name: "Liver Function Test",
    type: "Blood Test",
    date: "Jul 30, 2026",
    doctor: "Dr. Ahmed Hassan",
    status: "Reviewed",
  },
];

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(initialReports);

const addReport = (newReport) => {
  const newId = Date.now();

  setReports((prevReports) => [
    {
      id: newId,
      status: "Pending",
      ...newReport,
    },
    ...prevReports,
  ]);

  return newId;
};
  const deleteReport = (id) => {
    setReports((prevReports) =>
      prevReports.filter(
        (report) => report.id !== id
      )
    );
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        addReport,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  return useContext(ReportsContext);
};