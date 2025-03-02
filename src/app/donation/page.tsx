"use client";
import React from "react";

import { donate,getContributions, getDonationAllowance,getUser,getBtc24hBalance,getTotalBurned,approveBTC24HDonation,getTimeUntilToClaim,getBtc24hPreviewedClaim,claim, getBtc24hPrice, getNextPool, approveUsdtDonation, getAllowanceUsdt, getDonationAllowanceUsdt, getUsdtBalance, getAllowanceUsdtV2, approveUsdtDonationV2, donateV2, getBtc24hPreviewedClaimV2, getBtc24hPriceV2, getTimeUntilToClaimV2, claimV2, getUserV2} from "@/services/Web3Services";
import { useRef, useState } from "react";
import withAuthGuard from "@/services/authGuard";
import Footer from "@/componentes/footer";
import { useWallet } from "@/services/walletContext";
import { ethers } from "ethers";
import { useEffect } from "react";
import { formatUsdt } from "@/services/utils";
import { UserDonation } from "@/services/types";
import { useRegistered } from "@/services/RegistrationContext";
import ModalError from "@/componentes/ModalError";
import { TbReload } from "react-icons/tb";
import ModalSuccess from "@/componentes/ModalSuccess";


interface Contribution {
  index: number;
  amount: number;
  goal: number;
  startTime: number;
  endTime: number;
  days: number;
  timestamps: number[];
  claims: number[];
  priceClaim: number[];

}


function Donation() {
  const [isEnglish, setIsEnglish] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const [dayContribute, setDayContribute] = useState(0);
  const [allowanceUsdtV2, setAllowanceUsdtV2] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [timeUntil, setTimeUntil] = useState("00h:00min:00s");
  const [timeUntilNumber, setTimeUntilNumber] = useState<Number>(0)
  const [balanceToClaim, setBalanceToClaim] = useState<bigint>(0n);
  const [balanceToClaimV2, setBalanceToClaimV2] = useState<bigint>(0n);
  const [btc24hRealPrice, setBtc24hRealPrice] = useState<bigint>(0n);
  const [btc24hPrice, setBtc24hPrice] = useState<bigint>(0n);
  const [btc24hPriceV2, setBtc24hPriceV2] = useState<bigint>(0n);
  const [nextPool, setNextPool] = useState<bigint>(0n);
  const [totalBurned, setTotalBurned] = useState<bigint>(0n);
  const [isV2, setIsV2] = useState<boolean>(false)
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [contributionIndex, setContributionIndex] = useState<number>(0);

  const { requireRegistration } = useRegistered();
  const [show, setShow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [user, setUser] = useState<UserDonation| null>(null);

  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [steps, setSteps] = useState<number>(0)
  const [donateWithUsdt, setDonateWithUsdt] = useState(false);
  
  const walletAddress = useWallet().address;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInSeconds: bigint) => {
    const hours = (timeInSeconds / 3600n).toString().padStart(2, '0');
    const minutes = ((timeInSeconds % 3600n) / 60n).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60n).toString().padStart(2, '0');
    return `${hours}h:${minutes}min:${seconds}s`;
  };



  
  async function handleContributionIndex(index:number){
    setContributionIndex(index);
  }

  


  useEffect(() => {
    const fetchTimeLeft = async () => {
      if (!walletAddress) return;
      if(contributions.length == 0) return;
      
      try {
        const timeLeft = await getTimeUntilToClaim(walletAddress, contributions[contributionIndex].index);
        console.log("chamou", timeLeft)

        // Atualiza os estados com os valores obtidos
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilNumber(Number(timeLeft));
        
  
        // Inicia o cronômetro decremental
        startDecrementalTimer(timeLeft);
      } catch (error) {
      }
    };
  
    fetchTimeLeft();
  }, [walletAddress, contributionIndex, contributions]);
  const fetchContributions = async (owner: string) => {
    try {
      const response = await getContributions(owner);
  
      if (response.success === false) {
        throw new Error(response.errorMessage);
      }
  
      if (Array.isArray(response)) {
        const formattedContributions = response.map((item: any[]) => ({
          index: Number(item[0]),
          amount: Number(item[1]),
          goal: Number(item[2]),
          startTime: Number(item[3]),
          endTime: Number(item[4]),
          days: Number(item[5]),
          timestamps: (item[6]),
          claims: (item[7]),
          priceClaim: (item[8]),

        }));
  
        setContributions(formattedContributions);

        
      } else {
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    }
  };
  

  useEffect(() => {
    if(walletAddress){
      fetchContributions(walletAddress);
    }
    
  }, []);


  const handleClaim = async () => {
    await requireRegistration(()=>{}); 
    try {
      setLoading(true);
      if (!walletAddress) {
        setError("Wallet address not found. Connect your wallet.");
        return;
      }
      await claim(contributions[contributionIndex].index);      
      if(isEnglish){
        setAlert("Claim made successfully!");
      }else{
        setAlert("¡Reclamación realizada con éxito!");
      }
      
      setLoading(false);
      const len = contributions.length;
      if(walletAddress) {
        await fetchContributions(walletAddress);
      }

      if(contributions.length < len){
        setContributionIndex(0)
      }
      await fetchData(); 
    } catch (error:any) {
      setLoading(false);
      if(error.reason === "AS"){
        if(isEnglish){
          error.reason = "There is no balance available to claim."
        }else{
          error.reason = "No hay saldo disponible para reclamar."
        }
        
      }
      setError(error.reason || "Error: An unknown error");
    }
  };


  async function getDays() {
    try{
      const result = await getUserV2(walletAddress!);
      if(result){
        setDayContribute(result)
      }
    }catch(erro){

    }
  }

  function handleV1() {
    setIsV2(prevValue => !prevValue)
}

  useEffect(() => {
    fetchData(); // Chamada inicial
    getDays()

    // Configura o intervalo
    const interval = setInterval(() => {
      fetchData();
      getDays()
    }, 10000); // 10 segundos

    // Limpeza ao desmontar o componente
    return () => clearInterval(interval);
  }, [walletAddress, donateWithUsdt]);
  
  const startDecrementalTimer = (timeLeft: bigint) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1n;
        setTimeUntilNumber(Number(setTimeUntilNumber)-1)
        setTimeUntil(formatTime(timeLeft));
      } else {
        clearInterval(timerRef.current!);
      }
    }, 1000);
  };

/* 
  const handleModalToggle = async () => {
    setSteps(0);
    if (isModalOpen) {
      setShow(false);
      setTimeout(() => setIsModalOpen(false), 300); 
      setLoading(false)
      await fetchData()
      getDays()
    } else {
      setIsModalOpen(true);
      setIsV2(true)
      setTimeout(() => setShow(true), 10); 
    }
  };
*/
  
  const handleClose = () => {
    setShow(false);
    setTimeout(() => setIsModalOpen(false), 300); 
  };
  const fetchData = async () => {
    getDays()
    if (walletAddress) {
      try {
        let allowanceValue;
        let allowanceValueV2;
        let balanceValue;
        if(donateWithUsdt){
          allowanceValue = await getDonationAllowanceUsdt(walletAddress);
          allowanceValueV2 = await getAllowanceUsdtV2(walletAddress)
          setAllowanceUsdtV2(allowanceValueV2)
          balanceValue = await getUsdtBalance(walletAddress);
        }else{
          allowanceValue = await getDonationAllowance(walletAddress);
          balanceValue = await getBtc24hBalance(walletAddress);
        }
        setAllowance(allowanceValue);

        setBalance(balanceValue);
  
        const timeLeft = await getTimeUntilToClaim(walletAddress, contributions[contributionIndex].index);
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilNumber(Number(timeLeft));
        startDecrementalTimer(timeLeft);
        getDays();
  
        const previewedClaim = await getBtc24hPreviewedClaim(walletAddress);
        const previewedClaimV2 = await getBtc24hPreviewedClaimV2(walletAddress);
        if (previewedClaim !== null) {
          setBalanceToClaim(previewedClaim);
          setBalanceToClaimV2(previewedClaimV2);
        }
  
        const price = await getBtc24hPrice(); 
        const priceV2 = await getBtc24hPriceV2();
        const userData = await getUser(walletAddress);
        setUser(userData);
        const nextPoolBalance = await getNextPool();
        setNextPool(nextPoolBalance);

        const totalBurned = await getTotalBurned();
        setTotalBurned(totalBurned);
        
        setBtc24hRealPrice(price)
        setBtc24hPriceV2(priceV2)
        setBtc24hPrice(BigInt(400000));

      } catch (error) {
      }
    }
  };
  
  

  useEffect(() => {
    fetchData();
    getDays()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [walletAddress]);

  useEffect(() => {
    fetchData();
    getDays()
  }, [walletAddress,donateWithUsdt]);
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const priceV2 = await getBtc24hPriceV2();
        setBtc24hPriceV2(priceV2);
        
      } catch (error) {
        console.error("Erro to get price:", error);
      }
    };

    fetchBtcPrice();

    const intervalId = setInterval(() => {
      fetchBtcPrice();
    }, 5000); // 60000ms = 1 minuto

    return () => clearInterval(intervalId);
  }, []);




  const handleDonation = async () => {
    await requireRegistration(()=>{}); 
  
      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        setError("Please enter a valid donation amount.");
        return
      }

      
      if(ethers.parseUnits(donationAmount,donateWithUsdt?6:18)> balance){
        setError("Donation amount is greather than your balance.");
        return
      }

      
      try {
        setIsProcessing(true);
        await donate(donationAmount);
        setAlert("Donation made successfully!");
        if(walletAddress)
        fetchContributions(walletAddress)
        setSteps(3);
        setIsProcessing(false);
        setLoading(false);
        setDonationAmount("");
        await fetchData();
        getDays()
        getDays();
        /*handleModalToggle();*/
      } catch (error : any) {
        
        setIsProcessing(false);
        setLoading(false);
        setError(error.reason || "Error: An unknown error");
      }
  };
  useEffect(() => {
    const fetchPriceInterval = setInterval(async () => {
      try {
        const price = await getBtc24hPrice();
        setBtc24hRealPrice(price) 
        setBtc24hPrice(BigInt(400000));
      } catch (error) {
      }
    }, 15000); 
  
    return () => clearInterval(fetchPriceInterval);
  }, []);


  const handleDonationAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationAmount(value);
  
    if (value && parseFloat(value) > 0) {
      const allowanceValue = isV2
        ? await getAllowanceUsdtV2(walletAddress!)
        : await getDonationAllowanceUsdt(walletAddress!);
  
      // Verifica se o allowance é suficiente
      if (allowanceValue >= BigInt(ethers.parseUnits(value, donateWithUsdt ? 6 : 18))) {
        setSteps(2); // Avança direto para Step 2
      } else {
        setSteps(1); // Fica no Step 1 para pedir aprovação
      }
    } else {
      setSteps(1); // Valor inválido volta para Step 1
    }
  };
  
  const handleApprove = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      if(isEnglish){
        setError("Please enter a valid donation amount.");
      }else{
        setError("Ingrese un monto de donación válido.");
      }
      
      return;
    }
  
    try {
      setIsProcessing(true);


          await approveUsdtDonation(donationAmount);
      
  
      setSteps(2); // Após aprovação, avança para Step 2
    } catch (error) {
      if(isEnglish){
        setError("Error when performing approve. Please try again.");
      }else{
        setError("Error al realizar la aprobación. Inténtalo nuevamente.");
      }
      
    } finally {
      setIsProcessing(false);
      await fetchData();
    }
  };
  
  const [isReloading, setIsReloading] = useState(false);
  async function reloadDonation() {
    setIsReloading(true); // Ativa o spinner
    try {
      if (walletAddress) {
        // Atualiza o tempo restante para reclamar
        const timeLeft = await getTimeUntilToClaim(walletAddress, contributions[contributionIndex].index);
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilNumber(Number(timeLeft));
        startDecrementalTimer(timeLeft);

        // Atualiza o saldo a ser reivindicado
        const previewedClaim = await getBtc24hPreviewedClaim(walletAddress);
        if (previewedClaim !== null) {
          setBalanceToClaim(previewedClaim);
          setIsReloading(false);  // Apenas define o estado se o valor não for `null`
        } else {
          console.warn('Saldo retornado é nulo. Ignorando atualização do estado.');
          setIsReloading(false); 
        }
      }
    } catch (error) {
      setIsReloading(false); 
      console.error('Erro ao recarregar dados:', error);
    } finally {
    }
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
      <div className=" px-6 w-full flex flex-col mt-[10px] items-center overflow-x-hidden overflow-y-hidden mb-[50px]">
        <div className="flex text-black md:flex-col w-full justify-center items-center">
        <div className=" w-[70%] md:w-full p-4 flex justify-center items-center relative text-black">
            <img
            src="./images/BannerDonation.png"
            className="w-[100%]"
            />
            <p className="absolute top-1/2 left-1/3 md:left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-black md:text-xl text-[40px] font-bold">
                Donate System
            </p>
        </div>
          <div
            className="bg-gray-500 cursor-not-allowed z-10  hover:scale-105 transition-all duration-300 relative top-4 md:top-0  rounded-[30px] sm:w-3/5 ml-4  w-[200px] py-4 mt-6 mb-[20px] font-semibold text-2xl text-center sm:m-0 flex items-center justify-center"
           /*  onClick={handleModalToggle} */
          >
            <span className="w-full h-full flex items-center justify-center">
              New<br className="sm:hidden" /> Donation
            </span>
          </div>
        </div>
       
        
        <div className="flex flex-col lg:flex-row :justify-between lg:items-center mt-4 sm:pb-10">
  {/* Primeiro Card */}
  
  












          
  {contributions.length > 0 ? (
  <div className="flex flex-col bg-gray-200 bg-opacity-10 p-10 sm:p-4  w-full max-w-[500px] justify-center items-center rounded-xl">
    <div className="flex flex-col  sm:flex-row justify-center items-center p-4">
      <img
        className="w-[150px] h-auto sm:w-[120px] md:w-[140px] lg:w-[160px] mb-4 sm:mb-0"
        src="images/claimImage.png"
        alt="banner"
      />
      <div className="ml-0 sm:ml-5 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold">
          {isEnglish? "Claim" : "Reclamar"}{" "}
          <span className="text-[#ffea00c9]">
            {isEnglish? "Rewards" : "Recompensas"} {contributions[contributionIndex]?.index ? contributions[contributionIndex]?.index : 0}
          </span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl">{isEnglish? "Donated:" : "Donado:"}</p>
        <p className="text-md sm:text-lg lg:text-xl">
          <span className="text-[#ffea00c9]">
            U$ {contributions[contributionIndex]?.amount ? contributions[contributionIndex].amount / 1000000 : 0}
          </span>
        </p>
        <p className="text-lg sm:text-xl lg:text-2xl">USDT {isEnglish? "Estimated:" : "Estimado:"}</p>
        <p className="text-md sm:text-lg lg:text-xl">
          <span className="text-[#ffea00c9]">
            U$ {contributions[contributionIndex]?.goal ? contributions[contributionIndex].goal / 1000000 : 0}
          </span>
        </p>
        <p className="text-md sm:text-lg lg:text-xl">
          {isEnglish? "Claims" : "Reclamos"}{" "}
          <span className="text-[#ffea00c9]">
            {contributions[contributionIndex]?.days ? contributions[contributionIndex]?.days : 0} / 30
          </span>
        </p>
      </div>
    </div>
    <div className="flex mt-4 w-full text-sm sm:text-lg justify-center">
    {timeUntilNumber === 0 && contributions.length > 0?(
       <button
       /*onClick={() => handleClaim()}*/
       className="text-black rounded-lg font-semibold p-2 sm:p-3 text-md sm:text-lg lg:text-xl mx-2 w-[100px] sm:w-[120px] bg-gray-500 cursor-not-allowed hover:scale-105 transition-all duration-300"
     >
       {isEnglish? "Claim" : "Reclamo"}
     </button>
    ):(
      <button
      className="text-black rounded-lg font-semibold p-2 sm:p-3 text-md sm:text-lg lg:text-xl mx-2 w-[100px] sm:w-[120px] bg-gray-500 cursor-not-allowed hover:scale-105 transition-all duration-300"
    >
      {isEnglish? "Claim" : "Reclamo"}
    </button>
    )}
     
      <p className="bg-orange-500 text-md sm:text-lg lg:text-xl rounded-lg mx-2 p-2 sm:p-3">
        {timeUntil}
      </p>
    </div>
    <div className="w-full bg-gray-600 bg-opacity-20 mt-5 p-2 flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-[#fe4a00] scrollbar-track-gray-700">
      {contributions.map((contribution, index) => (
        <div
          onClick={() => handleContributionIndex(index)}
          key={index}
          className="cursor-pointer hover:scale-105 w-[40px] h-[30px] p-2 bg-[#ffea00c9] text-center flex justify-center items-center ml-[5px]"
        >
          {contributions[index].index}
        </div>
      ))}
    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-center text-center h-[400px] border-2 border-[#00FF3D] rounded-xl p-6">
    <img
      src="/images/claimImage.png"
      alt="No Contributions"
      className="w-[150px] sm:w-[200px] h-auto mb-4"
    />
    <h2 className="text-xl sm:text-2xl font-semibold text-white">
      {isEnglish? "No Active Contributions Found" : "No se encontraron contribuciones activas"}
    </h2>
    <p className="text-sm sm:text-base text-white mt-2">
      {isEnglish? "Start contributing to claim your rewards and track your progress here." : "Comience a contribuir para reclamar sus recompensas y seguir su progreso aquí."}
    </p>
    <button
      /*onClick={handleModalToggle}*/
      className="mt-4 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white bg-[#1b9437] hover:bg-[#1b9437c0] rounded-lg shadow-md transition-all duration-300"
    >
      {isEnglish? "Start Contributing" : "Comience a contribuir"}
    </button>
  </div>
)}
          
        </div>
      </div>

      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300"
            onClick={handleClose}
          ></div>

          {/* Modal */}
          <div className="relative bg-white border-2 border-[#BannerTopo] w-[90%] p-6 rounded-xl shadow-2xl max-w-md">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-500 transition duration-200"
              onClick={handleClose}
            >
              <p className="text-lg font-bold">×</p>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#1b9437]">
                {isEnglish? "Donate in Steps" : "Donar en pasos"}
                
              </h2>
              <p className="text-gray-600 text-sm">
                {isEnglish? "Follow the steps to complete your donation" : "Sigue los pasos para completar tu donación"}
              </p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-6 gap-3">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`h-1 w-8 rounded-full ${
                      steps >= step ? "bg-[#1b9437]" : "bg-gray-300"
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      steps >= step ? "text-[#1b9437]" : "text-gray-400"
                    }`}
                  >
                   { isEnglish? "Step" : "Paso"} {step === 3 ? "Success" : step}
                  </p>
                </React.Fragment>
              ))}
            </div>

            {/* Step Content */}
            <div className="text-center">
              {steps === 0 && (
                <div>
                  <p className="text-lg text-gray-800 mb-4">
                    {isEnglish? "Select your donation currency":"Seleccione la moneda de su donación"}
                  </p>
                  <button
                    onClick={() => {
                      setDonateWithUsdt(true);
                      setSteps(1);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:border-2 border-[#1b9437]"
                  >
                    USDT
                  </button>
                </div>
              )}
              {steps > 0?(
                <>
                <p className="text-lg text-gray-800 mb-4">
                    Balance: {Number(ethers.formatUnits(balance, 6)).toFixed(2)}{" "}
                    USDT
                  </p>
                  <p className="text-lg text-gray-800 mb-4">
                    {isEnglish? "Allowance:" : "Aprobación"} {ethers.formatUnits(allowance, 6)} USDT
                  </p>
                  <p className="text-lg text-gray-800 mb-4">{isEnglish? "Approve tokens":"Aprobar tokens"}</p>
                  <p className="text-green-600 mb-4">
                    {isEnglish? "The minimum to contribute is $10" : "El mínimo para contribuir es $10"}
                  </p>
                  
                       <input
                      type="number"
                      value={donationAmount}
                      onChange={handleDonationAmountChange}
                      placeholder="Enter amount to approve"
                      className="my-4 p-2 w-full border border-[#1b9437] rounded-lg text-gray-800 bg-gray-200"
                    />
                    </>
              ):(
                ""
              )}
                  
              {steps === 1 && (
                <div>
                  
                  {isProcessing && (
                    <div className="mx-auto mb-4 w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                  )}
                  <button
                    onClick={handleApprove}
                    className="bg-[#1b9437] hover:bg-[#1b9437] transition duration-200 text-white font-semibold py-2 px-6 rounded-full shadow-md"
                    disabled={isProcessing || !donationAmount}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Approve ${donationAmount || ""} USDT`}
                  </button>
                </div>
              )}

              {steps === 2 && (
                <div>
                  <p className="text-lg text-gray-800 mb-4">
                    {isEnglish? "Confirm your donation":"Confirma tu donación"}
                  </p>
                  <button
                    onClick={handleDonation}
                    className="bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold py-2 px-6 rounded-full shadow-md"
                    disabled={isProcessing || !donationAmount}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Donate ${donationAmount} USDT`}
                  </button>
                </div>
              )}

              {steps === 3 && (
                <div>
                  <p className="text-lg text-green-500 mb-4">
                    {isEnglish?"Donation successful! Thank you!":"¡Donación realizada con éxito! ¡Gracias!"}
                  </p>
                  <svg
                    className="w-12 h-12 text-green-500 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10.293 16.293a1 1 0 011.414 0l7-7a1 1 0 00-1.414-1.414L11 14.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              {steps < 3 && "Complete all steps to finalize your donation"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
export default withAuthGuard(Donation);
