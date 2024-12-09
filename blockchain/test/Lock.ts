import JSBI from 'jsbi';
import { BigintIsh, sqrt } from '@uniswap/sdk-core';

/**
 * Retorna a raiz quadrada da razão como Q64.96 correspondente à razão entre amount1 e amount0.
 * @param amount1 O numerador, representando a quantidade de token1.
 * @param amount0 O denominador, representando a quantidade de token0.
 * @returns A razão em sqrt
 */
export function encodeSqrtRatioX96(amount1: BigintIsh, amount0: BigintIsh): JSBI {
  const numerator = JSBI.leftShift(JSBI.BigInt(amount1), JSBI.BigInt(192));
  const denominator = JSBI.BigInt(amount0);
  const ratioX192 = JSBI.divide(numerator, denominator);
  return sqrt(ratioX192);
}

// Valores fornecidos
const amount1 = JSBI.BigInt((100000n * 10n ** 18n).toString()); // 18 decimais
const amount0 = JSBI.BigInt((55100n * 10n ** 18n).toString()); // 18 decimais

// Chamando a função com os valores fornecidos
const result = encodeSqrtRatioX96(amount1, amount0);
console.log(result.toString());
