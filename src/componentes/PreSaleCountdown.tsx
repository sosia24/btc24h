import { useState, useEffect } from 'react';

const PreSaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const targetDate = new Date('2024-12-13T00:00:00Z').getTime(); // Data de término da pré-venda
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = targetDate - currentTime;

      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="bg-black bg-opacity-50 sm:p-8 p-4 rounded-lg shadow-2xl text-center mb-8">
      <h3 className="text-3xl font-semibold text-white mb-6">Contagem Regressiva para o Fim da Pré-Venda</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-6 md:gap-8">
        {/* Cartões para dias */}
        <div className="bg-gradient-to-r sm:h-[100px] h-[60px] from-blue-500 via-purple-500 to-pink-500 text-white sm:p-4 p-2 rounded-lg shadow-lg w-[70px] sm:w-[80px] md:w-[110px]">
          <h4 className="md:text-[16px]  text-[12px] font-bold">Dias</h4>
          <p className="md:text-3xl text-[16px] font-extrabold">{days}</p>
        </div>

        {/* Cartões para horas */}
        <div className="bg-gradient-to-r sm:h-[100px] h-[60px] from-blue-500 via-purple-500 to-pink-500 text-white sm:p-4 p-2 rounded-lg shadow-lg w-[70px] sm:w-[80px] md:w-[110px]">
          <h4 className="md:text-[16px] text-[12px] font-bold">Horas</h4>
          <p className="md:text-3xl text-[16px] font-extrabold">{hours}</p>
        </div>

        {/* Cartões para minutos */}
        <div className="bg-gradient-to-r sm:h-[100px] h-[60px] from-blue-500 via-purple-500 to-pink-500 text-white sm:p-4 p-2 rounded-lg shadow-lg w-[70px] sm:w-[80px] md:w-[110px]">
          <h4 className="md:text-[16px]  text-[12px] font-bold">Minutos</h4>
          <p className="md:text-3xl text-[16px] font-extrabold">{minutes}</p>
        </div>

        {/* Cartões para segundos */}
        <div className="bg-gradient-to-r sm:h-[100px] h-[60px] from-green-500 via-green-700 to-green-900 text-white sm:p-4 p-2 rounded-lg shadow-lg w-[70px] sm:w-[80px] md:w-[110px]">
          <h4 className="md:text-[16px] text-[12px] font-bold">Segundos</h4>
          <p className="md:text-3xl text-[16px] font-extrabold">{seconds}</p>
        </div>
      </div>
    </div>
  );
};

export default PreSaleCountdown;
