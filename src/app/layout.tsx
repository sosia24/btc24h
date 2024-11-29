import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { WalletProvider } from "@/services/walletContext";



const franklin = Libre_Franklin({ subsets: ["latin"] });
import "flag-icons/css/flag-icons.min.css";



export const metadata: Metadata = {
  title: "BTC-24H",
  description: "Innovative system of fair income distribution.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     
      <head>
        <title>Eth-Aid</title>
        <link rel="icon" href="/images/EthLogoPNG.png"/>
      </head>
      <body className="">
        <WalletProvider> {/* Envolva o conteúdo com o WalletProvider */}
          <main className={franklin.className}>{children}</main>
        </WalletProvider>

      </body>
    </html>
  );
}
