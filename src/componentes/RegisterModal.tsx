"use client";

import { useRegistered } from "@/services/RegistrationContext";
import { useWallet } from "@/services/walletContext";
import { isRegistered, registerUser } from "@/services/Web3Services";
import { useState, useEffect } from "react";
import ModalError from "./ModalError";
import ModalSuccess from "./ModalSuccess";

interface RegisterProps {
  addressSponsor?: string;
}


export default function RegisterModal({ addressSponsor }: RegisterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRegisteredUser, setIsRegisteredUser] = useState(true);
  const [referralAddress, setReferralAddress] = useState(addressSponsor?addressSponsor:""); 
  const walletAddress = useWallet().address;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const { setIsRegisteredV } = useRegistered();
  useEffect(() => {
    if (walletAddress) {
      isRegistered(walletAddress).then((result) => {
        setIsRegisteredUser(result);
      });
    }
  }, [walletAddress]);

  const closeModal = () => {
    setIsOpen(false);
  };
  

  const handleRegisterSponsor = () => {
    setLoading(true);
    if (referralAddress.trim() === "") {
      setError("Please enter a referral address!");
      return;
    }

    registerUser(referralAddress)
      .then(() => {
        setAlert("Sponsor registered successfully!");
        setLoading(false)
        setIsOpen(false); 
        setIsRegisteredV(true)

      })
      .catch((error) => {
        setLoading(false)
        console.error("Error registering sponsor:", error);
        setError("Failed to register sponsor. Please try again.");
      });
  };

  if (!walletAddress || !isOpen || isRegisteredUser) {
    return null;
  }

  async function clearError(){
    setError("");
}

async function clearAlert(){
    setAlert("");
}

  return (
    <>
    {error && <ModalError msg={error} onClose={clearError} />}
                {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
                {loading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
                  </div>
                )}
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={closeModal}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md">
        {/* Header */}
        <div className="relative">
          <img
            className="absolute left-1/2 max-w-[2000%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 !w-[110%]"
            src="images/registerUserBanner.png"
            alt="Banner"
          />
          <h2 className="absolute text-2xl font-bold text-black -bottom-3 left-4">
            Register
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center text-gray-800 mt-7">
          <p className="text-gray-700 mb-4">
            To use the platform, you must register as an affiliate under an already registered address. Referral links are available in the project's community groups.
          </p>
          <input
            type="text"
            className="w-full px-4 text-sm py-2 border !border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-[#00FF3D]"
            placeholder="Referral Address"
            value={referralAddress} 
            onChange={(e) => setReferralAddress(e.target.value)} 
          />
        </div>

        {/* Footer */}
        <div className="p-4">
          <button
            className="w-full bg-[#00FF3D] text-black py-2 px-4 rounded-lg hover:bg-[#00ff0d] transition"
            onClick={handleRegisterSponsor} 
          >
            Register Sponsor
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
