import { useQuery } from 'react-query';
import { getBinanceTokens, getEthereumTokens, getMaticTokens } from 'services/rest/tokens';


const staleTime24Hours = 60*60*24*10;
/**
 * 
 * @returns eth and binance tokens
 */
export const useTokenLists = () => {
  // This data not change often so we consider here staleTime like 24 hours
  const binanceQuery = useQuery('GetBinanceTokens', getBinanceTokens, {staleTime: staleTime24Hours});
  const ethereumQuery = useQuery('GetEthereumTokens', getEthereumTokens, {staleTime: staleTime24Hours});
  const maticQuery = useQuery('GetMaticTokens', getMaticTokens, {staleTime: staleTime24Hours});
  return {ethTokens: ethereumQuery.data, binanceTokens: binanceQuery.data, maticTokens: maticQuery.data}
};
