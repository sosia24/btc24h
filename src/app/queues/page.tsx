"use client";
import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '@/componentes/footer';
import ModalError from '@/componentes/ModalError';
import ModalSuccess from '@/componentes/ModalSuccess';
import { 
        getQueue,
        balanceToPaid,
        isApprovedNft,
        getBtc24hPrice,
        claimQueue,
        addQueue,
        setApprovalForAll,
        getTokensToWithdraw,
        coinPrice,
        withdrawTokens,
 } from "@/services/Web3Services";
import { queueData } from '@/services/types';
import { CustomArrowProps } from 'react-slick';
import { useWallet } from '@/services/walletContext';
import withAuthGuard from "@/services/authGuard";
import ModalTokensToWithdraw from '@/componentes/ModalTokenToWithdraw';

function Page1() {

    const [visibleSlides, setVisibleSlides] = useState(3); // Valor inicial para desktop
    const { address, setAddress } = useWallet();

    /*------------------ GET QUEUE DETAILS ------------*/

    const [queueBronzeDetails, setQueueBronzeDetails] = useState<queueData[] | null>(null);
    const [queueBronzeDetailsFormated, setQueueBronzeDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidBronze, setReadyToPaidBronze] = useState<number>(0)
    const [queueSilverDetails, setQueueSilverDetails] = useState<queueData[] | null>(null);
    const [queueSilverDetailsFormated, setQueueSilverDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidSilver, setReadyToPaidSilver] = useState<number>(0)
    const [queueGoldDetails, setQueueGoldDetails] = useState<queueData[] | null>(null);
    const [queueGoldDetailsFormated, setQueueGoldDetailsFormated] = useState<queueData[] | null>(null);
    const [readyToPaidGold, setReadyToPaidGold] = useState<number>(0)
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [balance, setBalance] = useState<number[]>([0]);
    const [coinCotation, setCoinCotation] = useState<number>(0);
    const [tokensToWithdraw,setTokensToWithdraw] = useState<bigint>(0n)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    
    async function addQueueFront(tokenId: number) {
        try {
            setLoading(true);
    
            const result = await addQueue(BigInt(tokenId), BigInt(1));
    
            if (result.status === 1) { 
                setAlert("Added successfully");
                getQueueBronzeDetails();
                getQueueSilverDetails();
                getQueueGoldDetails();
            } else {
                throw new Error("Transaction failed on blockchain.");
            }
        } catch (error: any) {
            if (error.message.includes("You don't have this NFT")) {
                console.error("User does not own this NFT:", error);
                setError("You don't own this NFT");
            } else {
                console.error("Unexpected error:", error);
                setError("Something went wrong, please try again.");
            }
        } finally {
            setLoading(false); 
        }
    }
    
      

    async function doApprove() {
        try{
            setLoading(true);
            const result = await setApprovalForAll(true);
            verifyApprove();
            if(result){
                verifyApprove();
                setLoading(false);
            }
        }catch(error){
            setLoading(false);
        }
    }

    async function doClaimQueue(index:number, queueId:number){
        try{
            setLoading(true);
            const result = await claimQueue(index, queueId);
            if(result){
                setAlert("Claim Sucessful");
                getQueueBronzeDetails();
                getQueueSilverDetails();
                getQueueGoldDetails();
                setLoading(false)
            }
        }catch(error){
            setLoading(false);
            setError("Something went wrong, please try again")
        }
    }


    async function getCotation() {
        try {
          const result = await getBtc24hPrice();
          if (result) {
            setCoinCotation(Number(result)/Number(1000000));
          }
        } catch (error) {
          console.error("Failed to fetch coin price", error);
        }
      }
    async function getTokensToWithdrawF() {
        try{
            const result = await getTokensToWithdraw(address?address:"");
            setTokensToWithdraw(result);
        }catch(error){

        }
    }

    async function verifyApprove(){
        try{
            if(address){
                const result = await isApprovedNft(address, true);
                if(result){
                setIsApproved(true);
                verifyApprove();
                }
            }
        }catch(error){

        }
    }

    async function getQueueBronzeDetails() {
        try {
            const result: queueData[] = await getQueue(1); // Supondo que getQueue retorna uma lista
            setQueueBronzeDetails(result);
        } catch (error) {
            console.error("Error fetching queue details:", error);
        }
    }
    async function getQueueSilverDetails() {
        try {
            const result: queueData[] = await getQueue(2); // Supondo que getQueue retorna uma lista
            setQueueSilverDetails(result);
        } catch (error) {
            console.error("Error fetching queue details:", error);
        }
    }

    async function getQueueGoldDetails() {
        try {
            const result: queueData[] = await getQueue(3); // Supondo que getQueue retorna uma lista
            setQueueGoldDetails(result);
        } catch (error) {
            console.error("Error fetching queue details:", error);
        }
    }


    async function balanceFree() {
        try {
            // Verifica se coinCotation é válido
            if (coinCotation === undefined || coinCotation === null) {
                console.error("coinCotation ainda não foi carregado.");
                return;
            }
    
            const validCoinCotation = Number(coinCotation);
            if (isNaN(validCoinCotation)) {
                throw new Error("coinCotation não é um número válido.");
            }
    
            const results: number[] = [];
            for (let i = 0; i < 3; i++) {
                const result = await balanceToPaid(i);
                console.log("cotacao", validCoinCotation);
                if (result !== undefined && result !== null) {
                    results.push(Number(result) * validCoinCotation);
                    console.log("results: ",results[i]);
                }
            }
    
            setBalance(results); // Atualiza o estado com os resultados
        } catch (error) {
            console.error("Error in balanceFree:", error);
        }
    }
    
    /*------------------ ^^^^^^^^ END QUEUE DETAILS ^^^^^^^^ ------------*/


    useEffect(() => {
        const updateVisibleSlides = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setVisibleSlides(1);
            } else if (width <= 1024) {
                setVisibleSlides(2);
            } else {
                setVisibleSlides(3);
            }
        };
        getCotation()
        verifyApprove();
        getQueueBronzeDetails();
        getQueueSilverDetails();
        getQueueGoldDetails();
        getTokensToWithdrawF()
        
        updateVisibleSlides();
        window.addEventListener('resize', updateVisibleSlides);

        return () => {
            window.removeEventListener('resize', updateVisibleSlides);
        };
    }, []);

    useEffect(() =>{
        if(queueBronzeDetails){
            veSePaga(queueBronzeDetails, 0);
        }
        if(queueSilverDetails){
            veSePaga(queueSilverDetails, 1);
        }
        if(queueGoldDetails){
            veSePaga(queueGoldDetails, 2);
        }
    }, [queueBronzeDetails, queueSilverDetails, queueGoldDetails, balance[0], balance[1], balance[2]])

    
    useEffect(() => {
        if (coinCotation > 0) {
            balanceFree();
        }
    }, [coinCotation]);
    

    function CustomPrevArrow(props: CustomArrowProps) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} custom-prev-arrow`}
                style={{
                    ...style,
                    display: "block",
                    left: "0", // Ajuste para posicionar à esquerda do slider
                    zIndex: 10,
                }}
                onClick={onClick}
            />
        );
    }
    
    function CustomNextArrow(props: CustomArrowProps) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} custom-next-arrow`}
                style={{
                    ...style,
                    display: "block",
                    right: "0px", // Ajuste para posicionar à direita do slider
                    zIndex: 10,
                }}
                onClick={onClick}
            />
        );
    }
    

    const settings = {
        infinite: false,
        speed: 200,
        slidesToShow: visibleSlides,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    /* -------- VERIFICA SE PAGA A NFT --------------- */

    async function veSePaga(queue: queueData[], index: number) {
        // Valores fixos de pagamento
        const paymentAmounts = [20, 125, 300];
        let count = 0;
        // Use balance[index] como saldo inicial
        let currentBalance = balance[index];
    
        // Cria uma cópia para preservar a ordem original
        const queueCopy: queueData[] = [...queue];
    
        // Índices para controle da ordem (primeiro, último)
        let left = 0;
        let right = queue.length - 1;
        let toggle = true; // Alterna entre os lados da fila
    
        while (currentBalance >= paymentAmounts[index] && left <= right) {
            if (toggle) {
                // Pagar o elemento à esquerda
                if (currentBalance >= paymentAmounts[index]) {
                    queueCopy[left] = {
                        ...queueCopy[left],
                        nextPaied: true,
                    };
                    currentBalance -= paymentAmounts[index];
                    count++;
                }
                left++;
            } else {
                // Pagar o elemento à direita
                if (currentBalance >= paymentAmounts[index]) {
                    queueCopy[right] = {
                        ...queueCopy[right],
                        nextPaied: true,
                    };
                    currentBalance -= paymentAmounts[index];
                }
                count++;
                right--;
            }
            toggle = !toggle; // Alterna o lado para o próximo pagamento
        }
    
    
        // Atualiza o estado correto com base no índice
        if (index === 0) {
            setQueueBronzeDetailsFormated(queueCopy);
            setReadyToPaidBronze(count);
        } else if (index === 1) {
            setQueueSilverDetailsFormated(queueCopy);
            setReadyToPaidSilver(count);
        } else {
            setQueueGoldDetailsFormated(queueCopy);
            setReadyToPaidGold(count);
        }
    }


    const handleWithdraw = async () => {
        setLoading(true);
        setAlert(""); // Limpa mensagens anteriores
      
        const result = await withdrawTokens();
      
        if (result.success) {
          setAlert("Sucess");
        } else {
          setError(result.errorMessage);
        }
      
        setLoading(false);
      };
      /* -------------- FIM DA VERIFICACAO ------------ */
    
      async function clearError(){
        setError("");
    }
    
    async function clearAlert(){
        setAlert("");
    }
    return (
        <>
        {error && <ModalError msg={error} onClose={clearError} />}
                    {alert && <ModalSuccess msg={alert} onClose={clearAlert} />}
                    {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-14 h-14 border-t-4 border-b-4 border-[#00ff54] rounded-full animate-spin"></div>
                    </div>
                    )}
            <div className="lg:w-[98%] w-[90%] max-w-[1480px] flex flex-col items-center overflow-hidden">
                {/* Header */}
                <div className="lg:w-[70%] w-[90%] h-[130px] flex mt-[60px] justify-center items-center relative text-black">
                    
                    <img
                        alt="banner"
                        srcSet="images/mobile_bunner_queue.png 480w,
                                images/mobile_bunner_queue.png 768w,
                                images/bunner_queue.png 1200w"
                        sizes="(max-width: 480px) 100vw, 
                                (max-width: 1000px) 70vw, 
                                50vw"
                        className="absolute w-full h-auto"
                    />
                    <p className="relative font-bold lg:text-[22px] text-[16px]">BTC24H PAYMENT QUEUE</p>
                </div>

                {/* Main Content */}
                <div className="w-[98%] mt-[30px] mb-[100px] flex flex-col items-center space-y-8">


                    {/* ------------------ QUEUE GOLD --------------------- */}
                    <div className="flex mt-[30px] flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_gold.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>

                           
                                <p className="text-[#ffc100]">{balance[2]?.toFixed(2) || 0}$</p>
                           
                            {readyToPaidGold >= 10 && queueGoldDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueGoldDetailsFormated[0].index), 3)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            
                            {isApproved?(
                            <button onClick={() => addQueueFront(3)} className="w-[150px] p-2 bg-[#cbc622] hover:scale-105 transition-all duration-300 rounded-3xl text-black mt-[10px]">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl hover:scale-105 transition-all duration-300 text-black mt-[10px]">
                                Approve
                            </button>
                            )}
                            
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider {...settings}>
                            {queueGoldDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 300$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                        </div>
                    </div>

                    {/* ------------------ QUEUE SILVER --------------------- */}
                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_silver.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{balance[1]?.toFixed(2) || 0}$</p>
                            {readyToPaidSilver >= 10 && queueSilverDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueSilverDetailsFormated[0].index), 2)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            
                            {isApproved?(
                            <button onClick={() => addQueueFront(2)} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider {...settings}>
                                {queueSilverDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 125$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                        </div>
                    </div>

                    {/* ------------------ QUEUE BRONZE --------------------- */}

                    <div className="flex flex-col lg:flex-row w-[90%] max-w-[1400px] items-center justify-between p-4 bg-white bg-opacity-10 rounded-3xl space-y-4 lg:space-y-0 lg:space-x-4">
                        {/* Image */}
                        <div className="lg:w-[25%] md:w-[50%] w-[30%] flex items-center justify-center">
                            <img
                                src={`images/queue_bronze.png`}
                                className="w-full h-auto"
                                alt={`QueueBronze`}
                            />
                        </div>

                        {/* Balance and Action */}
                        <div className="lg:w-[15%] w-[40%] flex flex-col items-center text-center">
                            <p>Balance to Paid:</p>
                            <p className="text-[#ffc100]">{balance[0]?.toFixed(2) || 0}$</p>
                            {readyToPaidBronze >= 10 && queueBronzeDetailsFormated?(
                                <button onClick={() => doClaimQueue(Number(queueBronzeDetailsFormated[0].index), 1)} className="w-[150px] p-2 bg-[#00ff54] rounded-3xl text-black mt-[10px] hover:bg-[#00D837] hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            ):(
                                <button className="w-[150px] p-2 cursor-not-allowed bg-gray-400 rounded-3xl text-black mt-[10px] hover:bg-gray-500 hover:scale-105 transition-all duration-300">
                                Distribute
                                </button>
                            )}
                            {isApproved?(
                            <button onClick={() => addQueueFront(1)} className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px]  hover:scale-105 transition-all duration-300">
                                Add Nft
                            </button>
                            ):(
                            <button onClick={doApprove}  className="w-[150px] p-2 bg-[#cbc622] rounded-3xl text-black mt-[10px] hover:scale-105 transition-all duration-300">
                                Approve
                            </button>
                            )}
                        </div>

                        {/* Carousel */}
                        <div className="lg:w-[60%] p-4 md:max-w-[480px] md:w-[96%] w-[84%] bg-white bg-opacity-10 rounded-3xl relative overflow-hidden">
                            <Slider {...settings}>
                            {queueBronzeDetailsFormated?.map((data, index) => (
                                    data.nextPaied === true?(
                                        <div
                                        key={index}
                                        className="border-2 border-green-500 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    ):data.user.toLowerCase() === address?.toLowerCase()?(
                                        <div
                                        key={index}
                                        className="border-2 border-blue-600 p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    ):(
                                        <div
                                        key={index}
                                        className=" p-4 sm:text-[12px] text-[16px] flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-md"
                                        >
                                        <p>User: {data.user.slice(0,6)+"..."+data.user.slice(-4)}</p>
                                        <p>Position: {index+1}</p>
                                        <p>Received: 20$</p>
                                        </div>
                                    )
                                    
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className='w-[96%]  bg-white bg-opacity-5 flex items-center p-6 flex-col'>
                        <p className='text-3xl font-bold'>You have to withdraw: </p>
                        <p>When your nft's generate rewards, you can see them here</p>
                        <p className='font-bold text-3xl mt-[5px]'>{tokensToWithdraw? tokensToWithdraw : ' 0'} BTC24H</p>
                        {tokensToWithdraw >= 0?(
                            <button onClick={handleWithdraw} className='text-black  font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl bg-[#00ff54] hover:w-[210px] duration-100'>Claim</button>
                        ):(
                            <button className='text-black cursor-not-allowed bg-gray-400 font-bold text-[22px] mt-[15px] mb-[20px] p-4 w-[200px] rounded-2xl'>Claim</button>
                        )}
                        
                    </div>
                </div>

            </div>
            {
                tokensToWithdraw>0 ?             <ModalTokensToWithdraw tokens={tokensToWithdraw}></ModalTokensToWithdraw>
                :""
            }
            <Footer />
        </>
    );
}

export default withAuthGuard(Page1);
