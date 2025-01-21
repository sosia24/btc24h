
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
            IMPORTANT ANNOUNCEMENT<br></br><br></br>

As you are all aware, we have protection systems in place that are activated in certain situations to safeguard our assets. Given that there are currently some discrepancies in the Claim values and with the aim of ensuring balance for all community members, we outline below the steps and tools you can use to proceed:<br></br>

Effective immediately and for the next 48 hours, the value of Bitcoin24H will be considered $0.25 USD to participate in the Liquidity NFT (BITCOIN24H). For each NFT priced at $75 USDT, participants will receive a reward of $100 USDT, subject to a withdrawal fee of 5%, resulting in a net value of $95 USDT.<br></br>
Currently, there are no NFTs available in this queue, as all have already been paid out.<br></br>

Therefore, this operation will begin for an exclusive period of 48 hours for all community members, including new members.<br></br>
Those who have already completed the Claim process and swapped their coins for USDT can repurchase the coins on the market and participate in acquiring the Liquidity NFT (BITCOIN24H), benefiting from the same conditions outlined above.<br></br>

We reaffirm our commitment to creating fair and transparent opportunities for the entire community.<br></br>
As always, we thank you for your trust, which is essential for the growth and success of all of us.<br></br>

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
