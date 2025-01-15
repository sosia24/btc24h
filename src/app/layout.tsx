
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
            DAO BTC24H Announcement<br></br><br></br>


            We deeply thank our entire community for participating in the vote!
This was our first moment of joint decision-making, and we are confident it represented a true turning point for our project.
Option number 2 was the winner, with a significant lead: 577 votes against only 35 for option 1.
<br></br><br></br>

We are just getting started, and adjustments were necessary. Now, we enter a crucial moment for our project:
The management of our currency!
Currently, it is very scarce in the market and will remain so.
Everyone will have the opportunity to claim their principal amounts and will receive them according to the proportion of their contributions.
The minimum claim value will be $0.10, a measure designed to protect our economy. This scarcity will ensure the currency remains valuable, allowing it to quickly reach higher levels.
<br></br><br></br>

With the choice made by the community, we have strengthened the solidity and longevity of our project.
This alignment will allow us to position our team as a leader in the market.
The implementation of the new model will begin immediately after the last claim is made by members, which should happen in about three days.
After this period, we will begin contributions in accordance with the community's decision: 
30 tranches of 5%.
This format was designed to gradually introduce the currency into the market, reducing the volume of sales in a single day.
<br></br><br></br>

In addition, our gas recharge and earnings strategy will create immediate scarcity of the currency, decreasing circulation and strengthening the economy.
We will continue implementing the adjustments determined by the vote, and as soon as the last member makes their claim, we will provide a detailed report containing:
<br></br><br></br>

• How many tokens are yet to be distributed;<br></br>

• How many tokens are in the liquidity pool;<br></br>

• How many tokens are held by the community.<br></br>

<br></br>
This report will be fundamental for us to understand the numbers and plan actions for the start of contributions next week.
<br></br>
We are working intensively on programming and necessary adjustments to strengthen our economy.
We are very pleased with the progress because we have a community that has decided to innovate, create something unprecedented, and work with dedication.
<br></br>
For you, we will continue to do whatever it takes to ensure our project's success!
<br></br>

Best regards,<br></br>


<span className="font-bold">The BTC24H DAO Team</span><br></br><br></br>

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
