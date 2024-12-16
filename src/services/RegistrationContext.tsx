"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useWallet } from "./walletContext";
import { isRegistered } from "./Web3Services";
import RegisterModal from "@/componentes/RegisterModal";

interface RegisterContextProps {
    isRegisteredV: boolean | null;
    requireRegistration: (callback: () => void) => void;
    showRegisterModal: boolean;
    setIsRegisteredV : (isRegisteredV: boolean | null) => void;
  }
  

const RegisterContext = createContext<RegisterContextProps | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRegisteredV, setIsRegisteredV] = useState<boolean | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { address: walletAddress } = useWallet();

  useEffect(() => {
    if (walletAddress) {
      isRegistered(walletAddress)
        .then((status) => setIsRegisteredV(status))
        .catch(() => setIsRegisteredV(false));
    }
  }, [walletAddress]);
  

  
  const requireRegistration = (): Promise<void> => {
    return new Promise((resolve) => {
      if (isRegisteredV) {
        resolve(); 
      } else {
        setShowRegisterModal(false); 
        setTimeout(() => {
          setShowRegisterModal(true);
        }, 0);
      }
    });
  };
  
  



  return (
    <RegisterContext.Provider
      value={{
        setIsRegisteredV,
        isRegisteredV,
        requireRegistration,
        showRegisterModal,
      }}
    >

      {children}
      {showRegisterModal && <RegisterModal />}
    </RegisterContext.Provider>
  );
};

export const useRegistered = () => {
    const context = useContext(RegisterContext);
    if (!context) {
      throw new Error("useRegistered must be used in RegisterProvider");
    }
    return context;
  };
