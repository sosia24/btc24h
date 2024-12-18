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
    throw error;
  }
}

/*------------ UNILEVEL --------------*/
export async function userUnilevelTotalDonated(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const provider = await getProvider(); // Usa o provider da wallet
      const contract = new ethers.Contract(
        DONATION_ADDRESS || "",
        donationAbi,
        provider
      );

      const userUnilevel = await contract.getUserUnilevelDonations(address);

      // Verifica se o valor é válido antes de retornar
      if (userUnilevel !== undefined && userUnilevel !== null) {
        return userUnilevel; // Retorna o valor obtido
      } else {
      }
    } catch (err) {
      
    }

    retries++;
    await new Promise((resolve) => setTimeout(resolve, delay)); // Aguarda antes de tentar novamente
  }

  throw new Error(`Falha ao obter dados após ${maxRetries} tentativas.`);
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

  return tx;
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

  await tx.wait();
  return tx;
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
  await tx.wait();
  return tx;
}



export async function getAllowanceUsdt(
  address: string,
  maxRetries = 5, // Número máximo de tentativas
  delay = 1000 // Tempo de espera entre tentativas (em milissegundos)
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Obtém o provedor conectado à wallet
      const provider = await getProvider();

      // Conecta ao contrato
      const mint = new ethers.Contract(
        USDT_ADDRESS ? USDT_ADDRESS : "",
        usdtAbi,
        provider
      );

      // Obtém o allowance
      const allowance : bigint = await mint.allowance(address, COLLECTION_ADDRESS);

      // Retorna o valor caso a chamada tenha sucesso
      if (allowance !== undefined) {
        return allowance;
      }

    } catch (error) {
    }

    retries++;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Lança um erro caso todas as tentativas falhem
  throw new Error(`Falha ao obter allowance após ${maxRetries} tentativas.`);
}



export async function getNftsUser(address: string, value: number, maxRetries = 3): Promise<any> {
  const provider = await getProvider();

  const mint = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const tx = await mint.balanceOf(address, value);
      
      // If the transaction is successful, return the result.
      if (tx !== undefined) {
        return tx;
      }
    } catch (error) {
    }

    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch data from the blockchain after ${maxRetries} attempts.`);
}



export async function buyNft(id: number,quantity:number) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const buy = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    signer
  );

  try {
    // Envia a transação
    const tx = await buy.mint(id, quantity);

    let concluded;

    // Tenta esperar a transação
    try {
      concluded = await tx.wait();
    } catch (waitError) {

      // Caso `tx.wait()` falhe, tenta obter o recibo manualmente
      concluded = await provider.getTransactionReceipt(tx.hash);
    }

    if (concluded && concluded.status === 1) {
      return concluded;
    } else {
      throw new Error("Transação falhou ou não foi confirmada.");
    }

  } catch (error) {
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
  
    await tx.wait();
  
    return tx;
  } catch (error) {
    throw error; // Certifique-se de que o erro seja capturado no chamador
  }
}
export async function getDonationAllowance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );

  const allowance = await btc24h.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function getBtc24hBalance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const btc24h = new ethers.Contract(
    BTC24H_ADDRESS ? BTC24H_ADDRESS : "",
    btc24hAbi,
    provider
  );

  const balance = await btc24h.balanceOf(owner);
  
  return balance;
}
export async function getBtc24hPrice(){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const oracle = new ethers.Contract(
    ORACLE_ADDRESS ? ORACLE_ADDRESS : "",
    oracleAbi,
    provider
  );

  const price = await oracle.returnPrice(ethers.parseUnits("1","ether"));
  
  return price;
}
export async function getBtc24hPreviewedClaim(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance = await donation.previewTotalValue(owner);

  return balance -balance*75n/10000n;
}

export async function getTimeUntilToClaim(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const time = Number(await donation.timeUntilNextWithdrawal(owner));
  
  return time;
}

export async function getUser(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const user : UserDonation = (await donation.getUser(owner));
  
  return user;
}

export async function getNextPool(){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.nextPoolFilling());
  
  return balance;
}

export async function getTotalBurned(){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();
  
  const donation = new ethers.Contract(
    DONATION_ADDRESS ? DONATION_ADDRESS : "",
    donationAbi,
    provider
  );

  const balance  = (await donation.totalBurned());
  
  return balance;
}

export async function isRegistered(owner:string){
  
  //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
  const provider = await getProvider();

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
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const isActive : boolean  = (await collection.isActive(owner,tokenId));

  return isActive;
}

export async function isApprovedNft(owner: string, isQueue: boolean) {
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

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
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

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
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retry após 1s
    }
  }
}

export async function balanceToPaid(tokenId: number, maxRetries = 3): Promise<string> {
  // Initialize the provider
  const provider = await getProvider();
  const collection = new ethers.Contract(
    QUEUE_ADDRESS ? QUEUE_ADDRESS : "",
    queueAbi,
    provider
  );

  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Attempt to fetch data from the blockchain
      const tx = await collection.balanceFree(tokenId);

      // If successful, format and return the result
      return ethers.formatEther(tx);
    } catch (error) {
    }

    // Increment the attempt counter
    attempt++;
  }

  // If all retries fail, throw an error or return a default value
  throw new Error(`Failed to fetch balance from the blockchain after ${maxRetries} attempts.`);
}



export async function coinPrice() {

    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

  const collection = new ethers.Contract(ORACLE_ADDRESS ? ORACLE_ADDRESS : "",oracleAbi,provider)

  let tx = (await collection.returnPrice(1000000000000000000))

  return (Number(tx)/Number(1000000));

}

export async function claimQueue(index: number, queueId: number) {
  if (!QUEUE_ADDRESS) {
    throw new Error("QUEUE_ADDRESS não está definido.");
  }

  const provider = await getProvider();
  const signer = await provider.getSigner();

  const collection = new ethers.Contract(
    QUEUE_ADDRESS,
    queueAbi,
    signer
  );

  try {
    // Envia a transação para o contrato
    const tx = await collection.claim(queueId);

    // Aguarda a confirmação da transação
    const concluded = await tx.wait();

    // Retorna o resultado após a transação ser confirmada
    return concluded;
  } catch (error) {
    console.error("Erro ao realizar a transação:", error);
    throw error; // Repassa o erro para o chamador
  }
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
      //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
      const provider = await getProvider();

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

    // Aguarda a confirmação
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      // Sucesso
      return {
        success: true,
        message: "Tokens successfully withdrawn!",
        transactionHash: tx.hash,
      };
    } else {
      // Transação falhou
      return {
        success: false,
        errorMessage: "Transaction failed on the blockchain.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.reason || error?.message || "Unknown error occurred",
    };
  }
}

export async function getUsdtBalance(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const balance = await usdt.balanceOf(owner);
  
  return balance;
}

export async function getDonationAllowanceUsdt(owner:string){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  const usdt = new ethers.Contract(
    USDT_ADDRESS ? USDT_ADDRESS : "",
    usdtAbi,
    provider
  );

  const allowance = await usdt.allowance(owner,DONATION_ADDRESS);
  
  return allowance;
}


export async function timeUntilInactiveNfts(owner:string,tokenId:number){
  
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();
  const collection = new ethers.Contract(
    COLLECTION_ADDRESS ? COLLECTION_ADDRESS : "",
    collectionAbi,
    provider
  );

  const time = await collection.timeUntilInactive(owner,tokenId);
  
  return time;
}

export async function getTreeUsers(address:string){
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

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
    //const provider = new ethers.JsonRpcProvider(RPC_ADDRESS);
    const provider = await getProvider();

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
