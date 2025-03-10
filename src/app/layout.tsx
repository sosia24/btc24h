
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

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
              
            <div className="w-[80%] rounded-3xl bg-white text-black mt-[100px] p-6 text-[16px]">
           <span className="font-bold"> 🚀 Exciting Week of Innovation and Growth in Our Community! 🌍💎</span><br></br><br></br>

The time has come! 🎉 This week, we're making a major leap forward with system activation and key upgrades that will empower our community and unlock more opportunities for everyone.<br></br><br></br>

<span className="font-bold">🔹 What’s coming:</span><br></br>
✅ Launch of Contributions and Receivings with Bitcoin24h.<br></br>
✅ Pending claims can finally be processed.<br></br>
✅ GAS will now be paid with Bitcoin24h, increasing efficiency.<br></br>
✅ Network GAS balances will be converted into Bitcoin24h, making them easier to use.<br></br>
✅ Matching Bonus to boost community benefits.<br></br><br></br>

To implement these changes, we need to restart the entire system with a new smart contract, bringing more security, stability, and sustainable growth. 🚀<br></br><br></br>

This is a key step in our evolution, and together, we continue building a stronger and more prosperous ecosystem. 🌱💰<br></br><br></br>

📢 Stay tuned for updates and get ready for what’s coming. The new era begins now! 🔥<br></br><br></br>

Best Regards,<br></br>
<span className="font-bold">DAOBTC24H TEAM</span><br></br>
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
