import {BigNumber, fromTokenUnitAmount} from '@0x/utils';
import {useEffect, useState} from 'react';
import {fetchPrice} from 'services/rest/0x-api/fetchPrice';
import {QuotePriceParams, SwapQuoteResponse} from 'services/rest/0x-api/types';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {OrderSide} from 'types/app';

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
) => {
  const [priceQuote, setPriceQuote] = useState<SwapQuoteResponse>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (address && amount && network && decimals) {
      const amountAPI = fromTokenUnitAmount(amount, decimals);
      const quote: QuotePriceParams = {
        baseToken: address.toLowerCase(),
        quoteToken: 'USDC',
        orderSide: side === OrderSide.Sell ? OrderSide.Sell : OrderSide.Buy,
        baseAmount: amountAPI,
      };
      setLoading(true);
      fetchPrice(quote, network)
        .then((p) => setPriceQuote(p))
        .catch(console.log)
        .finally(() => setLoading(false));
    }
  }, [address, network, amount, side, refresh, decimals]);

  return {priceQuote, loading};
};
