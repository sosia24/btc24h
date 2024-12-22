"use client";
import { useState, useEffect } from "react";
import Footer from "@/componentes/footer";
import { useRef } from "react";
import Countdown from "@/componentes/countdown";
import { MdVerified } from "react-icons/md";
import withAuthGuard from "@/services/authGuard";
import {
        getNftNotClaimed,
        claimNftPreSale,
        getTimeUntilNextClaim,
        approveNewNft,
        isApprovedNftPreSale,
        addQueue2,
        nftOutQueue,
}from "@/services/Web3Services";
import { useWallet } from "@/services/walletContext";
import ModalError from "@/componentes/ModalError";
import ModalSuccess from "@/componentes/ModalSuccess";

const Home = () => {
  const [timeUntil, setTimeUntil] = useState("00h:00min:00s");
  const [timeUntilNumber, setTimeUntilNumber] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [nftToClaim, setNftToClaim] = useState(0);
  const {address, setAddress} = useWallet();
  const [approved, setApproved] = useState(false);
  const [numberNftOutQueue, setNumberNftOutQueue] = useState(0)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");


  async function getNftOut(){
    try{
      if(address){
        const result = await nftOutQueue(address)
        if(result){
          setNumberNftOutQueue(result)
        }
      }
    }catch(error){

    }
  }

  async function doAddQueue(){
    setLoading(true)
    try{
      const result = await addQueue2();
      if(result){
        setAlert("Sucessful");
        setLoading(false)
        getNftOut();
      }
    }catch(error){
      setLoading(false)
      setError("Something went wrong")
    }
    setLoading(false)
  }

async function verifyApprove(){
  try{
    if(address){
      const result = await isApprovedNftPreSale(address)
      if(result){
        setApproved(result);
        getTime()
        getNftToClaim();
      }
    }
  }catch(error){

  }
}  

async function doApprove(){
  setLoading(true)
  try{
    const result = await approveNewNft();
    if(result){
      setAlert("Approve success")
      setLoading(false)
      verifyApprove();
      setApproved(true);
      getTime()
      getNftToClaim();
      verifyApprove();
    }
  }catch(error){
    setLoading(false)
    setError("Something went wrong")
  }
}

  async function getTime() {
    try{
      if(address){
        const result = await getTimeUntilNextClaim(address)
        if(result){
          setTimeUntil(formatTime(result));
          setTimeUntilNumber(Number(result));
          startDecrementalTimer(result);
        }
      }

    }catch(error){

    }
  }


  async function claimNft(){
    setLoading(true)
    try{
      const result = await claimNftPreSale();
      if(result){
        setLoading(false)
        setAlert("Claim Sucessful")
        getTime()
        getNftToClaim();
        verifyApprove();
      }
    }catch(error){
      setLoading(false)
    }
    setLoading(false)
  }

  async function getNftToClaim(){
    try{
      if(address){
        const result = await getNftNotClaimed(address)
        if(result){
          setNftToClaim(result)
        }
      }
    }catch(error){

    }
  }

  const formatTime = (timeInSeconds: number) => {
    const days = Math.floor(timeInSeconds / 86400)
    const hours = Math.floor(timeInSeconds%86400 / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${days}d:${hours}h:${minutes}min:${seconds}s`;
  };
  

  const startDecrementalTimer = (timeLeft: number) => {
    if (timerRef.current) clearInterval(timerRef.current); // Limpa o intervalo anterior
    setTimeUntilNumber(timeLeft); // Inicializa o estado com o tempo total
  
    timerRef.current = setInterval(() => {
      setTimeUntilNumber((prevTime) => {
        if (prevTime > 0) {
          const newTime = prevTime - 1;
          setTimeUntil(formatTime(newTime)); // Atualiza o tempo formatado
          return newTime; // Retorna o novo tempo para o estado
        } else {
          clearInterval(timerRef.current!); // Limpa o intervalo quando o tempo chega a 0
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() =>{
    getTime()
  }, [address])
  
  
useEffect(() =>{
  getNftToClaim();
  verifyApprove();
  getNftOut();
})

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
    <div className="min-h-screen bg-gradient-to-r animate-gradientBG bg-fixed relative">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-extrabold mb-6 text-center text-white text-shadow-md">
            Welcome to PreSale Rewards
          </h1>

          {/* Card de Venda */}
          <div className="bg-gradient-to-br flex justify-center items-center flex-col from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
            <h2 className="text-3xl font-semibold text-center text-white mb-4 tracking-wide text-shadow-md">
              Redeem your <span className="font-bold text-[#ffc908]">NFT</span>
            </h2>


            {/* Imagem do Token */}
            <div className="flex justify-center mb-4">
              <img
                src="/images/gold.png" // Substitua com a imagem do seu token
                alt="Token BTC24H"
                className="w-40 h-40 object-contain rounded-full border-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1"
              />
            </div>
            <div className="w-[100%] flex flex-col items-center justify-center text-center">
              <p className="text-[23px] flex text-center items-center justify-center"><MdVerified className="text-green-500 mr-[5px]"/>{nftToClaim.toString()}/5</p>
              {timeUntilNumber <= 0 && nftToClaim > 0?(
                 <button onClick={claimNft} className="p-4 w-[200px] rounded-xl bg-green-500 text-black font-bold mt-[10px] hover:bg-green-600 duration-300">Claim</button>
              ):(
                <button onClick={claimNft} className="p-4 w-[200px] rounded-xl cursor-not-allowed bg-gray-400 text-black font-bold mt-[10px duration-300">Claim</button>
              )}
             
              <p className="mt-[10px]">Next claim: {timeUntil}</p>
            </div>
            </div>
            <p className="mt-[20px]">You have out queue: {numberNftOutQueue.toString()}</p>
            {approved?(
               <button onClick={doAddQueue} className="w-[200px] bg-green-600 rounded-2xl mt-[30px] p-4 duration-300 hover:bg-green-700"> Add Queue </button>
            ):(
              <button onClick={doApprove} className="w-[200px] bg-yellow-600 rounded-2xl mt-[30px] p-4 duration-300 hover:bg-yellow-700"> Approve </button>
            )}
           
          </div>
        
          </div>
        </div>
        <Footer></Footer>
    </>
  );
};

export default withAuthGuard(Home);
