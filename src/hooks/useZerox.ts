import { useEffect } from 'react';
import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { AssetProxyId, APIOrder } from '@0x/types';
import { ZRX_API_URL } from 'shared/constants/AppConst';
import { useWeb3 } from './useWeb3';
import { QuoteParams, SwapQuoteResponse } from 'types/zerox';
import { OrderSide } from 'types/app';

export const useZerox = () => {
  const {chainId} = useWeb3();
  
  let api: string

  useEffect(() => {
    api = ZRX_API_URL(chainId);
  }, [chainId]);


  const getOrdersERC20 = (address: string) => {

  }

  const fetchQuote = async (quoteParams: QuoteParams): Promise<SwapQuoteResponse> => {
    const params = new Map<string, string>();

    const isSell = quoteParams.orderSide === OrderSide.Sell ? true : false;

    const baseTokenAddress  = quoteParams.baseToken.symbol.toUpperCase()  === 'WETH' ? 'ETH' : quoteParams.baseToken.address;
    const quoteTokenAddress = quoteParams.quoteToken.symbol.toUpperCase() === 'WETH' ? 'ETH' : quoteParams.quoteToken.address;

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

    let url = api+'/swap/v1/quote?';

    for (let [key, value] of params) {
      url += `${key}=${value}&`;
    }

    console.log(url);
    
    try {
      const quote = await fetch(url);
      return (await quote.json())
      
    } catch (e) {
      console.log()
      throw new Error('Swap will fail. Do you have enough ETH for the transaction? Leave at least 0.03 ETH on your wallet for swaps. Contact support if error persists');
    }

    // const quoteResponse = await fetch(url).then(r => {
    //   if (r.status === 200) {
    //     return r.json()
    //       .then(e => e)
    //       .catch(e => {          
    //         console.log(e);
    //         throw Error('Swap will fail. Do you have enough ETH for the transaction? Leave at least 0.03 ETH on your wallet for swaps. Contact support if error persists');
    //       })      
    //     // as unknown as SwapQuoteResponse;
    //   } else {
    //     throw Error('Swap will fail. Do you have enough ETH for the transaction? Leave at least 0.03 ETH on your wallet for swaps. Contact support if error persists');
    //   }
    // });
  }

  return { fetchQuote }
}