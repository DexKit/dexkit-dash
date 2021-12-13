import {fromTokenUnitAmount} from '@0x/utils';

import {useQuery} from 'react-query';
import {fetchPrice} from 'services/rest/0x-api/fetchPrice';
import {QuotePriceParams} from 'services/rest/0x-api/types';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {OrderSide} from 'types/app';
import {ChainId} from 'types/blockchain';

/**
 * Fetch price in real time
 * @param address
 * @param network
 * @param side
 * @param amount
 * @param decimals
 * @param refresh
 * @returns
 */
export const useTokenPriceUSD = (
  address?: string,
  network?: EthereumNetwork,
  side?: OrderSide,
  amount?: number,
  decimals?: number,
  refresh?: boolean,
  chainId?: ChainId,
) => {
  const swapQuoteResponse = useQuery(
    [
      'GetUSDPriceZRXApi',
      address,
      amount,
      network,
      decimals,
      refresh,
      side,
      chainId,
    ],
    () => {
      if (address && amount && network && decimals) {
        const amountAPI = fromTokenUnitAmount(amount, decimals);
        const quote: QuotePriceParams = {
          baseToken: address.toLowerCase(),
          quoteToken: 'USDC',
          orderSide: side === OrderSide.Sell ? OrderSide.Sell : OrderSide.Buy,
          baseAmount: amountAPI,
        };
        return fetchPrice(quote, network, chainId);
      }
    },
  );

  return {
    priceQuote: swapQuoteResponse.data,
    loading: swapQuoteResponse.isLoading,
    error: swapQuoteResponse.error,
  };
};
