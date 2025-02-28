
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
           <span className="font-bold"> Official Announcement: Adjustments in the First Stage of Our Platform</span><br></br><br></br>

Dear members of our community,<br></br>

With the goal of strengthening the ecosystem and increasing the value of our Bitcoin24h currency, we will implement a series of strategic adjustments to the platform. These changes are designed to balance the system and provide sustainable benefits to all participants. Below, we detail the key modifications:<br></br><br></br>

<span className="font-bold">Contributions and Payments in Bitcoin24h</span><br></br>
Starting from the implementation of these adjustments, all contributions must be made in Bitcoin24h, and payments will also be received in this currency. This will reinforce the utility and stability of our ecosystem.<br></br><br></br>

<span className="font-bold">Weekly Claims</span><br></br>
Beginning on Saturday, March 1st, at 00:00 UTC, withdrawal requests (claims) will be processed every 7 days, receiving 5% of the initial deposited value. All current contributions will continue to receive the remaining claims on a weekly basis.<br></br>
The total number of available claims will depend on the amount of the contribution:<br></br>
<span className="font-bold">Between 10 and $99.99 in Bitcoin24h:</span> 30 claims.<br></br>

<span className="font-bold">Between 100 and 999.99 in Bitcoin24h:</span> 35 claims.<br></br>

<span className="font-bold">Between 1,000 and 9,999.99 in Bitcoin24h:</span> 40 claims.<br></br>

<span className="font-bold">More than 10,000 Bitcoin24h:</span> 52 claims.<br></br><br></br>

<span className="font-bold">Matching Bonus</span><br></br>
We will implement a matching bonus where you will receive 1% over 40 levels from all claims made in Bitcoin24h, accumulating a total of 40% in additional bonuses. This incentive rewards active participation within the ecosystem.<br></br><br></br>

<span className="font-bold">Optimization of NFT Payments</span><br></br> 
To improve the NFT payment dynamics, we will adjust the way payments are processed. Payments will now be made whenever the balance reaches the required amount to pay for two NFTs, benefiting both the first and last in the queue. This adjustment ensures a more equitable and sustainable distribution.<br></br><br></br>

These changes represent a fundamental step in the evolution of our platform and the consolidation of Bitcoin24h as a key asset within our ecosystem.<br></br><br></br>

We appreciate your commitment and trust. We are confident that these improvements will bring great benefits to our entire community. Let's continue building the future of decentralized finance together!<br></br><br></br>

Best Regards, <span className="font-bold">DAO BTC24H Team</span><br></br><br></br>

P.S.: These strategic adjustments are the result of a joint effort among our key currency holders, leaders, and the community, who have worked together to strengthen and balance our ecosystem.

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
