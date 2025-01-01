
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
              <div className="w-[80%] rounded-3xl bg-white text-black mt-[100px] p-6 text-[16px]">
              📢 Official Announcement BTC24H<br></br>
              
              Dear BTC24H Community Members
              <br></br>

We are on the verge of a revolutionary milestone that will place our currency in the global spotlight in 2025! With the strength and commitment of each of you, we are launching a strategic market coin-buying operation, using exclusively USDT contributions. This movement will significantly reduce the circulation of coins, increasing their value and solidifying the BTC24H economy.
<br></br>

Why is this operation so special?
<br></br>

🚀Market Strengthening: By reducing the supply of available coins, we ensure a sustainable increase in value.
Connection with Innovation: We are introducing a groundbreaking opportunity with the NFT WBTC, a pioneering system that combines technology with direct benefits for all participants.
Operation Details:
<br></br>

💰NFT WBTC - Our Key Feature: An innovative automatic liquidity creator. By purchasing an NFT WBTC, 50% of the invested value will be automatically allocated to creating a WBTC/BTC24H liquidity pool.
Price and Returns:
Each NFT WBTC costs just $250.
Returns are distributed strategically:
20% to a multi-level marketing system spanning 40 levels.
30% to NFTs in special categories (Bronze, Silver, and Gold).
50% allocated to liquidity creation.
Exclusive Benefits:
<br></br>

💡NFTs will be purchased entirely in USDT, and returns will be 100% in WBTC.
The queue-based payment system ensures efficiency: five users ahead and five behind will be paid simultaneously.
Exciting Updates:
<br></br>

📊Starting today, we will reduce the contribution burn rate from 15% to 5% as a way to honor everyone’s daily efforts. The remaining 10% will be allocated as a direct referral commission.
A 48-hour window will open for all members to claim at a rate of $0.40 per coin unit.
After this period, all contributions will be 100% in USDT, with payouts made in BTC24H based on the market rate.
Together, we will shape the future!
This is just the first step of a transformative journey. 2025 will be the year BTC24H establishes itself as a global reference, thanks to the unity and tireless work of our community. Get ready for an unprecedented movement that will mark our history!
<br></br>

🙌Let’s move forward, BTC24H! The future is in our hands.
<br></br>

With enthusiasm and dedication,

<br></br>

              <span className="font-bold">DAO BTC24H Team</span>
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
