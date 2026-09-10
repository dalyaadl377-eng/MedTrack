import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

const initialProfile = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@email.com",
  phone: "+20 100 123 4567",
  dateOfBirth: "1998-05-14",
  bloodType: "O+",
  address: "Cairo, Egypt",
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = (updatedProfile) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      ...updatedProfile,
    }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};