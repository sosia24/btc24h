"use client"
import { useEffect, useState } from "react";
import {
    totalGanhoToken, totalPerdidoToken, totalGanhoUsdt, totalPerdidoUsdt
} from "@/services/Web3Services";
import { useWallet } from "@/services/walletContext";
import { FaFire } from "react-icons/fa";


export default function datas(){

    const {address, setAddress} = useWallet()
    const [tokenLost, setTokenLost] = useState(0)
    const [tokenWin, setTokenWin] = useState(0)
    const [usdtLost, setUsdtLost] = useState(0)
    const [usdtWin, setUsdtWin] = useState(0)

     async function userUsdtLost(){
        try{
          if(address){
            const result = await totalPerdidoUsdt(address)
    
            if(result){
              setUsdtLost(result/10**6)
            }
          }
        }catch(error){
    
        }
       }
    
       async function userUsdtEarned(){
        try{
          if(address){
            const result = await totalGanhoUsdt(address)
    
            if(result){
              setUsdtWin(Number(result/10**6))
            }
          }
        }catch(error){
    
        }
       }
       async function userTokenEarned(){
        try{
          if(address){
            const result = await totalGanhoToken(address)
    
            if(result){
              setUsdtWin(Number(result) /10**18)
            }
          }
        }catch(error){
    
        }
       }
    
       async function userTokenLost(){
        try{
          if(address){
            const result = await totalPerdidoToken(address)
    
            if(result){
              setUsdtLost(result/10**18)
            }
          }
        }catch(error){
    
        }
       }

useEffect(() => {
          userTokenEarned();
          userTokenLost();
          userUsdtEarned();
          userUsdtLost();
},[])


return (
  <div className="w-full border-b-2 border-b-[#3f3f3f] flex flex-col mt-[10px] absolute z-10 mb-[20px]">
    <div className="overflow-hidden">
      <div className="py-2 animate-marquee whitespace-nowrap" aria-live="polite">
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Earned {tokenWin.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Earned {usdtWin.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Lost {tokenLost.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Lost {usdtLost.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Earned {tokenWin.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Earned {usdtWin.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Lost {tokenLost.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Lost {usdtLost.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Earned {tokenWin.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Earned {usdtWin.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Lost {tokenLost.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Lost {usdtLost.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Earned {tokenWin.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Earned {usdtWin.toFixed(2)} USDT</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total BTC24H Lost {tokenLost.toFixed(2)} BTC24H</span>
        <span className="sm:mx-2 mx-4 sm:text-[12px] text-[16px] text-green-700">Total USDT Lost {usdtLost.toFixed(2)} USDT</span>
      </div>
    </div>
  </div>
)};