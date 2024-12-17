"use client"
import Image from "next/image";
import Footer from "@/componentes/footer";
import withAuthGuard from "@/services/authGuard";
import { useWallet } from "@/services/walletContext";
import { useEffect, useState } from "react";
import ModalSuccess from "@/componentes/ModalSuccess";
import ModalError from "@/componentes/ModalError";
import { useRegistered } from "@/services/RegistrationContext";
import {
    approveUSDT,
    getAllowanceUsdt,
    getNftsUser,
    buyNft,
    isActiveNft,
    isApprovedNft,
    setApprovalForAll,
    activeUnilevelNft,
    timeUntilInactiveNfts,
    
}from "@/services/Web3Services";

function Page1(){
    const { address, setAddress } = useWallet();
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    const [allowanceUsdt, setAllowanceUsdt] = useState(0);
    const [bronze, setBronze] = useState<number>(0);
    const [silver, setSilver] = useState<number>(0);
    const [gold, setGold] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean[]>([false,false,false]);
    const [timeUntil, setTimeUntil] = useState<bigint[]>([0n,0n,0n]);
    
    const [isApprovedNftV, setIsApprovedNftV] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { requireRegistration } = useRegistered();



    useEffect(() => {
        const interval = setInterval(() => {
            setTimeUntil((prev) =>
                prev.map((time) => (time > 0n ? time - 1n : 0n))
            );
        }, 1000);
    
        return () => clearInterval(interval); // Cleanup do intervalo
    }, []);
    function formatTime(time: bigint): string {
        const totalSeconds = Number(time);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        return `${hours}h ${minutes}m ${seconds}s`;
    }
        

    async function doApproveUsdt(value: Number){
        setLoading(true);
        try{
            const result = await approveUSDT(value);
            if(result){
                getAllowanceUsdtFront();
                setLoading(false)
            }
        }catch(error){
            setLoading(false)
        }
    }
    async function doApproveCollection(){

        setLoading(true);
        try{
            const result = await setApprovalForAll(false);
            if(result){
                getIsApprovedNft()
                setLoading(false)
                setAlert("Success");
                await fetch()
            }
        }catch(error){
            setLoading(false)
            setError("Something went wrong, try again");
        }
    }
    async function getIsActiveStatus() {
        if (address) {
            try {
                const statuses = await Promise.all([
                    isActiveNft(address, 1),
                    isActiveNft(address, 2),
                    isActiveNft(address, 3)
                ]);
                setIsActive([statuses[0], statuses[1], statuses[2]]);
            } catch (error) {
                console.error("Error fetching NFT active status:", error);
            }
        }
    }
    async function getTimeUntilStatus() {
        if (address) {
            try {
                const statuses = await Promise.all([
                    timeUntilInactiveNfts(address, 1),
                    timeUntilInactiveNfts(address, 2),
                    timeUntilInactiveNfts(address, 3)
                ]);
                setTimeUntil([statuses[0], statuses[1], statuses[2]]);
            } catch (error) {
                console.error("Error fetching NFT active status:", error);
            }
        }
    }
    async function getIsApprovedNft() {
        if (address) {
            try {
                const status = await isApprovedNft(address, false)
                
                setIsApprovedNftV(status);
            } catch (error) {
                console.error("Error fetching NFT approve status:", error);
            }
        }
    }
    async function getNftsUserFront() {
        if(address){
            for(let i = 1; i<4; i++){
                const result = await getNftsUser(address,i);
                if(i === 1){
                    setBronze(Number(result));
                }else if(i === 2){
                    setSilver(Number(result));
                }else if(i === 3){
                    setGold(Number(result))
                }
            }
        }
    }
    

    async function getAllowanceUsdtFront(){
        try{
            if(address){
                    const result = await getAllowanceUsdt(address);
                    console.log("approve: ", result);
                    setAllowanceUsdt(result);
                }
        }catch(error){

        }
    }

    async function buyNftFront(id: number, amount: number) {
      await requireRegistration(() => {});
    
      setLoading(true);
      try {
        const result = await buyNft(id); // Executa a compra
    
        if (result && result.status === 1) { // status 1 significa sucesso
          setAlert("NFT purchased successfully");
    
          // Aguarde a atualização do allowance após a compra
          await getAllowanceUsdtFront(); 
    
          // Atualiza outras informações
          await getIsApprovedNft();
          await getNftsUserFront();
          await fetch(); // Atualiza os dados gerais
        } else {
          throw new Error("Transaction failed unexpectedly");
        }
      } catch (error) {
        console.error("Erro na compra do NFT:", error); // Log detalhado
        setError("Something went wrong, try again");
      } finally {
        setLoading(false);
      }
    }
    
      

      const handleActivateNFT = async (index: number, id: number) => {
        await requireRegistration(() => {});
        setLoading(true);
        const result = await activeUnilevelNft(id);
      
        if (result) {
          setIsActive((prev) => {
            setLoading(false)
            const updated = [...prev];
            updated[index] = true;
            setAlert("Nft Active");
            getIsActiveStatus();
            getIsApprovedNft();
            getTimeUntilStatus()
            getTimeUntilStatus();
            return updated;
          });
        }
        setLoading(false)
      };
      

    /* ---------- INICIA JUNTO COM A PAGINA --------- */
    const fetch = async () =>{
        getAllowanceUsdtFront();
        getNftsUserFront();
        getIsActiveStatus();
        getIsApprovedNft();
        getTimeUntilStatus()
    }
    useEffect(() => {
        fetch()
    }, [address]);
    async function clearError(){
        setError("");
    }
    
    async function clearAlert(){
        setAlert("");
    }

    return(
        <>
              {error && <ModalError msg={error} onClose={clearError} />}
              {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
        {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
        </div>
        )}
        <div className="lg:w-[90%] h-screen lg:py-0 py-5 px-8  w-[100%] mt-[60px] flex items-center  flex-col ">
        <div className="relative w-[98%] h-[250px]">
            <img
            className="w-full h-full object-contain"
            alt="NFT Sale Banner"
            src="images/bunner_nftSale.png"
            />
             <p className="absolute top-1/2 left-1/3 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-black text-[40px] md:text-[25px] lg:text-[50px] font-bold">
                Buy NFT's
            </p>
        </div>
        <div className="lg:w-[100%] w-full sm:p-2 p-6 pb-12 mx-4 bg-white bg-opacity-10 mt-[30px] rounded-3xl flex lg:flex-row flex-col items-center justify-center">
  {/* Silver */}
  <div className="lg:w-[33%] w-full h-auto flex flex-col items-center lg:items-start lg:flex-row lg:mt-0 mt-[30px]">
    <div className="z-10 w-[50%] flex-shrink-0">
      <Image alt="prata" src={"/images/silver.png"} width={250} height={250} className="mx-auto lg:mx-0"></Image>
    </div>
    <div className="bg-white bg-opacity-15 w-[90%] lg:w-[230px] mt-[20px] h-auto text-white p-4 rounded-xl lg:ml-[-80px] z-0">
      <div className="lg:text-right text-center font-semibold text-[18px]">
        <p className="">Nft Silver</p>
      </div>
      <div className="w-full text-white flex flex-col lg:items-end items-center justify-center">
        <div className="w-[80%] bg-green-500 rounded-2xl bg-opacity-10 flex flex-col items-center justify-center p-2">
          <div className="flex flex-row items-center justify-center">
            <p>$</p>
            <p className="font-bold text-[4vh] lg:text-[45px]">50</p>
          </div>
          <p className="flex bottom-0 mt-[-10px] text-center lg:text-right">
            Win <span className="text-[#f6d600] ml-[5px]"> 2.5x</span>
          </p>
        </div>
        {allowanceUsdt >= 50000000 ? (
          <button
            onClick={async () => {
              buyNftFront(2, 1);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#00ff54]"
          >
            Buy Nft
          </button>
        ) : (
          <button
            onClick={async () => {
              doApproveUsdt(50000000);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#ffea00]"
          >
            Approve
          </button>
        )}
        <p className="w-full lg:text-end text-center mt-[3px]">
          You have: {silver}
        </p>
      </div>
    </div>
  </div>

  {/* Gold */}
  <div className="lg:w-[33%] w-full h-auto flex flex-col items-center lg:items-start lg:flex-row lg:mt-0 mt-[30px]">
    <div className="z-10 w-[50%] flex-shrink-0">
      <Image alt="prata" src={"/images/gold.png"} width={250} height={250} className="mx-auto lg:mx-0"></Image>
    </div>
    <div className="bg-white bg-opacity-15 w-[90%] lg:w-[230px] mt-[20px] h-auto text-white p-4 rounded-xl lg:ml-[-80px] z-0">
      <div className="lg:text-right text-center font-semibold text-[18px]">
        <p className="">Nft Gold</p>
      </div>
      <div className="w-full text-white flex flex-col lg:items-end items-center justify-center">
        <div className="w-[80%] bg-green-500 rounded-2xl bg-opacity-10 flex flex-col items-center justify-center p-2">
          <div className="flex flex-row items-center justify-center">
            <p>$</p>
            <p className="font-bold text-[4vh] lg:text-[45px]">100</p>
          </div>
          <p className="flex bottom-0 mt-[-10px] text-center lg:text-right">
            Win <span className="text-[#f6d600] ml-[5px]"> 3.0x</span>
          </p>
        </div>
        {allowanceUsdt >= 100000000 ? (
          <button
            onClick={async () => {
              buyNftFront(3, 1);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#00ff54]"
          >
            Buy Nft
          </button>
        ) : (
          <button
            onClick={async () => {
              doApproveUsdt(100000000);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#ffea00]"
          >
            Approve
          </button>
        )}
        <p className="w-full lg:text-end text-center mt-[3px]">
          You have: {gold}
        </p>
      </div>
    </div>
  </div>

  {/* Bronze */}
  <div className="lg:w-[33%] w-full h-auto flex flex-col items-center lg:items-start lg:flex-row lg:mt-0 mt-[30px]">
    <div className="z-10 w-[50%] flex-shrink-0">
      <Image alt="prata" src={"/images/bronze.png"} width={250} height={250} className="mx-auto lg:mx-0"></Image>
    </div>
    <div className="bg-white bg-opacity-15 w-[90%] lg:w-[230px] mt-[20px] h-auto text-white p-4 rounded-xl lg:ml-[-80px] z-0">
      <div className="lg:text-right text-center font-semibold text-[18px]">
        <p className="">Nft Bronze</p>
      </div>
      <div className="w-full text-white flex flex-col lg:items-end items-center justify-center">
        <div className="w-[80%] bg-green-500 rounded-2xl bg-opacity-10 flex flex-col items-center justify-center p-2">
          <div className="flex flex-row items-center justify-center">
            <p>$</p>
            <p className="font-bold text-[4vh] lg:text-[45px]">10</p>
          </div>
          <p className="flex bottom-0 mt-[-10px] text-center lg:text-right">
            Win <span className="text-[#f6d600] ml-[5px]"> 2.0x</span>
          </p>
        </div>
        {allowanceUsdt >= 10000000 ? (
          <button
            onClick={async () => {
              buyNftFront(1, 1);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#00ff54]"
          >
            Buy Nft
          </button>
        ) : (
          <button
            onClick={async () => {
              doApproveUsdt(10000000);
            }}
            className="text-black rounded-tl-full w-[130px] mt-[15px] rounded-br-full py-[5px] bg-[#ffea00]"
          >
            Approve
          </button>
        )}
        <p className="w-full lg:text-end text-center mt-[3px]">
          You have: {bronze}
        </p>
      </div>
    </div>
  </div>
</div>

            <section className="pb-[250px] sm:pb-[150px] w-full mt-10 sm:mt-0 md:mt-0 ">
                <header className="my-20 flex items-center justify-center sm2:flex-col">
                    <div  className="relative w-[60%] sm2:w-full">
                    <img className="w-full" src="images/BannerDeposit.png" alt="Banner" />
                    <h1 className="absolute font-bold top-8 left-8 text-3xl text-black sm:text-sm">Active Your NFTs Referral Comission</h1>
                    </div>
                    <h2 className="w-1/2 sm2:w-full mt-4 text-3xl pl-8 font-semibold sm:text-sm">
    When you <b>deposit your NFT</b> into the contract, it will be burned to <span className="text-[#00EA38]">enable</span> you to <span className="text-[#00EA38]">receive commissions</span> from the purchase of NFTs within your unilevel.
</h2>


</header>
<main className="w-full p-4 text-white bg-white bg-opacity-10 gap-4 mt-4 flex flex-col lg:flex-row justify-center rounded-3xl">
  {/* Bronze NFT */}
  <div className="flex flex-col items-center relative">
    <img className="w-[160px] lg:w-[260px] h-[260px] object-contain" src="images/bronzeNftDeposit.png" alt="bronze" />
    <span className="mt-2 font-semibold text-xl text-center">Bronze NFT</span>
    <div className="w-full text-center mt-4 text-black">
      { !isApprovedNftV ? (
        <button
          className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
          onClick={doApproveCollection}
        >
          Approve
        </button>
      ) : (
        <>
          <button
            className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
            disabled={isActive[0]}
            onClick={async () => handleActivateNFT(0, 1)}
          >
            {isActive[0] ? "Activated" : "Activate NFT"}
          </button>
          <p className="text-white mt-2 text-center">
            {isActive[0] && timeUntil[0] > 0n && (
              <>Time remaining: <span className="text-[#2DFF4A] font-bold">{formatTime(timeUntil[0])}</span></>
            )}
          </p>
        </>
      )}
    </div>
  </div>

  {/* Silver NFT */}
  <div className="flex flex-col items-center relative">
    <img className="w-[180px] lg:w-[260px] h-[260px] object-contain" src="images/silverNftDeposit.png" alt="silver" />
    <span className="mt-2 font-semibold text-xl text-center">Silver NFT</span>
    <div className="w-full text-center mt-4 text-black">
      { !isApprovedNftV ? (
        <button
          className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
          onClick={doApproveCollection}
        >
          Approve
        </button>
      ) : (
        <>
          <button
            className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
            disabled={isActive[1]}
            onClick={async () => handleActivateNFT(1, 2)}
          >
            {isActive[1] ? "Activated" : "Activate NFT"}
          </button>
          <p className="text-white mt-2 text-center">
            {isActive[1] && timeUntil[1] > 0n && (
              <>Time remaining: <span className="text-[#2DFF4A] font-bold">{formatTime(timeUntil[1])}</span></>
            )}
          </p>
        </>
      )}
    </div>
  </div>

  {/* Gold NFT */}
  <div className="flex flex-col items-center relative">
    <img className="w-[180px] lg:w-[260px] h-[260px]  object-contain" src="images/goldNftDeposit.png" alt="gold" />
    <span className="mt-2 font-semibold text-xl text-center">Gold NFT</span>
    <div className="w-full text-center mt-4 text-black">
      { !isApprovedNftV ? (
        <button
          className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
          onClick={doApproveCollection}
        >
          Approve
        </button>
      ) : (
        <>
          <button
            className="bg-[#2DFF4A] p-2 rounded-3xl font-semibold text-xl w-[181px]"
            disabled={isActive[2]}
            onClick={async () => handleActivateNFT(2, 3)}
          >
            {isActive[2] ? "Activated" : "Activate NFT"}
          </button>
          <p className="text-white mt-2 text-center">
            {isActive[2] && timeUntil[2] > 0n && (
              <>Time remaining: <span className="text-[#2DFF4A] font-bold">{formatTime(timeUntil[2])}</span></>
            )}
          </p>
        </>
      )}
    </div>
  </div>
</main>

            </section>
        <Footer></Footer>
        </div>
        </>
    )
}
export default withAuthGuard(Page1);