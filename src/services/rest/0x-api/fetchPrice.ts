import {ZRX_API_URL, ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {OrderSide} from 'types/app';

import {EthereumNetwork} from 'shared/constants/AppEnums';

import {QuotePriceParams, SwapQuoteResponse} from './types';

/**
 * Fetch quote right before confirm, with final validation
 * @param quoteParams
 */
export async function fetchPrice(
  quoteParams: QuotePriceParams,
  network: EthereumNetwork,
): Promise<SwapQuoteResponse> {
  const params = new Map<string, string>();

  const isSell = quoteParams.orderSide === OrderSide.Sell ? true : false;

  const currency = network === EthereumNetwork.ethereum ? 'ETH' : 'BNB';

  const wrapper = network === EthereumNetwork.ethereum ? 'WETH' : 'WBNB';

  const baseName = quoteParams.baseToken.toUpperCase();
  const quoteName = quoteParams.quoteToken.toUpperCase();

  const baseTokenAddress =
    baseName === wrapper || baseName === currency
      ? currency
      : baseName.toLowerCase();
  const quoteTokenAddress =
    quoteName === wrapper || quoteName === currency
      ? currency
      : quoteName.toLowerCase();

  const sellTokenAddress = isSell ? baseTokenAddress : quoteTokenAddress;
  const buyTokenAddress = isSell ? quoteTokenAddress : baseTokenAddress;

  const currencyAmount = quoteParams.baseAmount;

  params.set('sellToken', sellTokenAddress);
  params.set('buyToken', buyTokenAddress);

  if (isSell) {
    params.set('sellAmount', currencyAmount.toFixed(0));
  } else {
    params.set('buyAmount', currencyAmount.toFixed(0));
  }

  if (quoteParams.gasPrice) {
    params.set('gasPrice', quoteParams.gasPrice);
  }

  if (quoteParams.allowedSlippage) {
    // params.set('slippagePercentage', quoteParams.allowedSlippage.div(10000).toString())
    params.set('slippagePercentage', quoteParams.allowedSlippage.toString());
  }

  let url = ZRX_API_URL_FROM_NETWORK(network) + '/swap/v1/price?';

  for (const [key, value] of params) {
    url += `${key}=${value}&`;
  }

  const quote = await fetch(url);

  const json = await quote.json();

  if (json.code) {
    throw new Error(json.reason || json.message || 'ERROR');
  } else {
    return json;
  }
}
