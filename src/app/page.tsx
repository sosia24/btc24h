"use client";
import { useState, useEffect } from "react";
import Alert from "@/componentes/alert";
import Error from "@/componentes/erro"
import PreSaleCountdown from "../componentes/PreSaleCountdown";
import { preSalePrice,
  totalSold,
  haveShare,
  approveShareUSDT,
  getAllowancePresale,
  buyShare,
  doLogin

} from "@/services/Web3Services";

const Home = () => {
  const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    const [priceShare, setPriceShare] = useState(0);
    const [totalSharesSold, setTotalSharesSold] = useState(0);
    const [userHasShare, setUserHasShare] = useState(false);
    const [usdtAllowance, setUsdtAllowance] = useState(0);

  // Função para conectar com MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        getSharePrice();
        getTotalSold();
        hasQuote();
        getAllowance();

      } catch (error) {
        console.error(error);
      }
    } else {
      
    }
  };

  const handleLogin = async () => {
    try {
      const novoEndereço = await doLogin();
      setAddress(novoEndereço);
      setAlert("Login sucess");
      setError("");
    } catch (error) {
      setError("Login Failed");
      setAlert("");
    }
  };

  async function getSharePrice() {
    try{
      const result = await preSalePrice();
      if(result){
        setPriceShare(Number(result)/1000000)
      }
    }catch(err){
        
    }
  }
  async function getTotalSold() {
    try{
      const result = await totalSold();
      if(result){
        setTotalSharesSold(Number(result))
      }
    }catch(err){
        
    }
  }

  async function getAllowance() {
    try{
      if(address){
        const result = await getAllowancePresale(address);
        if(result){
          setUsdtAllowance(result);
        }
      }
    }catch(err){
        
    }
  }

  async function buyQuota() {
    setLoading(true);
    setError(""); // Limpa qualquer erro anterior
    setAlert(""); // Limpa qualquer alerta anterior

    try {
        if (address) {
            const result = await buyShare();
            setLoading(false); // Finaliza o estado de carregamento
            
            if (result) {
                setAlert("Quota purchased successfully");
            } else {
                setError("Failed to purchase quota"); // Define uma mensagem de erro se `buyShare` retornar `false`
            }
        } else {
            setLoading(false);
            setError("Connect You Wallet");
        }
    } catch (err) {
        setLoading(false);
        setError("Something went wrong");
    }
}

  async function approveUsdt(){
    setLoading(true);
    try{
      if(address){
        await approveShareUSDT(priceShare * (10**6))
        getAllowance();
        setLoading(false)
      }else{
        setLoading(false)
        setError("Connect Your Wallet")
      }
    }catch(err){
      setLoading(false)
      setError(`Algum erro ${address} value ${priceShare*(10**6)}`)
    }
    setLoading(false)
  }

async function hasQuote() {
      try{
        if(address){
          const result = await haveShare(address);
          if(result){
            setUserHasShare(true);
          }
        }
      }catch(err){
          
      }
    }

    const clearError = () => {
      setError("");
    };
    const clearAlert = () => {
      setAlert("");
    };
  

  useEffect(() => {
    getSharePrice();
    getTotalSold();
    hasQuote();
    getAllowance();
  })

  useEffect(() => {
    getSharePrice();
    getTotalSold();
    hasQuote();
    getAllowance();
  }, [address])

  return (
    <>
    {error && <Error msg={error} onClose={clearError} />}
    {alert && <Alert msg={alert} onClose={clearAlert} />}
    {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-10 h-10 border-t-4 border-b-4 border-[#0d56df] rounded-full animate-spin"></div>
      </div>
    )}
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-900 to-indigo-800 animate-gradientBG bg-fixed relative">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-extrabold mb-6 text-center text-white text-shadow-md">
            Welcome to BTC24H
          </h1>
          <p className="text-2xl mb-8 text-center text-white text-shadow-md">
            Get the BTC24H token before it's too late!
          </p>

          <PreSaleCountdown />

          {/* Card de Venda */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
            <h2 className="text-3xl font-semibold text-center text-white mb-4 tracking-wide text-shadow-md">
              PreSale has ended!
            </h2>

            {/* Imagem do Token */}
            <div className="flex justify-center mb-4">
              <img
                src="/images/BTC24h.png" // Substitua com a imagem do seu token
                alt="Token BTC24H"
                className="w-40 h-40 object-contain rounded-full border-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1"
              />
            </div>

            <div className="mt-[15px] w-[100%] flex flex-col items-center justify-center text-white">
            <p className="md:text-[24px] font-semibold text-[20px]">Results PreSale</p>
            <p className="mt-[10px] text-[18px] sm:text-[24px] text-center font-semibold"></p>
            <p className="mt-[10px] text-[16px] sm:text-[20px] text-center font-semibold">Shares Sold: 73</p>
            <p className="m-[10px]">Each share receive: <span className="text-orange-500">1506.85 BTC24h</span></p>
            
          </div>

            {/* Botão de Compra */}


            {/* Conectar Carteira */}
        
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
