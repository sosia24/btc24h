
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
              <div className="w-[80%] h-[300px] overflow-y-auto rounded-3xl bg-white text-black mt-[100px] p-8 text-[16px]">
              BTC24H Community: A New Milestone of Success<br></br><br></br>

                We are thrilled to announce a significant advancement in our project! The final adjustments are being completed and integrated into our smart contracts, ensuring greater precision and transparency. By listening closely to our community, we identified and corrected a discrepancy in the number of coins displayed in the Back Office. Now, the numbers will reflect 100% of the reality recorded on the Blockchain, bringing even more confidence to all our members.<br></br><br></br>

                We are committed to building a solid and balanced economy. Our project operates tirelessly, 24 hours a day, every day, and each step is carefully planned to offer a decentralized and enduring solution.<br></br><br></br>

                The Future is Promising for Those Who Build with Us!<br></br>
                We deeply appreciate everyone who believes in and supports BTC24H. We are just at the beginning of a victorious journey, and those who have acquired our coins will be at the center of these achievements. This will be the year we celebrate great profits and victories together!<br></br><br></br>

                Our next big step is already underway: the launch of the NFT WBTC, an innovation that will bring automatic liquidity to the market. We are strategically integrating each calculation and action to raise the value of our coin to $0.40, increasing its liquidity and consolidating its position in the market.<br></br><br></br>

                The development team expresses its unconditional gratitude to the community, which, with enthusiasm and focus, is helping to highlight our asset. Together, we are building a grand future!<br></br><br></br>

                <span>BTC24H: the path of innovation and prosperity starts here.</span>
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
