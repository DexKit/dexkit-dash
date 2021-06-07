import {ZRX_API_URL} from 'shared/constants/AppConst';
import {OrderSide} from 'types/app';

import {EthereumNetwork} from 'shared/constants/AppEnums';

import {QuoteParams, SwapQuoteResponse} from './types';

/**
 * Fetch quote right before confirm, with final validation
 * @param quoteParams
 */
export async function fetchQuote(
  quoteParams: QuoteParams,
  network: EthereumNetwork,
): Promise<SwapQuoteResponse> {
  const params = new Map<string, string>();

  const isSell = quoteParams.orderSide === OrderSide.Sell ? true : false;

  const currency = network === EthereumNetwork.ethereum ? 'ETH' : 'BNB';

  const wrapper = network === EthereumNetwork.ethereum ? 'WETH' : 'WBNB';

  const baseName = quoteParams.baseToken.symbol.toUpperCase();
  const quoteName = quoteParams.quoteToken.symbol.toUpperCase();

  const baseTokenAddress =
    baseName === wrapper || baseName === currency
      ? currency
      : quoteParams.baseToken.address;
  const quoteTokenAddress =
    quoteName === wrapper || quoteName === currency
      ? currency
      : quoteParams.quoteToken.address;

  const sellTokenAddress = isSell ? baseTokenAddress : quoteTokenAddress;
  const buyTokenAddress = isSell ? quoteTokenAddress : baseTokenAddress;

  const currencyAmount = quoteParams.makerAmount;

  params.set('sellToken', sellTokenAddress);
  params.set('buyToken', buyTokenAddress);

  if (isSell) {
    params.set('sellAmount', currencyAmount.toFixed(0));
  } else {
    params.set('buyAmount', currencyAmount.toFixed(0));
  }

  if (quoteParams.ethAccount) {
    params.set('takerAddress', quoteParams.ethAccount);
  }

  if (quoteParams.allowedSlippage) {
    // params.set('slippagePercentage', quoteParams.allowedSlippage.div(10000).toString())
    params.set('slippagePercentage', quoteParams.allowedSlippage.toString());
  }

  if (quoteParams.feeRecipient) {
    params.set('feeRecipient', quoteParams.feeRecipient);
  }

  if (quoteParams.buyTokenPercentage) {
    params.set('buyTokenPercentageFee', quoteParams.buyTokenPercentage);
  }

  if (quoteParams.affiliateAddress) {
    params.set('affiliateAddress', quoteParams.affiliateAddress);
  }

  if (quoteParams.intentOnFill) {
    params.set('intentOnFilling', 'true');
    params.set('skipValidation', 'false');
  } else {
    params.set('skipValidation', 'true');
  }

  let url = ZRX_API_URL(quoteParams.chainId) + '/swap/v1/quote?';

  for (let [key, value] of params) {
    url += `${key}=${value}&`;
  }

  const quote = await fetch(url);

  const json = await quote.json();

  if (json.code) {
    throw new Error(json.reason||json.message||'ERROR');
  } else {
    return json;
  }
}
