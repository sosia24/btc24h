"use client";

import { donate, getDonationAllowance,getUser,getBtc24hBalance,getTotalBurned,approveBTC24HDonation,getTimeUntilToClaim,getBtc24hPreviewedClaim,claim, getBtc24hPrice, getNextPool, approveUsdtDonation, getAllowanceUsdt, getDonationAllowanceUsdt, getUsdtBalance, getAllowanceUsdtV2, approveUsdtDonationV2, donateV2, getBtc24hPreviewedClaimV2, getBtc24hPriceV2, getTimeUntilToClaimV2, claimV2, getUserV2} from "@/services/Web3Services";
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

function Donation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");

  const [dayContribute, setDayContribute] = useState(0);
  const [allowanceUsdtV2, setAllowanceUsdtV2] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [timeUntil, setTimeUntil] = useState("00h:00min:00s");
  const [timeUntilV2, setTimeUntilV2] = useState("00h:00min:00s");
  const [timeUntilNumber, setTimeUntilNumber] = useState<Number>(0)
  const [timeUntilNumberV2, setTimeUntilNumberV2] = useState<Number>(0)
  const [balanceToClaim, setBalanceToClaim] = useState<bigint>(0n);
  const [balanceToClaimV2, setBalanceToClaimV2] = useState<bigint>(0n);
  const [btc24hRealPrice, setBtc24hRealPrice] = useState<bigint>(0n);
  const [btc24hPrice, setBtc24hPrice] = useState<bigint>(0n);
  const [btc24hPriceV2, setBtc24hPriceV2] = useState<bigint>(0n);
  const [nextPool, setNextPool] = useState<bigint>(0n);
  const [totalBurned, setTotalBurned] = useState<bigint>(0n);
  const [isV2, setIsV2] = useState<boolean>(false)

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

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${hours}h:${minutes}min:${seconds}s`;
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
  
  const startDecrementalTimer = (timeLeft: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
        setTimeUntilNumber(Number(setTimeUntilNumber)-1)
        setTimeUntil(formatTime(timeLeft));
      } else {
        clearInterval(timerRef.current!);
      }
    }, 1000);
  };
  const startDecrementalTimerV2 = (timeLeft: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
        setTimeUntilNumberV2(Number(setTimeUntilNumberV2)-1)
        setTimeUntilV2(formatTime(timeLeft));
      } else {
        clearInterval(timerRef.current!);
      }
    }, 1000);
  };

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
  
        const timeLeft = await getTimeUntilToClaim(walletAddress);
        const timeLeftV2 = await getTimeUntilToClaimV2(walletAddress)
        setTimeUntilV2(formatTime(timeLeftV2));
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilNumber(Number(timeLeft));
        setTimeUntilNumberV2(Number(timeLeftV2));
        startDecrementalTimer(timeLeft);
        startDecrementalTimerV2(timeLeftV2);
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




  const handleDonation = async (isUsdt:boolean) => {
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
        await donateV2(donationAmount);
        setAlert("Donation made successfully!");
        setSteps(3);
        setIsProcessing(false);
        setLoading(false);
        setDonationAmount("");
        await fetchData();
        getDays()
        getDays();
        handleModalToggle();
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
      setError("Please enter a valid donation amount.");
      return;
    }
  
    try {
      setIsProcessing(true);

      if (donateWithUsdt) {
        if(isV2){
          await approveUsdtDonationV2(donationAmount);
        }else{
          await approveUsdtDonation(donationAmount);
        }
      } else {
        await approveBTC24HDonation(donationAmount);
      }
  
      setSteps(2); // Após aprovação, avança para Step 2
    } catch (error) {
      setError("Error when performing approve. Please try again.");
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
        const timeLeft = await getTimeUntilToClaim(walletAddress);
        const timeLeftV2 = await getBtc24hPreviewedClaimV2(walletAddress)
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilV2(formatTime(timeLeftV2));
        setTimeUntilNumber(Number(timeLeft));
        setTimeUntilNumberV2(Number(timeLeftV2));
        startDecrementalTimer(timeLeft);
        startDecrementalTimerV2(timeLeftV2);

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
  
  const handleClaim = async (isRoot:boolean) => {
    await requireRegistration(()=>{}); 
    try {
      setLoading(true);
      if (!walletAddress) {
        
        setError("Wallet address not found. Connect your wallet.");
        return;
      }
      
      if(isV2){
        if (balanceToClaimV2 === 0n) {
          setLoading(false);
          setError("There is no balance available to claim.");
          
          return;
          }
          if(isRoot){
            await claimV2(true); 
          }else{
            await claimV2(false); 
          }
     
      }else{
      if (balanceToClaim === 0n) {
        setLoading(false);
        setError("There is no balance available to claim.");
        
        return;
        }
        
        await claim();         
      }
      setAlert("Claim made successfully!");
      setLoading(false);
      await fetchData(); 
    } catch (error:any) {
      setLoading(false);
      if(error.reason == "AS"){
        error.reason = "There is no balance available to claim."
      }
      setError(error.reason || "Error: An unknown error");
    }
  };

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
            className="bg-[#00FF3D] z-10 hover:bg-[#00D837] hover:scale-105 transition-all duration-300 relative top-4 md:top-0 cursor-pointer rounded-[30px] sm:w-3/5 ml-4  w-[200px] py-4 mt-6 mb-[20px] font-semibold text-2xl text-center sm:m-0 flex items-center justify-center"
            onClick={handleModalToggle}
          >
            <span className="w-full h-full flex items-center justify-center">
              New<br className="sm:hidden" /> Donation
            </span>
          </div>
        </div>
        <div className="w-[100%] mt-[20px] flex flex-row justify-center">
        {isV2?(
          <>
          <button onClick={handleV1} className="p-4 border-2 border-gray  w-[130px] rounded-xl">Claim V1</button>
          <button className="ml-[15px] p-4 w-[130px] bg-[#001eff] rounded-xl">Claim V2</button>
        </>
        ):(
          <>
          <button className="p-4 w-[130px] text-black bg-[#00FF3D] rounded-xl">Claim V1</button>
          <button onClick={handleV1} className="ml-[15px] p-4 w-[130px] border-2 border-gray rounded-xl">Claim V2</button>
          </>
        )}
        </div>
       
        
        <div className="flex flex-col lg:flex-row :justify-between lg:items-center mt-4 sm:pb-10">
  {/* Primeiro Card */}
  
  <div className="lg:w-[40%] w-[100%] flex flex-col">
  <div className="flex sm:flex-col sm:items-center sm:text-center lg:flex-row lg:items-center mb-6 sm:mb-4 w-full lg:w-[90%]">
    <img className="w-1/3 lg:w-1/2 sm:w-[40%] lg:mr-4 sm:mb-2" src="images/TotalDonation.png" alt="banner" />
    <div className="flex flex-col">
      <h3 className="text-lg sm:text-[14px] font-semibold">Your donations rewards</h3>
      <p className="font-light text-base sm:text-[14px] sm:mt-1">
        U$ {formatUsdt(user ? user.totalClaimed : 0n)}
      </p>
    </div>
  </div>
  {/* Segundo Card */}
  <div className="flex sm:flex-col sm:items-center sm:text-center lg:flex-row lg:items-center mb-6 sm:mb-4 w-full lg:w-[90%]">
    <img className="w-1/3 lg:w-1/2 sm:w-[40%] lg:mr-4 sm:mb-2" src="images/PrizePool.png" alt="banner" />
    <div className="flex flex-col">
      <h3 className="text-lg sm:text-[14px] font-semibold">Next Pool</h3>
      <p className="font-light text-base sm:text-[14px] sm:mt-1">
        {nextPool
          ? `${parseFloat(ethers.formatEther(nextPool)).toFixed(2)} BTC24H`
          : "0.00 BTC24H"}
      </p>
    </div>
  </div>
  {/* Terceiro Card */}
  <div className="flex sm:flex-col sm:items-center sm:text-center lg:flex-row lg:items-center mb-6 sm:mb-4 w-full lg:w-[90%]">
    <img className="w-1/3 lg:w-1/2 sm:w-[40%] lg:mr-4 sm:mb-2" src="images/LiquidityPool.png" alt="banner" />
    <div className="flex flex-col">
      <h3 className="text-lg sm:text-[14px] font-semibold">Total Burned</h3>
      <p className="font-light text-base sm:text-[14px] sm:mt-1">
        {totalBurned
          ? `${parseFloat(ethers.formatEther(totalBurned)).toFixed(2)} BTC24H`
          : "0.00 BTC24H"}
      </p>
    </div>
  </div>
  </div>












          
  {isV2?(
            <div className="flex flex-col sm:w-[90%] sm:items-center sm:justify-center  p-9 md:p-4 bg-[#001eff] bg-opacity-15 ml-6  rounded-xl">
            <div className="flex sm2:justify-center sm2:items-center">
              <img className="sm2:size-32" src="images/claimImage.png" alt="banner" />
              <div className="ml-5">
                <h1 className="text-4xl font-semibold">Claim <span className="text-blue-500">Rewards V2</span></h1>
                <p>USDT Estimated:</p>
                <p>U$ <span className="text-blue-500">{formatUsdt(balanceToClaimV2)}</span></p>
                <p>Bitcoin24H estimated: </p>

                <span className="text-blue-500">{btc24hPriceV2 > 0n ? (Number(balanceToClaimV2) / Number(btc24hPriceV2)).toFixed(2) : "Loading..."} Bitcoin24H</span>
                <p>Day: {Number(dayContribute)+1}</p>
                </div>
              

              </div>
            <div className="flex mt-4 w-full text-xl justify-center">
              {Number(timeUntilNumberV2) <= Number(0) && Number(balanceToClaimV2) > Number(0)?(
                <>
                    <button   onClick={() => handleClaim(false)}
                    className="text-black rounded-lg font-semibold p-2 mx-1 w-[120px] bg-[#00FF3D] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">Claim 5%</button>        
                    {Number(dayContribute)+1 % 2 === 1?(
                       <button   
                       className="text-black rounded-lg font-semibold p-2 mx-1 w-w-[70px] bg-gray-400 cursor-not-allowed hover:scale-105 transition-all duration-300">105%</button>
                      
                    ):(
                      <button   onClick={() => handleClaim(true)}
                       className="text-black rounded-lg font-semibold p-2 mx-1 w-[70px] bg-[#22d04b] hover:bg-[#00d836b1] hover:scale-105 transition-all duration-300">105%</button>        
                    )}  
                   
              </>
              ):(
                <>
                <button   
                className="text-black rounded-lg font-semibold p-2 mx-1 w-[120px] bg-gray-500 cursor-not-allowed hover:scale-105 transition-all duration-300">Claim 5%</button>
                 <button   
                className="text-black rounded-lg font-semibold p-2 mx-1 w-[70px] bg-gray-400 cursor-not-allowed hover:scale-105 transition-all duration-300">105%</button>
                </>
                 )}

                 <p className="bg-[#9B9701] rounded-lg mx-2 p-3">{timeUntilV2}</p>
               </div>
             </div>
   


















          ):(
            <div className="flex flex-col sm:w-[95%]  p-9 md:p-4 bg-[#00ff53] bg-opacity-15 ml-4 sm:ml-0 rounded-xl">
            <div className="flex sm2:justify-center sm2:items-center">
              <img className="sm2:size-32" src="images/claimImage.png" alt="banner" />
              <div className="ml-5">
                <h1 className="text-4xl font-semibold">Claim <span className="text-[#FAE201]">Rewards V1</span></h1>
                <p>USDT Estimated:</p>
                <p>U$ <span className="text-[#FAE201]">{formatUsdt(balanceToClaim)}</span></p>
                <p>BTC24H estimated: </p>
                <span className="text-[#FAE201]">{btc24hPrice > 0n ? (Number(balanceToClaim) / Number(btc24hPrice)).toFixed(2) : "Loading..."} BTC24h</span>

                <p>Donated Tokens:</p>
                <p><span className="text-[#FAE201]">{user ? Number(ethers.formatEther(user.maxUnilevel*2n)).toFixed(2): "loading"} BTC24H</span></p>

                </div>


              </div>
            <div className="flex mt-4 w-full text-xl justify-center">
              {Number(timeUntilNumber) <= Number(0) && Number(balanceToClaim) > Number(0)?(
                                      <button   onClick={()=>handleClaim(false)}
                                      className="text-black rounded-lg font-semibold p-3 mx-2 w-[120px] bg-[#00FF3D] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">Claim</button>        
              ):(
                <button   onClick={()=>handleClaim(false)}
                              className="text-black rounded-lg font-semibold p-3 mx-2 w-[120px] bg-gray-400 cursor-not-allowed hover:scale-105 transition-all duration-300">Claim</button>

              )}

              <p className="bg-[#9B9701] rounded-lg mx-2 p-3">{timeUntil}</p>
              <button
              onClick={reloadDonation}
              className={`flex items-center mt-[5px] justify-center w-10 h-10 bg-gray-500 text-white rounded-full ${
              isReloading ? 'animate-spin' : ''
              }`}
              disabled={isReloading} // Evita múltiplos cliques
              >
      <TbReload />
    </button>
            </div>
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

      <div className="relative bg-white w-[90%] p-6 rounded-xl shadow-2xl max-w-md">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition duration-200"
        onClick={handleClose}
      >
        <p className="text-lg font-bold">×</p>
      </button>

      <div className="w-[100%] flex text-black justify-center mb-[20px]">
        <p>Donate v2</p>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Donate in Steps</h2>
        <p className="text-gray-600 text-sm">
          Follow the steps to complete your donation
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div
          className={`h-1 w-8 ${
            steps >= 1 ? "bg-green-500" : "bg-gray-300"
          } rounded-full`}
        ></div>
        <p
          className={`mx-2 text-sm ${
            steps >= 1 ? "text-green-500" : "text-gray-400"
          }`}
        >
          Step 1
        </p>
        <div
          className={`h-1 w-8 ${
            steps >= 2 ? "bg-green-500" : "bg-gray-300"
          } rounded-full`}
        ></div>
        <p
          className={`mx-2 text-sm ${
            steps >= 2 ? "text-green-500" : "text-gray-400"
          }`}
        >
          Step 2
        </p>
        <div
          className={`h-1 w-8 ${
            steps === 3 ? "bg-green-500" : "bg-gray-300"
          } rounded-full`}
        ></div>
        <p
          className={`ml-2 text-sm ${
            steps === 3 ? "text-green-500" : "text-gray-400"
          }`}
        >
          Success
        </p>
      </div>

      {/* Step Content */}
      <div className="text-center">
        {steps === 0 && (
          <div>
            <p className="text-lg text-gray-800 mb-4">
              Select your donation currency
            </p>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  setDonateWithUsdt(true);
                  setSteps(1);
                }}
                className={`px-4 py-2 rounded-lg mr-4 ${
                  donateWithUsdt
                    ? "bg-gray-200 text-black hover:border-2 border-green-400"
                    : "bg-gray-200 text-gray-800 hover:border-2 border-green-400"
                }`}
              >
                USDT
              </button>
     {
      /*
     }
              <button
                onClick={() => {
                  setDonateWithUsdt(false);
                  setSteps(1);
                }}
                className={`px-4 py-2 rounded-lg ${
                  !donateWithUsdt
                    ? "bg-gray-200 text-black hover:border-2 border-green-400"
                    : "bg-gray-200 text-gray-800 hover:border-2 border-green-400"
                }`}
              >
                BTC24H
              </button>
              {
              */}
    
            </div>
          </div>
        )}

        {

          steps == 1 || steps == 2 ?            <> 
          
          <p className="text-lg text-gray-800 mb-4">
          Balance: {donateWithUsdt? Number(ethers.formatUnits(balance,6)).toFixed(2):Number(ethers.formatEther(balance)).toFixed(2)} {donateWithUsdt?"USDT":"BTC24H"}
        </p>
        <p className="text-lg text-gray-800 mb-4">
          Allowance: {donateWithUsdt? ethers.formatUnits(allowanceUsdtV2,6):ethers.formatEther(allowance)} {donateWithUsdt?"USDT":"BTC24H"}
        </p>
          
          
          <p className="text-lg text-gray-800 mb-4">
            {steps == 1 ? " Approve tokens" : "Donate tokens"}
         
        </p>
        <p className="text-[green]">The minimum to contribute is 10$</p>
        {
  !donateWithUsdt ? (
    <p 
      className={`text-lg mb-4 ${Number(ethers.formatUnits((BigInt(donationAmount) * btc24hRealPrice), 6)).toFixed(2) < String(10) ? 'text-red-500' : 'text-gray-800'}`}
    >
      {Number(ethers.formatUnits((BigInt(donationAmount) * btc24hRealPrice), 6)).toFixed(2)} U$
    </p>
  ) : ""
}
        <input
          type="number"
          value={donationAmount}
          onChange={handleDonationAmountChange} // Usa a nova função
          placeholder="Enter amount to approve"
          className="my-4 p-2 w-full border rounded-lg text-gray-800"
        /></> : <></>
        }

{steps === 1 && (
  <div>

    {isProcessing && (
      <div className="mx-auto mb-4 w-12 h-12 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
    )}
    <button
      onClick={handleApprove}
      className="bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold py-2 px-6 rounded-full shadow-md"
      disabled={isProcessing || !donationAmount}
    >
      {isProcessing ? "Processing..." : `Approve ${donationAmount || ""} ${donateWithUsdt?"USDT":"BTC24H"} `}
    </button>
  </div>
)}


{steps === 2 && (
  <div>
    <p className="text-lg text-gray-800 mb-4">Confirm your donation</p>
    <button
      onClick={() => handleDonation(donateWithUsdt)}
      className="bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold py-2 px-6 rounded-full shadow-md"
      disabled={isProcessing || !donationAmount}
    >
      {isProcessing ? "Processing..." : `Donate ${donationAmount} ${donateWithUsdt?"USDT":"BTC24H"}`}
    </button>
  </div>
)}

        {steps === 3 && (
          <div>
            <p className="text-lg text-green-500 mb-4">
              Donation successful! Thank you!
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
