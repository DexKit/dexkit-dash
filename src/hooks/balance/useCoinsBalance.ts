import { useQuery } from 'react-query';
import { COINS_SERVICE } from 'services/coins';
import { useDefaultCoinsAddress } from 'hooks/coins/useDefaultCoinsAddress';

// Get balance from Coins directly from API
export const useCoinsBalance = () => {
  const {btcAddress} = useDefaultCoinsAddress();

  const {data: btcBalance} = useQuery(['GetBTCBalance', btcAddress], () => btcAddress ?  COINS_SERVICE['bitcoin'].getBalance(btcAddress as string) : undefined );

  return {
    btc: {
      ...COINS_SERVICE['bitcoin'].getCoinData(),
      balance: btcBalance,
    }
  }

  
};
