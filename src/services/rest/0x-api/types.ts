import {SignedOrder} from '@0x/types';
import {BigNumber} from '@0x/utils';
import {OrderSide, Token} from 'types/app';
import {ChainId} from 'types/blockchain';

export interface SwapQuoteResponse
  extends SwapQuoteResponsePartialTransaction,
    SwapQuoteResponsePrice {
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
  isMarket?: boolean;
  chainId: number | ChainId;
  baseToken: Token;
  quoteToken: Token;
  orderSide: OrderSide;
  makerAmount: BigNumber;
  // Parameters used to prevalidate quote at final
  allowedSlippage: number;
  ethAccount: string | null | undefined;
  buyTokenPercentage: string | undefined;
  feeRecipient: string | undefined;
  affiliateAddress: string | undefined;
  intentOnFill: boolean;
  gasPrice?: string;
}

/**
 * Quote Params
 */
export interface QuotePriceParams {
  baseToken: string;
  quoteToken: string;
  orderSide: OrderSide;
  baseAmount: BigNumber;
  // Parameters used to prevalidate quote at final
  allowedSlippage?: number;
  gasPrice?: string;
}
