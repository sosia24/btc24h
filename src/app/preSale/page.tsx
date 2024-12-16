"use client";
import { useState, useEffect } from "react";
import Footer from "@/componentes/footer";
const Home = () => {

  return (
    <>
    <div className="min-h-screen bg-gradient-to-r animate-gradientBG bg-fixed relative">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-extrabold mb-6 text-center text-white text-shadow-md">
            Welcome to BTC24H
          </h1>
          <p className="text-2xl mb-8 text-center text-white text-shadow-md">
            Get the BTC24H token before it's too late!
          </p>

          {/* Card de Venda */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 max-w-md w-full">
            <h2 className="text-3xl font-semibold text-center text-white mb-4 tracking-wide text-shadow-md">
              PreSale has ended!
            </h2>

            {/* Imagem do Token */}
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo.png" // Substitua com a imagem do seu token
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
