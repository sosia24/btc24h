"use client";
import { useState } from "react";
import PreSaleCountdown from "../componentes/PreSaleCountdown";

const Home = () => {
  const [account, setAccount] = useState<string | null>(null);

  // Função para conectar com MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Por favor, instale o MetaMask.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-purple-900 to-indigo-800 animate-gradientBG bg-fixed relative">
      {/* Imagem de fundo sem interferir no conteúdo */}
      
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

            {/* Botão de Compra */}
            <div className="mb-4">
              <button
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => alert("Purchase in progress...")}
              >
                Buy BTC24H
              </button>
            </div>

            {/* Conectar Carteira */}
            <div className="text-center">
              {account ? (
                <div className="text-lg font-semibold text-white text-shadow-md">
                  Wallet Connected: {account.slice(0, 4) + "..." + account.slice(-6)}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
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
  );
};

export default Home;
