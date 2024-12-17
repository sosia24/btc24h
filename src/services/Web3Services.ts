import { ethers } from "ethers";
import donationAbi from "./abis/donation.abi.json";
import userAbi from "./abis/user.abi.json";
import usdtAbi from "./abis/usdt.abi.json"
import btc24hAbi from "./abis/btc24h.abi.json"
import oracleAbi from "./abis/oracle.abi.json";
import collectionAbi from "./abis/collection.abi.json";
import { UserDonation } from "./types";
import queueAbi from "./abis/queue.abi.json";
import paymentManagerAbi from "./abis/payment.manager.abi.json"

import {queueData} from "./types"

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const DONATION_ADDRESS = process.env.NEXT_PUBLIC_DONATION;
const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT;
const BTC24H_ADDRESS = process.env.NEXT_PUBLIC_BTC24H;
const COLLECTION_ADDRESS= process.env.NEXT_PUBLIC_COLLECTION;
const ORACLE_ADDRESS= process.env.NEXT_PUBLIC_ORACLE;
const USER_ADDRESS= process.env.NEXT_PUBLIC_USER;
const QUEUE_ADDRESS = process.env.NEXT_PUBLIC_QUEUE;
const RPC_ADDRESS = process.env.NEXT_PUBLIC_RPC
const PAYMENT_MANAGER = process.env.NEXT_PUBLIC_PAYMENT_MANAGER


/*------------ CONNECT WALLET --------------*/
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

/*------------ UNILEVEL --------------*/
export async function userUnilevelTotalDonated(address: string) {
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);


  const contract = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const userUnilevel = await contract.getUserUnilevelDonations(address);

  return userUnilevel;


}

/*------------ COLLECTION NFTS --------------*/

export async function approveUSDT(value: Number) {
  const provider = await getProvider()
  const signer = await provider.getSigner();

  const mint = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );

  const tx = await mint.approve(COLLECTION_ADDRESS, value);
  await tx.wait();

  const concluded = tx.wait();
  return concluded;
}

export async function approveBTC24HDonation(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    signer
  );

  const tx = await token.approve(DONATION_ADDRESS, ethers.parseUnits(value,"ether"));

  const concluded = await tx.wait();
  return concluded;
}
export async function approveUsdtDonation(value: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const token = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    signer
  );

  const tx = await token.approve(DONATION_ADDRESS, Number(value)*10**6);
  const concluded = await tx.wait();
  return concluded;
}



export async function getAllowanceUsdt(address: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

    const mint = new ethers.Contract(
      USDT_ADDRESS ? USDT_ADDRESS : "", 
      usdtAbi,      
      provider     
    );

    const tx = await mint.allowance(address, COLLECTION_ADDRESS);
    return tx;
  } catch (error) {
    console.error('Erro ao obter allowance:', error);
    throw new Error('Failed to get allowance');
  }
}


export async function getNftsUser(address: string, value: Number){
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const mint = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );
  const tx = await mint.balanceOf(address, value);
  return tx; 
}


export async function buyNft(id: number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const buy = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );

  try {
    // Envia a transação
    const tx = await buy.mint(id, 1);
    console.log("Transação enviada:", tx.hash);

    let concluded;

    // Tenta esperar a transação
    try {
      concluded = await tx.wait();
    } catch (waitError) {
      console.warn("Erro ao aguardar recibo, tentando buscar manualmente...", waitError);

      // Caso `tx.wait()` falhe, tenta obter o recibo manualmente
      concluded = await provider.getTransactionReceipt(tx.hash);
    }

    if (concluded && concluded.status === 1) {
      console.log("Transação confirmada com sucesso:", tx.hash);
      return concluded;
    } else {
      throw new Error("Transação falhou ou não foi confirmada.");
    }

  } catch (error) {
    console.error("Erro ao executar compra de NFT:", error);
    throw error; // Lança erro para ser tratado no frontend
  }
}

export async function donate(amount:string, isUsdt:boolean){
  
  const provider = await getProvider();
  const signer = await provider.getSigner();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    signer
  );

  let tx
  if(isUsdt){
    tx = await donation.donate(Number(amount)*10**6, isUsdt);

  }else{
    tx = await donation.donate(ethers.parseUnits(amount,"ether"), isUsdt);

  }
  const concluded = tx.wait();
  return concluded;
}
export async function claim(){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    signer
  );
  
  try {
    const tx = await donation.claimDonation();
    console.log("Transaction hash:", tx.hash);
  
    const concluded = await tx.wait();
    console.log("Transaction receipt after wait:", concluded);
  
    return concluded;
  } catch (error) {
    console.error("Error during claim process:", error);
    throw error; // Certifique-se de que o erro seja capturado no chamador
  }
}
export async function getDonationAllowance(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );

  const allowance = await btc24h.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}
export async function getBtc24hBalance(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );

  const balance = await btc24h.balanceOf(owner);
  
  return balance;
}
export async function getBtc24hPrice(){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const oracle = new ethers.Contract(
    ORACLE_ADDRESS ? ORACLE_ADDRESS : "",
    oracleAbi,
    provider
  );

  const price = await oracle.returnPrice(ethers.parseUnits("1","ether"));
  
  return price;
}
export async function getBtc24hPreviewedClaim(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance = await donation.previewTotalValue(owner);

  return balance -balance*75n/10000n;
}

export async function getTimeUntilToClaim(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const time = Number(await donation.timeUntilNextWithdrawal(owner));
  
  return time;
}

export async function getUser(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const user : UserDonation = (await donation.getUser(owner));
  
  return user;
}

export async function getNextPool(){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.nextPoolFilling());
  
  return balance;
}

export async function getTotalBurned(){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.totalBurned());
  
  return balance;
}

export async function isRegistered(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const user = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const userData : any  = (await user.getUser(owner));
  
  return userData.registered;
}

export async function registerUser(newUser:string){
  
  const provider = await getProvider()
  const signer = await provider.getSigner();
  
  const user = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    signer
  );

  const tx  = (await user.createUser(newUser));
  const receipet = await tx.wait()

  return receipet;
}

export async function isActiveNft(owner:string,tokenId:number){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const isActive : boolean  = (await collection.isActive(owner,tokenId));

  return isActive;
}

export async function isApprovedNft(owner: string, isQueue: boolean) {
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const collection = new ethers.Contract(
      COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
      collectionAbi,
      provider
  );

  let isApproved;
  if (!isQueue) {
      // Verifica aprovação para COLLECTION_ADDRESS
      isApproved = await collection.isApprovedForAll(owner, COLLECTION_ADDRESS);
  } else {
      // Verifica aprovação para QUEUE_ADDRESS
      isApproved = await collection.isApprovedForAll(owner, QUEUE_ADDRESS);
  }

  return isApproved; // Retorna true ou false
}



export async function activeUnilevelNft(tokenId:number){
  const provider = await getProvider()
  const signer = await provider.getSigner();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );
  let tx;

    tx  = (await collection.activeUnilevel(tokenId));
  
  await tx.wait()

  const concluded = tx.wait();
  return concluded;
}

/* ------- QUEUE -------------*/

export async function setApprovalForAll(isQueue:boolean){
  
  const provider = await getProvider();
  const signer = await provider.getSigner();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );
  let tx;
  if(isQueue){
    tx  = (await collection.setApprovalForAll(QUEUE_ADDRESS,true));
  }else{
    tx  = (await collection.setApprovalForAll(COLLECTION_ADDRESS,true));
  }
  await tx.wait()

  const concluded = tx.wait();
  return concluded;
}


export async function getQueue(batchLevel: number): Promise<queueData[]> {
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const queueContract = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    provider
  );

  while (true) {
    try {
      // Obtenha os dados da fila diretamente do contrato
      const getQueueDetails: any[] = await queueContract.getQueueDetails(batchLevel);
      
      // Transforme as tuplas retornadas para o formato `queueData`
      const queue: queueData[] = getQueueDetails.map((item) => ({
        user: item[0], // address
        index: BigInt(item[1]), // uint256 -> BigInt
        batchLevel: BigInt(item[2]), // uint256 -> BigInt
        nextPaied: item[3] === 1 // uint256 -> boolean
      }));

      return queue;

    } catch (err) {
      console.error("Erro ao obter dados da fila:", err);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
    }
  }
}

export async function balanceToPaid(tokenId:number){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const collection = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    provider
  );

  let  tx  = (await collection.balanceFree(tokenId));

  const concluded = tx;
  return ethers.formatEther(concluded)
}



export async function coinPrice() {

  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const collection = new ethers.Contract(ORACLE_ADDRESS ? ORACLE_ADDRESS : "",oracleAbi,provider)

  let tx = (await collection.returnPrice(1000000000000000000))

  return (Number(tx)/Number(1000000));

}

export async function claimQueue(index:Number, queueId:Number){
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    signer
  );
  let  tx  = (await collection.claim(queueId));

  const concluded = tx.wait();
  return concluded;
}


export async function addQueue(tokenId: BigInt, quantity: BigInt) {
  const provider = await getProvider();
    const signer = await provider.getSigner();

    const collection = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      signer
    );

    const tx = await collection.addToQueue(tokenId, quantity);
    const concluded = await tx.wait(); // Aguarda a confirmação da transação
    return concluded; // Retorna a conclusão em caso de sucesso

}

export async function timeUntilActivate(address:string, index:Number){
  return 1000;
}

export async function getTokensToWithdraw(owner: string) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

    const queue = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      provider
    );

    const tokens = await queue.tokensToWithdraw(owner);
    return tokens; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}

export async function withdrawTokens() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      QUEUE_ADDRESS || "",
      queueAbi,
      signer
    );

    const tx = await queue.withdrawTokens();
    const concluded = await tx.wait(); // Aguarda a confirmação da transação
    return concluded; // Retorna a conclusão em caso de sucesso
  } catch (error: any) {
    // Retorna a mensagem de erro
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}

export async function getUsdtBalance(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const balance = await usdt.balanceOf(owner);
  
  return balance;
}

export async function getDonationAllowanceUsdt(owner:string){
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const allowance = await usdt.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function timeUntilInactiveNfts(owner:string,tokenId:number){
  console.log(1);
  
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const time = await collection.timeUntilInactive(owner,tokenId);
  
  return time;
}

export async function getTreeUsers(address:string){
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const usdt = new ethers.Contract(
    USER_ADDRESS ? USER_ADDRESS : "",
    userAbi,
    provider
  );

  const users = await usdt.getUser(address)
  return users;

}


/* ---------------- PAYMENT MANAGER -------------- */

export async function verifyPercentage(address:String){
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const connect = new ethers.Contract(PAYMENT_MANAGER ? PAYMENT_MANAGER : "", paymentManagerAbi, provider);

  const verify = await connect.recipientsPercentage(address); 
  return verify;
}

export async function verifyBalance(address:String){
  const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);

  const connect = new ethers.Contract(PAYMENT_MANAGER ? PAYMENT_MANAGER : "", paymentManagerAbi, provider);

  const verify = await connect.getUserBalance(address); 
  return verify;
}


export async function claimPaymentManager() {
  try {
    const provider = await getProvider();
    const signer = await provider.getSigner();

    const queue = new ethers.Contract(
      PAYMENT_MANAGER || "",
      paymentManagerAbi,
      signer
    );

    // Envia a transação
    const tx = await queue.claim();

    // Aguarda a confirmação
    await tx.wait();

    // Retorna sucesso
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}
