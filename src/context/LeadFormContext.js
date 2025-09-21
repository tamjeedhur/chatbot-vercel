'use client'
import { createContext, useContext, useState } from "react";

const LeadFormContext = createContext();

export const LeadFormProvider = ({ children }) => {
  const [title, setTitle] = useState("Let us know how to contact you");
  const [nameEnabled, setNameEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [phoneEnabled, setPhoneEnabled] = useState(false);

  const resetSettings = () => {
    setTitle("Let us know how to contact you");
    setNameEnabled(false);
    setEmailEnabled(false);
    setPhoneEnabled(false);
  };


  return (
    <LeadFormContext.Provider
      value={{
        title,
        setTitle,
        nameEnabled,
        setNameEnabled,
        emailEnabled,
        setEmailEnabled,
        phoneEnabled,
        setPhoneEnabled,
        resetSettings,
      }}
    >
      {children}
    </LeadFormContext.Provider>
  );
};

export const useLeadForm = () => useContext(LeadFormContext);
