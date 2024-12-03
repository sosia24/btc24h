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
      setAlert("Login bem-sucedido!");
      setError("");
    } catch (error) {
      setError("Falha ao fazer login. Por favor, tente novamente.");
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
            Welcome to BTC24H Pre-Sale
          </h1>
          <p className="text-2xl mb-8 text-center text-white text-shadow-md">
            Get the BTC24H token before it's too late!
          </p>

          <PreSaleCountdown />

          {/* Card de Venda */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
            <h2 className="text-3xl font-semibold text-center text-white mb-4 tracking-wide text-shadow-md">
              Buy BTC24H Token 
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
            <p className="text-[20px] font-semibold">Quota Price</p>
            <p className="mt-[10px] text-[18px] sm:text-[24px] text-center font-semibold">
              {priceShare? priceShare : "..."}$
            </p>
            
            {/* New Section: Moedas Recebidas por Cota */}
            <div className="mt-[20px] max-w-[98%] flex items-center justify-center bg-gradient-to-r from-[#ffb74d] to-[#ff7f50] py-[4px] px-[30px] rounded-xl flex-col">
              <p className="text-gray-200  text-[12px] sm:text-[16px]">
               Each quota receives 
              </p>
              <span className="flex flex-col text-white font-semibold text-[18px]">{Number(7000000/totalSharesSold).toFixed(2)}</span>
              <p>BTC24H</p>
            </div>
            <p className="text-gray-200 flex flex-col text-[12px] mt-[5px]">100 000 / {totalSharesSold}</p>
          </div>

            {/* Botão de Compra */}

            {userHasShare?(
            <p className="mt-[12px] sm:text-[18px] text-center text-[14px] justify-center m-auto items-center">Congratulations, your quota is now guaranteed.</p>
          ):(
            <>
            {usdtAllowance >= priceShare?(
               <button
               onClick={buyQuota}
               className="w-full mb-[8px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:shadow-lg"
               >
               Buy Cota
                </button>
            ):(
              <>
              <button
              onClick={approveUsdt}
              className="w-full mb-[8px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:shadow-lg"
              >
              Approve USDT
              </button>
              <button
                className="w-full mb-[8px] bg-gray-500 cursor-not-allowed text-white font-bold py-2 px-4 rounded-md shadow-md"
                >
              Buy Cota
              </button>
              </>
            )}
            </>
          )}

            {/* Conectar Carteira */}
            <div className="text-center">
              {address ? (
                <div className="text-lg font-semibold text-white text-shadow-md">
                  Wallet Connected: {address.slice(0, 4) + "..." + address.slice(-6)}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-lg font-bold py-2 px-4 rounded-md transition duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
