
import type { Metadata } from "next";
import { Montserrat } from '@next/font/google';
import { WalletProvider } from "@/services/walletContext";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { RegisterProvider } from "@/services/RegistrationContext";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react"

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
            
                <Analytics></Analytics>
            <div className="w-full h-full flex items-center flex-col pb-[160px]">
            <div className="md:w-[90%] w-[60%] flex flex-col mt-[50px] bg-white bg-opacity-50 rounded-3xl text-black text-[20px] p-6 mb-[60px]">
                  <span className="font-bold">🚨 Important Announcement 🚨</span><br></br>
            
                  Dear BTC24H Presale Participant,<br></br>
            
                  📢 Exciting news! This Sunday, December 22nd, at 12:00 AM UTC, marks an important milestone—7 days since the start of contributions!<br></br>
            
                <br></br>
                  To claim your exclusive NFT, simply follow these easy steps:<br></br>
                  1️⃣ Connect the wallet you used during the presale.<br></br>
                  2️⃣ Follow the instructions provided to complete the process.<br></br>
            
                  <br></br>
                  ✨ Don’t miss this chance to secure your NFT and be part of the BTC24H journey!<br></br><br></br>
            
                  Warm regards,<br></br>
                  <span className="font-bold">The BTC24H Team</span>
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
