
import { ZEROX_API_URL } from 'shared/constants/AppConst';
import { OrderSide } from 'types/app';

import { QuoteParams, SwapQuoteResponse } from './types';

/**
 * Fetch quote right before confirm, with final validation
 * @param quoteParams
 */
export async function fetchQuote(quoteParams: QuoteParams): Promise<SwapQuoteResponse> {

  const params = new Map<string, string>();

  const isSell = quoteParams.orderSide === OrderSide.Sell ? true : false;

  const baseTokenAddress  = quoteParams.baseToken.symbol.toUpperCase()   === 'WETH' ? 'ETH' : quoteParams.baseToken.addresses[quoteParams.chainId];
  const quoteTokenAddress = quoteParams.quoteToken.symbol?.toUpperCase() === 'WETH' ? 'ETH' : quoteParams.quoteToken.addresses[quoteParams.chainId];

  const sellTokenAddress = isSell ? baseTokenAddress  : quoteTokenAddress;
  const buyTokenAddress  = isSell ? quoteTokenAddress : baseTokenAddress;

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
    params.set('slippagePercentage', quoteParams.allowedSlippage.div(10000).toString())
  }

  if (quoteParams.feeRecipient) {
    params.set('feeRecipient', quoteParams.feeRecipient);
  }

  if (quoteParams.buyTokenPercentage) {
    params.set('buyTokenPercentageFee', quoteParams.buyTokenPercentage);
  }

  if (quoteParams.affiliateAddress) {
    params.set('affiliateAddress', quoteParams.affiliateAddress)
  }

  if (quoteParams.intentOnFill) {
    params.set('intentOnFilling', 'true');
    params.set('skipValidation', 'false');
  } else {
    params.set('skipValidation', 'true');
  }


  let url = ZEROX_API_URL(quoteParams.chainId)+'?';

  for (let [key, value] of params) {
    url += `${key}=${value}&`;
  }

  const quoteResponse = await fetch(url).then(r => {
    if (r.status === 200) {
      return r.json() as unknown as SwapQuoteResponse;
    } else {
      throw Error('Swap will fail. Do you have enough ETH for the transaction? Leave at least 0.03 ETH on your wallet for swaps. Contact support if error persists');
    }
  });

  return quoteResponse;
}