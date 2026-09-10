import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

const initialSettings = {
  emailNotifications: true,
  appointmentReminders: true,
  medicationReminders: true,
  healthUpdates: true,
  twoFactor: false,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);

  const updateSetting = (name, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const updateSettings = (updatedSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...updatedSettings,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};