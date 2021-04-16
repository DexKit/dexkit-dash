
import { ZEROX_API_URL } from 'shared/constants/AppConst';
import { OrderSide } from 'types/app';

import { QuoteParams, SwapQuoteResponse } from './types';

/**
 * Fetch quote right before confirm, with final validation
 * @param quoteParams
 */
export async function fetchQuote(quoteParams: QuoteParams): Promise<SwapQuoteResponse> {
    const isSell = quoteParams.orderSide === OrderSide.Sell ? true : false;

    const baseTokenAddress = quoteParams.baseToken.symbol.toUpperCase() === 'WETH' ? 'ETH' : quoteParams.baseToken.address;
    const quoteTokenAddress = quoteParams.quoteToken.symbol?.toUpperCase() === 'WETH' ? 'ETH' : quoteParams.quoteToken.address;

    const sellTokenAddress = isSell ? baseTokenAddress : quoteTokenAddress;
    const buyTokenAddress = isSell ? quoteTokenAddress : baseTokenAddress;

    const currencyAmount = quoteParams.makerAmount;
    const amount = isSell ? `sellAmount=${currencyAmount.toFixed(0)}` : `buyAmount=${currencyAmount.toFixed(0)}`;
    const allowedSlippage = quoteParams.allowedSlippage.div(10000).toString();
    const takerAddressString = quoteParams.ethAccount ? `&takerAddress=${quoteParams.ethAccount}` : '';
    const buyTokenPercentageFee = quoteParams.buyTokenPercentage;
    const affiliateAddress = quoteParams.affiliateAddress;
    const feeRecipient = quoteParams.feeRecipient;
    let intentOnFill = '';
    if (quoteParams.intentOnFill) {
      intentOnFill = `&intentOnFilling=true&skipValidation=false`;
    } else {
      intentOnFill = '&skipValidation=true';
    }

    const quoteResponse = await fetch(
        `${ZEROX_API_URL(quoteParams.chainId)}?sellToken=${sellTokenAddress}&buyToken=${buyTokenAddress}&${amount}&feeRecipient=${feeRecipient}&buyTokenPercentageFee=${buyTokenPercentageFee}&affiliateAddress=${affiliateAddress}${takerAddressString}&slippagePercentage=${allowedSlippage}${intentOnFill} `,
      ).then(r => {
        if (r.status === 200) {
          return r.json() as unknown as SwapQuoteResponse;
        } else {
          throw Error('Swap will fail. Do you have enough ETH for the transaction? Leave at least 0.03 ETH on your wallet for swaps. Contact support if error persists');
        }
    });

    return quoteResponse;
}