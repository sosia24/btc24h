import { ethers } from "ethers";

import presaleAbi from "./preSaleAbi.abi.json"
import usdtAbi from "./usdtAbi.abi.json"

const PRESALE_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS;
const RPC_POLYGON = process.env.NEXT_PUBLIC_RPC_POLYGON;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

import { promises } from "dns";

function getProvider() {
    if (!window.ethereum) throw new Error("No MetaMask found");
    return new ethers.BrowserProvider(window.ethereum);
  }

  export async function doLogin() {
    try {
      const provider = await getProvider();
      const account = await provider.send("eth_requestAccounts", []);
      if (!account || !account.length)
        throw new Error("Wallet not found/allowed.");
      await provider.send("wallet_switchEthereumChain", [{ chainId: CHAIN_ID }]);
      return account[0];
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
  

export async function preSalePrice(){
    const provider = new ethers.JsonRpcProvider(RPC_POLYGON);
  
    const get = new ethers.Contract(PRESALE_ADDRESS ? PRESALE_ADDRESS : "", presaleAbi, provider);
  
    const tx = await get.getCurrentPrice();
  
    return tx;
  }
  
  export async function totalSold(){
    const provider = new ethers.JsonRpcProvider(RPC_POLYGON);
  
    const get = new ethers.Contract(PRESALE_ADDRESS ? PRESALE_ADDRESS : "", presaleAbi, provider);
  
    const tx = await get.totalSharesSold();
  
    return tx;
  }
  
  export async function haveShare(address:string){
    const provider = await getProvider();
    const signer = await provider.getSigner();
  
    const get = new ethers.Contract(PRESALE_ADDRESS ? PRESALE_ADDRESS : "", presaleAbi, signer);
  
    const tx = await get.hasAllocation(address);
  
    return tx;
  }
  
  export async function buyShare(){
    try{
    const provider = await getProvider();
    const signer = await provider.getSigner();
  
    const get = new ethers.Contract(PRESALE_ADDRESS ? PRESALE_ADDRESS : "", presaleAbi, signer);
      const tx = await get.buyTokens({gasLimit:210000});
      await tx.wait()
      return true;
    }catch(erro){
      return false;
    }
  }
  
  export async function approveShareUSDT(value: Number) {
    const provider = await getProvider();
    const signer = await provider.getSigner();
  
    const mint = new ethers.Contract(
      USDT_ADDRESS ? USDT_ADDRESS : "",
      usdtAbi,
      signer
    );
  
    const tx = await mint.approve(PRESALE_ADDRESS, value);
    await tx.wait();
  
    return true;
  }
  
  export async function getAllowancePresale(address:string){
    const provider = await getProvider();
    const signer = await provider.getSigner();
  
    const get = new ethers.Contract(USDT_ADDRESS ? USDT_ADDRESS : "", usdtAbi, signer);
  
    const result = await get.allowance(address, PRESALE_ADDRESS);
  
    return (Number(result))/10**6;
  }
  