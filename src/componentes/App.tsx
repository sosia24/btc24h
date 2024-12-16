"use client";
import React, { useEffect, useState } from 'react';

interface TokenDayData {
  date: string;
  priceUSD: string;
}

const TokenChart: React.FC = () => {
  const [data, setData] = useState<TokenDayData[] | null>(null);

  useEffect(() => {
    const tokenAddress = '0x8E60D47Ec05dAe2Bd723600c2B3CD8321D775d22'; // Endereço do token que você quer buscar

    // Chama o proxy para buscar os dados
    fetch('../api/proxy/uniswap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tokenAddress }), // Certifique-se de passar o tokenAddress corretamente
    })
      .then((response) => response.json())
      .then((tokenData) => {
        setData(tokenData); // Atualiza o estado com os dados retornados
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // O useEffect será chamado apenas uma vez, ao montar o componente

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Token Price Over the Last 7 Days</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            Date: {item.date}, Price (USD): {item.priceUSD}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenChart;
