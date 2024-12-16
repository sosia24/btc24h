"use client";

import { donate, getDonationAllowance,getUser,getBtc24hBalance,getTotalBurned,approveBTC24HDonation,getTimeUntilToClaim,getBtc24hPreviewedClaim,claim, getBtc24hPrice, getNextPool, approveUsdtDonation, getAllowanceUsdt, getDonationAllowanceUsdt, getUsdtBalance } from "@/services/Web3Services";
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
import ModalSuccess from "@/componentes/ModalSuccess";

function Donation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [timeUntil, setTimeUntil] = useState("00h:00min:00s");
  const [timeUntilNumber, setTimeUntilNumber] = useState<Number>(0)
  const [balanceToClaim, setBalanceToClaim] = useState<bigint>(0n);
  const [btc24hPrice, setBtc24hPrice] = useState<bigint>(0n);
  const [nextPool, setNextPool] = useState<bigint>(0n);
  const [totalBurned, setTotalBurned] = useState<bigint>(0n);
  const { requireRegistration } = useRegistered();
  const [show, setShow] = useState(false);

  const [user, setUser] = useState<UserDonation| null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [donateWithUsdt, setDonateWithUsdt] = useState(false);


  const walletAddress = useWallet().address;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${hours}h:${minutes}min:${seconds}s`;
  };
  
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

  const handleModalToggle = async () => {
    if (isModalOpen) {
      setShow(false);
      setTimeout(() => setIsModalOpen(false), 300); 
      setLoading(false)
      await fetchData()
    } else {
      setIsModalOpen(true);
      setTimeout(() => setShow(true), 10); 
    }
  };
  
  const handleClose = () => {
    setShow(false);
    setTimeout(() => setIsModalOpen(false), 300); 
  };
  const fetchData = async () => {
    if (walletAddress) {
      try {
        let allowanceValue;
        let balanceValue;
        if(donateWithUsdt){
          allowanceValue = await getDonationAllowanceUsdt(walletAddress);
          balanceValue = await getUsdtBalance(walletAddress);
        }else{
          allowanceValue = await getDonationAllowance(walletAddress);
          balanceValue = await getBtc24hBalance(walletAddress);
        }
        setAllowance(allowanceValue);
        setBalance(balanceValue);
  
        const timeLeft = await getTimeUntilToClaim(walletAddress);
        setTimeUntil(formatTime(timeLeft));
        setTimeUntilNumber(Number(timeLeft));
        startDecrementalTimer(timeLeft);
  
        const previewedClaim = await getBtc24hPreviewedClaim(walletAddress);
        setBalanceToClaim(previewedClaim);
  
        const price = await getBtc24hPrice(); 
        const userData = await getUser(walletAddress);
        setUser(userData);
        const nextPoolBalance = await getNextPool();
        setNextPool(nextPoolBalance);

        const totalBurned = await getTotalBurned();
        setTotalBurned(totalBurned);
        
        setBtc24hPrice(price);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    }
  };
  

  useEffect(() => {
    fetchData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [walletAddress]);

  useEffect(() => {
    fetchData();
  }, [walletAddress,donateWithUsdt]);



  const handleDonation = async (isUsdt:boolean) => {
    await requireRegistration(()=>{}); 
  
      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        setError("Please enter a valid donation amount.");
      }

      try {
        setLoading(true);
        await donate(donationAmount, isUsdt);
        setAlert("Donation made successfully!");
        setLoading(false);
        setDonationAmount("");
        await fetchData();
        handleModalToggle();
      } catch (error) {
        setLoading(false);
        setError("Error: You need to Claim your last donate");
      }
  };
  useEffect(() => {
    const fetchPriceInterval = setInterval(async () => {
      try {
        const price = await getBtc24hPrice();
        setBtc24hPrice(price);
      } catch (error) {
        console.error("Erro loading price", error);
      }
    }, 15000); 
  
    return () => clearInterval(fetchPriceInterval);
  }, []);
  const handleApprove = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    setLoading(true);

    if (donateWithUsdt) {
      try {
        await approveUsdtDonation(donationAmount);

      } catch (error) {
        setLoading(false);
        setError("Error when performing approve. Please try again.");
      }

    }else{
      try {
        await approveBTC24HDonation(donationAmount);

      } catch (error) {
        setLoading(false);
        setError("Error when performing approve. Please try again.");
      }
    }
    await fetchData()
    setLoading(false);

  };
  
  const handleClaim = async () => {
    await requireRegistration(()=>{}); 
    try {
      setLoading(true);
      if (!walletAddress) {
        
        setError("Wallet address not found. Connect your wallet.");
        return;
      }
  
      if (balanceToClaim === 0n) {
        setLoading(false);
        setError("There is no balance available to claim.");
        
        return;
      }
  
      await claim();
      setAlert("Claim made successfully!");
      setLoading(false);
      await fetchData(); 
    } catch (error) {
      console.error("Erro ao realizar o claim:", error);
      setLoading(false);
      setError("Error when making the claim. Try again.");
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


          <div className="flex flex-col p-9 md:p-4 bg-[#00ff53] bg-opacity-15 ml-4 sm:ml-0 rounded-xl">
            <div className="flex sm2:justify-center sm2:items-center">
              <img className="sm2:size-32" src="images/claimImage.png" alt="banner" />
              <div className="ml-5">
                <h1 className="text-4xl font-semibold">Claim <span className="text-[#FAE201]">Rewards</span></h1>
                <p>USDT Donated:</p>
                <div className="flex items-center">
                <div>

                </div>
                <div>
                <p>U$ <span className="text-[#FAE201]">{formatUsdt(balanceToClaim)}</span></p>
                <p>BTC24H estimated: <span className="text-[#FAE201]">{btc24hPrice > 0n ? (Number(balanceToClaim) / Number(btc24hPrice)).toFixed(2) : "Loading..."} BTC24h</span></p>

                </div>
                </div>


              </div>
            </div>
            <div className="flex mt-4 w-full text-xl justify-center">
              {Number(timeUntilNumber) <= Number(0) && Number(balanceToClaim) > Number(0)?(
                                      <button   onClick={handleClaim}
                                      className="text-black rounded-lg font-semibold p-3 mx-2 w-[120px] bg-[#00FF3D] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">Claim</button>        
              ):(
                <button   onClick={handleClaim}
                              className="text-black rounded-lg font-semibold p-3 mx-2 w-[120px] bg-gray-400 cursor-not-allowed hover:scale-105 transition-all duration-300">Claim</button>

              )}

              <p className="bg-[#9B9701] rounded-lg mx-2 p-3">{timeUntil}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {isModalOpen && (
        <div
  className={`fixed inset-0 z-40 flex items-center text-[#474b4b] justify-center transition-opacity duration-200 ${
    show ? "opacity-100" : "opacity-0"
  }`}
>
  {/* Overlay */}
  <div
    className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200 ${
      show ? "opacity-100" : "opacity-0"
    }`}
  ></div>

  {/* Modal */}
  <div
    className={`bg-white w-[90%] p-8 rounded-lg shadow-lg max-w-md relative transform transition-transform duration-300 delay-100 ${
      show ? "scale-100" : "scale-90"
    }`}
  >
    <img
      src="/images/newDonationBanner.png"
      alt="new donation banner"
      className="w-[105%] max-w-[10000%] absolute -left-4 -top-10"
    />
    <p className="my-4">
      When you contribute, your tokens will be locked for 24 hours.
    </p>
    <p className="mb-4">
    Balance:{" "}
    {donateWithUsdt
    ? (Number(balance) / 10 ** 6).toFixed(2)
    : parseFloat(ethers.formatEther(balance)).toFixed(2)}{" "}
    {donateWithUsdt ? "USDT" : "BTC24h"}
    </p>
    <p className="mb-4">
      Allowance: {donateWithUsdt?Number(allowance)/10**6: ethers.formatEther(allowance)} {donateWithUsdt ? "USDT" :"BTC24h"}
    </p>
    <p className="mb-2">
      The minimum allowed contribution is $10
    </p>
    <input
      type="number"
      className="text-[#9e9e9e] bg-[#ECEDED] border p-4 rounded-2xl focus:outline-0 mb-4 w-full focus:ring-2 focus:ring-[#00FF3D] transition-all duration-300"
      placeholder="Insert donation value"
      value={donationAmount}
      onChange={(e) => setDonationAmount(e.target.value)}
    />
      <div className="flex items-center mb-4">
    <label className="text-sm font-medium mr-2">
      Donate with USDT
    </label>
    <input
      type="checkbox"
      className="w-5 h-5 text-[#00FF3D] focus:ring-[#00FF3D] rounded"
      checked={donateWithUsdt}
      onChange={(e) => setDonateWithUsdt(e.target.checked)}
    />
  </div>
    <div className="flex justify-center w-full mt-5">
      
      {(donateWithUsdt?Number(donationAmount)/10**6:ethers.parseUnits(donationAmount || "0", "ether")) <= allowance ? (
        <button
          className="bg-[#00FF3D] px-4 py-2 rounded-lg text-black font-semibold mr-4 hover:bg-[#00D837] hover:scale-105 transition-all duration-300"
          onClick={() => handleDonation(donateWithUsdt)}
        >
          Donate
        </button>
      ) : (
        <button
          className="bg-[#00FF3D] px-4 py-2 rounded-lg text-black font-semibold mr-4 hover:bg-[#00D837] hover:scale-105 transition-all duration-300"
          onClick={handleApprove}
        >
          Approve
        </button>
      )}
      <button
        className="bg-[#FF0001] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#D90001] hover:scale-105 transition-all duration-300"
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  </div>
</div>

      )}


    </>
  );
}

export default withAuthGuard(Donation);
