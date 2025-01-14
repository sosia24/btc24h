
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

As a DAO (Decentralized Autonomous Organization), our priority is always to make decisions together with the community. Therefore, we will initiate a vote to determine the best solution for the future of our ecosystem.<br></br>
Below are the two proposals for your consideration:<br></br>
______________<br></br>
<span className="font-bold">Option 1 – Maintain the Current Model</span><br></br>
Continue with the current system, which will require constant adjustments over time. However, it is important to note that this approach may present significant challenges:<br></br>
•	The token will remain unstable in the public market due to the total Claim, which compromises the asset's balance.<br></br>
•	The lack of a profit cap may put the entire ecosystem at risk, jeopardizing its long-term sustainability.<br></br>
______________<br></br>
<span className="font-bold">Option 2 – Build a Balanced and Sustainable Ecosystem for the Long Term</span><br></br>
This option proposes strategic adjustments to ensure the ecosystem operates efficiently and securely for all participants. <br></br>

Contribution Adjustments<br></br>
•	Contributions will be rewarded in 30 installments of 5% each, with renewal at the end of the cycle if the participant wishes to continue contributing.<br></br>
•	Example: By contributing $1,000, the participant will receive 5% per day for 30 days, totaling $1,500 at the end, including the initial capital. This represents a 50% monthly gain.<br></br>
•	
Network Bonus Adjustments<br></br>
•	Implementation of a profit cap to protect the ecosystem and the asset. This limit will be regulated by a (GAS) mechanism, which must be utilized whenever the network profit cap is reached (200%).<br></br>
o	Example: With 50 USDT deposited as GAS, it will be possible to earn up to 100 USDT in network profits. If the volume increases, the GAS can be adjusted accordingly.<br></br>
•	All GAS activity will generate network commissions, further strengthening the ecosystem.<br></br>
•	
(GAS) Distribution in the Ecosystem<br></br>
•	30% for network commissions (10% direct commission and 20% distributed across 40 levels, with 0.5% per level).<br></br>
•	30% for purchasing and burning the Bitcoin24H token.<br></br>
•	30% for purchasing the Bitcoin24H token and recharging the Distribution Pool.<br></br>
•	10% to strengthen the economy and support liquidity NFTs.<br></br>
______________<br></br>

We deeply appreciate the commitment of all community members. Our goal is to create a solid, sustainable ecosystem that is ready for the future.<br></br>

We count on your participation in this decisive vote!<br></br><br></br>

Best regards,<br></br>

<span className="font-bold">The BTC24H DAO Team</span><br></br><br></br>
<p>Vote:</p><br></br>

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
