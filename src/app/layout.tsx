
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

🚀 We are about to embark on a historic operation that will elevate our currency to new heights in 2025! With the unity and strength of our community, we will conduct a major coin purchase operation in the market, using contributions exclusively in USDT. This strategic move will reduce the number of coins in circulation, increasing their value and strengthening our economy.

<br></br>

💰 Operation Details:
<br></br>


 NFT WBTC: Our innovative automatic liquidity creator. By purchasing an NFT WBTC, 50% of the purchase value will be automatically allocated to the creation of a WBTC/BTC24H liquidity pool.
 <br></br>

Price and Distribution: Each unit of NFT WBTC costs $250. The distribution of earnings will be as follows:
<br></br>

 20% in a multi-level marketing system distributed over 40 levels.
 <br></br>

 30% for NFTs of different categories (Bronze, Silver, and Gold).
 <br></br>

 50% for the creation of the WBTC/BTC24H liquidity pool.

<br></br>

📊 Liquidity and Earnings:
<br></br>

 NFTs will be sold 100% in USDT.
 <br></br>

 NFT earnings will be 100% in WBTC.
 <br></br>

 Users who purchase NFTs will be paid in a queue system, with payments to five in front and five behind.

<br></br>

💡 New Updates:
<br></br>

 Starting today, to honor all the people who work daily for the growth of our community, we will reduce the burn from the act of contribution from 15% to 5%.
 <br></br>

 The remaining 10% will be allocated to a direct referral commission on contributions.
 <br></br>

 With these adjustments, everyone will have a 48-hour period to make their claims of $0.40 per unit of currency.
 <br></br>

 After this period, contributions will be 100% in USDT and payments will be made in BTC24H based on the market rate.
 <br></br>


🚀 We are just at the beginning of an incredible journey. 2025 will be the year when our united and strong community shows the world the true power of BTC24H. Get ready for an unprecedented market movement!
<br></br>


🙌 Together, BTC24H community! The future is ours!
<br></br>


Sincerely,

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
