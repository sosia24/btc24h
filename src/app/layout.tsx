
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

              Since the beginning of our journey, we have faced significant challenges, including an unexpected coin dump in the market.<br></br>

              This obstacle has motivated us to seek innovative solutions to protect our economy and ensure the longevity of a project that impacts so many lives daily.<br></br>
              We are building something revolutionary in the market, and to achieve this goal, we have made strategic decisions that prioritize the sustainability and decentralization of our community.<br></br>

              Additionally, we rely on the powerful mechanism of the secondary pool, which already provides an essential layer of protection for our economy.<br></br>

              💡 Moving Forward with Smart Solutions<br></br>

              Last week, we successfully implemented the first practical test of the anti-whale system, an essential step to ensure market stability.<br></br>

              When there are large sales that could cause imbalances, we will take action with the Economic Strengthening Week, rebalancing the market fairly and sustainably.<br></br>
              📅 Economic Strengthening Week<br></br>
              🗓️ From Sunday, December 29, 2024, at 00:00 UTC, until January 5, 2025, at 00:00 UTC.<br></br>

              From today until next Sunday, the Contribution function will be temporarily disabled.
              During this period, it is essential for all members to perform the Claim to receive their coins and prepare for the strengthening week.<br></br>

              During the strengthening week, you can make your contributions at a fixed rate of $0.40, both at the time of contribution and claim, regardless of whether in USDT or BTC24H. This mechanism will naturally bring the price back to its normal market level.<br></br>

              ⚠️ This mechanism will be active for 7 days or until the market gradually values the coin to $0.40. After this period, everything will return to normal.<br></br>

              We believe that the effort and dedication of every member of our community should be valued.<br></br>
              Our commitment is to deliver real benefits and build an ecosystem that transforms lives, delivering an unprecedented asset to the market.<br></br>

              We are all together in this mission of growth and positive impact.<br></br>

              Best Regards,<br></br>
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
