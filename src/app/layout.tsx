
import type { Metadata } from "next";
import { Montserrat } from '@next/font/google';
import { WalletProvider } from "@/services/walletContext";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { RegisterProvider } from "@/services/RegistrationContext";
import { useState } from "react";

const montserrat = Montserrat({
  subsets: ['latin'], // Inclui os caracteres necessários
  weight: ['400', '700'], // Escolha os pesos que você precisa
});

export const metadata: Metadata = {
  title: "BTC24H",
  description: "Discover the power of decentralization: an innovative DAO that distributes cryptocurrency rewards daily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
      <link rel="icon" type="image/png" href="images/logo.png" />
      </head>
      <body className="bg-black flex justify-center relative overflow-x-hidden">
        {/* Background Layer */}
        <div
        className="absolute w-full h-full z-0"
        style={{
          backgroundImage: "url('/images/bg_tecnology.png')",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backgroundSize: "cover", // Garante que a imagem cubra toda a área
          backgroundRepeat: "no-repeat", // Impede repetição da imagem
          backgroundPosition: "center center", // Centraliza a imagem
          backgroundBlendMode: "overlay",
        }}
      ></div>
        {/* Gradient on Top */}
        <div className="absolute top-0 w-full h-[100px] bg-gradient-to-b from-[#004215] via-transparent to-transparent z-0 opacity-100"></div>


        {/* Main Content */}
        <WalletProvider>
          <RegisterProvider>
          <main
            style={{ width: "1600px", zIndex: 1 }}
            className={montserrat.className}
          >
            <div className="w-full h-full flex items-center flex-col pb-[160px]">
              <button className="w-[350px] bg-orange-400 p-6 rounded-2xl mt-[50px] text-center font-bold text-black text-[30px] hover:bg-orange-500">!!! STATEMENT !!!</button>
                <div className="mt-[40px] rounded-2xl w-[60%] sm:w-[90%] flex-col text-center bg-orange-400 p-10 flex justify-center ">
                <p className="text-[50px]">
                Statement
                </p>
                <p>
                <span className="font-bold text-black text-[20px]">*Special Announcement - BTC 24H*</span><br/>

                Dear BTC 24H Ecosystem Users,<br/>

                Our revolutionary ecosystem, developed by renowned smart contract and blockchain experts, has always been strongly committed to innovation and security for our members. However, on *December 16th*, we faced an unexpected situation that required our immediate attention.<br/>

                <span className="font-bold text-black text-[20px]">*Transparency and Security*</span><br></br>

                - All contracts are open and verifiable.<br></br>
                - All liquidity POOLs are strengthened and locked eternally.<br></br>

                <span className="font-bold text-black text-[20px]">*Technical Incident*</span><br></br>

                Due to a <span className="font-bold text-black">*technical system failure*</span>, hackers managed to breach the payment wallet designed exclusively for our members. These were the only coins that would go to the market, and even then, in a staggered manner. Exploiting this vulnerability, they manipulated the payment schedule, forcing the system to release all payments at once. This allowed them to withdraw the coins and liquidate them on the market.<br></br>

                <span className="font-bold text-black text-[20px]">*Measures Taken*</span><br></br>

                In response to this challenge, we *reinforced our technical team*, bringing in high-level blockchain specialists to implement robust solutions and ensure the security of our ecosystem in the future.<br></br>

                <span className="font-bold text-black text-[20px]">*Commitment to Transparency and Trust Recovery*</span><br></br>

                As part of our commitment to transparency and to regaining the trust of all involved, BTC 24H has decided to:<br></br>
                - Grant *5 NFTs worth $100 each* to every member who trusted and purchased their share.<br></br>
                - These NFTs have the *potential to triple the initial investment* when redeemed.<br></br>

                We reaffirm our dedication to our members and ensure that, despite this incident, *the BTC 24H ecosystem is stronger, more secure, and better prepared for the future*.<br></br>

                We appreciate your understanding and trust. Together, we continue our journey of innovation and transformation.<br></br>

                <span className="font-bold text-[20px] text-black ">Sincerely,  
                *The BTC 24H Team*</span>
                </p>
              </div>

            
              {children}
              <div className="w-[100%] flex justify-center flex-row">
               
              </div>
            </div>
          </main>

          </RegisterProvider>


        </WalletProvider>

      </body>
    </html>
  );
}
