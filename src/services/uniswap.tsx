// services/uniswap.ts
import { request, gql } from 'graphql-request';

// URL do Uniswap Subgraph
const UNISWAP_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

// Tipos para a resposta da API
export interface TokenDayData {
  date: string;
  priceUSD: string;
}

interface FetchTokenDayDataResponse {
  tokenDayDatas: TokenDayData[];
}

// Função para buscar preços diários de um token
const fetchTokenDayData = async (tokenAddress: string): Promise<TokenDayData[]> => {
  const query = gql`
    {
      tokenDayDatas(first: 7, where: { token: "${tokenAddress.toLowerCase()}" }, orderBy: date, orderDirection: desc) {
        date
        priceUSD
      }
    }
  `;

  const data = await request<FetchTokenDayDataResponse>(UNISWAP_SUBGRAPH_URL, query);
  return data.tokenDayDatas;
};

export default fetchTokenDayData;
