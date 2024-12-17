
import type { Metadata } from "next";
import { Montserrat } from '@next/font/google';
import { WalletProvider } from "@/services/walletContext";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { RegisterProvider } from "@/services/RegistrationContext";
import { useState } from "react";

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
            <div className="w-full h-full flex items-center flex-col pb-[160px]">
              <button className="max-w-[350px] w-[92%] bg-white p-6 rounded-2xl mt-[50px] text-center font-bold text-black text-[30px]">!!! STATEMENT !!!</button>
              <div className="mt-[40px] rounded-2xl w-full sm:w-[90%] lg:w-[60%] flex-col bg-white p-4 sm:p-6 lg:p-10 text-black flex justify-center">
  <p className="text-2xl sm:text-xl lg:text-[50px] font-semibold">
    Statement
  </p>
  <span className="font-bold text-lg sm:text-base">
    Important Announcement for Our Community
  </span>
  <br />

  <p className="text-lg sm:text-base">
    Dear Community Members,
  </p>
  <br />

  <p className="text-lg sm:text-base">
    In response to the incident that occurred in the system on December 16, 2024, our team has made a strategic decision to further strengthen the security and trust in our platform.
  </p>
  <br /><br />

  <p className="text-lg sm:text-base">
    We have conducted the burn of <span className="font-bold">94,934.55 tokens</span> from the Genesis Wallet (Initial Liquidity Pool). This process has been documented and can be verified through the following Hash ID:
  </p>
  <br /><br />
  <a href="https://polygonscan.com/tx/0xbe58635ccbfd89202dbae1df2ea69667a40202eb9b6286decf2654d4112410e9" className="text-blue-500 break-all">
    0xbe58635ccbfd89202dbae1df2ea69667a40202eb9b6286decf2654d4112410e9
  </a>

  <p className="text-lg sm:text-base mt-4">
    This action was taken with the goal of preventing future issues and protecting the interests of all members of our community.
  </p>
  <br /><br />

  <p className="text-lg sm:text-base">
    With this measure, we reaffirm our commitment to providing a platform that is increasingly secure, reliable, and transparent for all our users.
  </p>
  <br /><br />

  <p className="text-lg sm:text-base">
    We appreciate your understanding and continued trust in our work. We remain dedicated to continuously improving our technology and processes to meet your expectations.
  </p>
  <br /><br />

  <p className="text-lg sm:text-base">
    Sincerely,
  </p>
  <br />
  <span className="font-bold text-lg sm:text-base">
    The Platform Development BTC24H Team.
  </span>
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
