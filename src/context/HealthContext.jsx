import { createContext, useContext, useState } from "react";

const HealthContext = createContext();

const initialHealthData = {
  heartRate: {
    value: 72,
    unit: "BPM",
    status: "Normal",
  },

  bloodPressure: {
    value: "120/80",
    unit: "mmHg",
    status: "Normal",
  },

  bloodSugar: {
    value: 95,
    unit: "mg/dL",
    status: "Normal",
  },

  weight: {
    value: 68,
    unit: "kg",
    status: "Stable",
  },
};

export const HealthProvider = ({ children }) => {
  const [healthData, setHealthData] =
    useState(initialHealthData);

  const updateHealthData = (name, data) => {
    setHealthData((prevData) => ({
      ...prevData,
      [name]: {
        ...prevData[name],
        ...data,
      },
    }));
  };

  return (
    <HealthContext.Provider
      value={{
        healthData,
        updateHealthData,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  return useContext(HealthContext);
};