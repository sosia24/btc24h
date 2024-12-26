
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
              <div className="w-[80%] rounded-3xl bg-white bg-opacity-10 mt-[100px] p-6 text-[16px]">
              Due to the extraordinary growth of our community, and to ensure even more efficient and sustainable system operations, we are pleased to announce that, starting today, December 26, 2024, all contributions made in USDT will have 20% allocated to distribution across 40 levels, paid directly in USDT, with no earnings limit.<br></br>
              For contributions made in BTC24H, a distribution of 5% across 40 levels will be applied. This strategy has been carefully designed to protect the value of the currency, promote its scarcity, and ensure the continuous sustainability of the ecosystem.<br></br>
              All changes to the unilevel distribution have been planned with a single goal in mind: to ensure the system’s stability and longevity, allowing every member to continue benefiting in a stable and profitable way.<br></br>
              We take this opportunity to congratulate the entire community on the exceptional work accomplished so far. We wish everyone an excellent 2025, filled with achievements and success.<br></br> Together, we will continue building an even more promising future!<br></br>
              <br></br>

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
