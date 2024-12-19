import { useState, useEffect } from 'react';

// Função para calcular o tempo restante
const calculateTimeLeft = (targetDate: string) => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return "Expired";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${days}D:${hours}H:${minutes}M:${seconds}S`;
};

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calcula a contagem regressiva a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Limpeza do intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div>
      <p className='bg-gradient-to-r from-[#0d56df] to-[#299508] text-transparent bg-clip-text font-semibold text-[50px] sm:text-[30px] mb-[30px] '>{timeLeft}</p>
    </div>
  );
};

export default Countdown;
