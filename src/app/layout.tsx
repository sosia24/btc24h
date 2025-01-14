
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
            Attention, BTC24H community members! <br></br>

We have some incredible news to share with you.<br></br>

The Gold, Silver, Bronze, and WBTC NFTs continue to operate flawlessly. Whenever the "Distribute" button is green, anyone can click it, pay the transaction fee, and automatically distribute rewards to the 10 wallets in the queue. Take advantage of this feature to maximize your benefits!<br></br>

And now, the big news: we've launched the Liquidity NFT! With it, you can use your BTC24H or Bitcoin24H coins to participate in this unique opportunity.<br></br>

How does the Liquidity NFT work? <br></br>

The NFT is priced at $75.<br></br>

You will receive a guaranteed reward of $100 in USDT.<br></br>

There is a transaction fee of $5, so at the end of the cycle, you will receive $95.<br></br><br></br>
Sincerely,<br></br>

<span className="font-bold">The BTC24H DAO Team</span><br></br>

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
