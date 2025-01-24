
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
            <span className="font-bold">ANNOUNCEMENT</span><br></br><br></br>

To our entire community, we want to express our deepest gratitude for your trust and continued support!<br></br>
It’s this partnership that drives us forward as we work together to achieve great milestones.<br></br><br></br>

We’re thrilled to inform you that all system adjustments have been successfully completed.<br></br>
Now, we’ll proceed to the final phase of testing.<br></br><br></br>

On Monday, January 27th, we’ll announce the official date and time for the restart of contributions within the same week.<br></br>
This updated version is packed with exciting new features!<br></br>
Through the Backoffice, you’ll have access to detailed insights into your network volume by levels, GÁS control for earning caps, and many other tools designed to enhance and streamline your experience.<br></br><br></br>

Our goal remains clear: to provide a secure, efficient, and easy-to-use platform for everyone.<br></br><br></br>
Best Regards,<br></br>



<span className="font-bold">BTC24H DAO Team 🌟</span><br></br><br></br>

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
