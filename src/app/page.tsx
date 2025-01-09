"use client";

import { useState, useEffect, Suspense } from "react";
import { useWallet } from "@/services/walletContext";
import Image from "next/image";
import Link from "next/link";
import RegisterModal from "@/componentes/RegisterModal";
import { useSearchParams } from "next/navigation";
import { doLogin, verifyPercentage } from "@/services/Web3Services";

function HomeContent() {
  const { address, setAddress } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const searchParams = useSearchParams();
  const [socio, setSocio] = useState<boolean>(false)

  async function verifySocio(){
    try{
      if(address){
        const result = await verifyPercentage(address)
        if(result > 0 && result != undefined && result != null){
          setSocio(true)
        }
      }
    }catch(error){

    }
  }

  useEffect(() => {
    const referral = searchParams.get("ref");
    if (referral) {
      setShowRegisterModal(true); // Abre o modal automaticamente
    }
  }, [searchParams]);


  useEffect(() => {
    if (address) {
      setShowModal(true);
    }
    verifySocio();
  }, [address]);


  const handleLogin = async () => {
    try {
      const newAddress = await doLogin();
      setAddress(newAddress);
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  

  return (
    <>
    <div className="h-[80%] w-[70%] flex flex-col items-center lg:flex-row">
      <div className="w-[100%] lg:w-[50%] flex justify-center lg:order-2">
        
        <Image
          src="/images/initialCoins.png"
          alt="Coin3d"
          width={720}
          height={600}
          className="lg:ml-0 ml-[50px]"
        />
      </div>

      <div className="w-[100%] lg:mt-0 mt-[60px] lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left md:order-1">
        <p className="lg:text-[80px] md:text-[65px] text-[35px] font-bold">BTC24H</p>
        <p className="lg:text-[30px] md:text-[22px] text-[18px]">Twenty four hours every day</p>
        {address ? (
          <button className="p-2 w-[300px] bg-[#ffc908] rounded-3xl mt-[10px] text-black">
            {address.slice(0, 6) + "..." + address.slice(-4)}
          </button>
        ) : (
          <button
            className="p-2 w-[300px] bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
            onClick={handleLogin}
          >
            Connect Wallet
          </button>
        )}
        <Link
          className="p-2 w-[300px] text-center lg:mb-0 bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
          href="/home"
        >
          Enter
        </Link>
        <Link
          className="p-2 w-[300px] text-center lg:mb-0 bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
          href="/preSale"
        >
          Presale
        </Link>
        {socio?(
          <Link
          className="p-2 w-[300px] text-center lg:mb-0  border-2 border-[#08ff65] rounded-3xl mt-[10px] text-white hover:bg-[#08ff672d]"
          href="/claim"
        >
          Claim
        </Link>
        ):(
          ""
        )}
        <Link
          className="p-2 w-[300px] text-center lg:mb-0 border-2 border-[#08ff65] rounded-3xl mt-[10px] text-white hover:border-[#08ff67d3]"
          href="https://btc24h.site/whitepaper/"
        >
          WhitePaper
        </Link>
        <Link
          className="p-2 mb-[150px] w-[300px] text-center lg:mb-0 border-2 border-[#08ff65] rounded-3xl mt-[10px] text-white hover:border-[#08ff67d3]"
          href="https://btc24h.site/"
        >
          Institutional Website
        </Link>
        
        
        {showModal ? <RegisterModal /> : ""}
      </div>
    
    </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
