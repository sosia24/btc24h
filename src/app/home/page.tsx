'use client' // Adicione esta linha no topo do arquivo para indicar que é um Client Component

import { useState, useEffect } from "react";
import { useWallet } from "@/services/walletContext";
import Image from "next/image";
import { formatUsdt } from "@/services/utils";
import withAuthGuard from "@/services/authGuard";
import Footer from "@/componentes/footer";
import Link from "next/link";
import { PiTriangleFill } from "react-icons/pi";
import { FaCopy, FaCheck } from "react-icons/fa";
import { userUnilevelTotalDonated, getTreeUsers ,getBtc24hPrice  } from "@/services/Web3Services"; // Import getUser
import RegisterModal from "@/componentes/RegisterModal";

function Page1() {
  const [treeData, setTreeData] = useState<number[]>([]);
  const [validAddresses, setValidAddresses] = useState<string[]>([]); // Store valid addresses
  const [copied, setCopied] = useState(false);
  const [coinCotation, setCoinCotation] = useState<number | null>(null);
  const { address, setAddress } = useWallet();
  const [treeUsers, setTreeUsers] = useState<string[]>([]);

  
  useEffect(() => {
    async function fetchTreeData() {
      if (address) {
        try {
          const data = await userUnilevelTotalDonated(address);
          setTreeData(data);
        } catch (error) {
          console.error("Error fetching tree data", error);
        }
      }
      getCotation()
    }

    fetchTreeData();
  }, [address]);
  

  async function fetchTreeUsers(address: string) {
    try {
      const result = await getTreeUsers(address);

  
      // Supondo que os endereços estejam na segunda posição (índice 1), acesse os valores corretamente
      const addresses = result;  // Ajuste isso conforme a estrutura correta de 'result'

  
      // Filtre endereços válidos, verificando se são do tipo string e não nulos
      const filteredAddresses = addresses.filter(
        (addr: unknown): addr is string => typeof addr === "string" && addr !== "0x0000000000000000000000000000000000000000"
      );
  

  
      // Atualize o estado ou faça o que for necessário com os endereços filtrados
      setTreeUsers(filteredAddresses); // Use os endereços filtrados no estado
    } catch (error) {
      console.error("Error fetching tree users:", error);
    }
  }
  

  useEffect(() => {
    if (address) {
      fetchTreeUsers(address);
    }
  }, [address]);

  async function getCotation() {
    try {

        const result = await getBtc24hPrice();
        if (result) {
          setCoinCotation(Number(result) / Number(1000000));
        }else{
          const again = await getBtc24hPrice();
            if(again){
              setCoinCotation(Number(again) / Number(1000000));
            }
        }
    } catch (error) {
      console.error("Failed to fetch coin price", error);
    }
  }

  useEffect(() => {
    getCotation();
    
    // Set up the interval
    const interval = setInterval(() => {
      getCotation();
    }, 10000); // 10 seconds
  
    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once
  


  useEffect(() => {
    async function fetchTreeData() {
      if (address) {
        try {
          const data = await userUnilevelTotalDonated(address);
          setTreeData(data);
        } catch (error) {
          console.error("Error fetching tree data", error);
        }
      }
      getCotation();
    }

    fetchTreeData();
  }, [address]);

  const handleCopyReferral = async () => {
    try {
      if (address) {
        const referralLink = `${window.location.origin}?ref=${address}`;
        await navigator.clipboard.writeText(referralLink); // Copia o link para a área de transferência
        setCopied(true);
  
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy referral link", err);
    }
  };

  return (
    <>
      <div className="p-4 w-full lg:h-screen flex justify-center items-center overflow-hidden">
        <div className="lg:w-[90%] p-4 w-[98%] h-[100%] flex flex-col mt-[40px]">
          <div className="p-4 px-2 w-full flex flex-col mt-[10px] items-center overflow-x-hidden overflow-y-hidden mb-[30px]">
            <div className="flex text-black md:flex-col w-full justify-center items-center">
              <div className=" w-[70%] md:w-full p-4 flex justify-center items-center relative text-black">
                <img
                  src="./images/BannerTopo.png"
                  className="w-[100%] h-[120px]"
                />
                <img
                  src="./images/initialCoins.png"
                  className="absolute w-[35%] left-[60%]"
                />
                <p className="absolute text-center text-black font-semibold text-3xl sm:text-[20px] top-[55%] left-[40%] transform -translate-x-1/2 -translate-y-1/2">
                  Donate System
                </p>
              </div>
            </div>
          </div>

          <div className="w-[100%] lg:h-[380px] h-[800px] mt-[50px] flex lg:flex-row flex-col justify-between">
            <div className="lg:w-[45%] w-[100%] h-[100%] border-2 border-[#08ff65] rounded-2xl p-4 flex flex-col items-center">
              <div className="w-100% flex flex-row justify-center items-center mt-[15px]">
                <Image
                  src={"/images/logo.png"}
                  alt="logo"
                  width={35}
                  height={35}
                />
                <p className="ml-[5px] font-bold text-[22px]">BTC24H/USDT</p>
              </div>
              <p className="text-[20px]">
                {coinCotation
                  ? coinCotation.toFixed(2).toLocaleString()
                  : "...loading"}
                $
              </p>
              <div className="h-[100%] flex items-end justify-end">
                <Link
                  href="/donation"
                  className="w-[200px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300 bg-[#08ff65] flex justify-center items-center text-black font-bold text-center rounded-3xl p-2"
                >
                  <PiTriangleFill className="mr-2 rotate-90" />
                  Contribute Now
                </Link>
              </div>
            </div>

            <div className="lg:w-[55%] ml-[20px] w-full h-full flex flex-col justify-center items-center">
  <div className="lg:mt-0 mt-5 bg-green-800 w-full bg-opacity-30 rounded-2xl flex flex-col items-center">
    <button className="bg-[#126334] rounded-3xl w-[150px] h-[40px] p-2 mt-[-10px] font-semibold text-[18px]">
      Team
    </button>
    <div className="w-[90%] h-[40px] bg-[#126334] mt-4 rounded-md flex justify-between items-center px-4">
      <p>Address</p>
    </div>
    <div className="w-full max-w-[96%] rounded-md mt-4 h-[210px] overflow-y-auto overflow-x-auto">
      {/* Cabeçalho */}
      <div className="flex bg-[#126334] text-white font-semibold">
        <div className="w-[10%] px-4 py-2 text-center">#</div>
        <div className="w-[60%] px-4 py-2">Address</div>
        <div className="w-[30%] px-4 py-2 text-right">Total Donated</div>
      </div>

      {/* Linhas de dados */}
      {treeData.map((item: any, index) => (
        <div key={index} className="flex border-b items-center">
          <div className="w-[10%] px-4 py-2 text-center">{validAddresses.length + index + 1}</div>
          <div className="w-[60%] px-4 py-2 flex justify-between items-center">
            <span>{treeUsers[index]?.slice(0, 6)}...{treeUsers[index]?.slice(-4)}</span>
          </div>
          <div className="w-[30%] sm:w-[40%] px-4 py-2 text-right">U$ {formatUsdt(item)}</div>
        </div>
      ))}
    </div>
  </div>



              <button
                onClick={handleCopyReferral}
                className="font-bold hover:bg-[#00D837] hover:scale-105 transition-all duration-300 text-[20px] p-2 w-[200px] flex justify-center items-center text-black rounded-3xl bg-[#08ff65] mt-[20px]"
              >
                {copied ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
                {copied ? "Copied!" : "Referral"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <RegisterModal></RegisterModal>
      <Footer />
    </>
  );
}

export default withAuthGuard(Page1);
