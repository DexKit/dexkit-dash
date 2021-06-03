import { SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { OrderSide, Token } from 'types/app';


export interface SwapQuoteResponse extends SwapQuoteResponsePartialTransaction, SwapQuoteResponsePrice {
    gasPrice: string;
    protocolFee: string;
    minimumProtocolFee: string;
    orders: SignedOrder[];
    buyAmount: string;
    sellAmount: string;
    buyTokenAddress: string;
    sellTokenAddress: string;
    sources: GetSwapQuoteResponseLiquiditySource[];
    from?: string;
    gas: string;
    estimatedGas: string;
    estimatedGasTokenRefund: string;
    allowanceTarget?: string;
   // quoteReport?: QuoteReport;
}

export interface SwapQuoteResponsePartialTransaction {
    to: string;
    data: string;
    value: string;
    decodedUniqueId: string;
}

export interface SwapQuoteResponsePrice {
    price: string;
    guaranteedPrice: string;

}

export interface GetSwapQuoteResponseLiquiditySource {
  name: string;
  proportion: string;
  intermediateToken?: string;
  hops?: string[];
}

/**
 * Quote Params
 */
export interface QuoteParams {
  baseToken: Token;
  quoteToken: Token;
  orderSide: OrderSide;
  makerAmount: BigNumber;
  // Parameters used to prevalidate quote at final
  allowedSlippage: BigNumber;
  ethAccount: string | null | undefined;
  buyTokenPercentage: string | undefined;
  feeRecipient: string | undefined;
  affiliateAddress: string | undefined;
  intentOnFill: boolean;
}

export interface BuildLimitOrderParams {
  account: string;
  amount: BigNumber;
  baseToken: Token;
  exchangeAddress: string;
  price: BigNumber;
  quoteToken: Token;
}