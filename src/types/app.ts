import {BigNumber} from '@0x/utils';
import {
  GetTransactionList_ethereum_sender_block,
  GetTransactionList_ethereum_sender_currency,
  GetTransactionList_ethereum_sender_receiver,
  GetTransactionList_ethereum_sender_sender,
  GetTransactionList_ethereum_sender_transaction,
} from 'services/graphql/bitquery/history/__generated__/GetTransactionList';

import {
  GetOrderList_ethereum_maker_baseCurrency,
  GetOrderList_ethereum_maker_block,
  GetOrderList_ethereum_maker_exchange,
  GetOrderList_ethereum_maker_quoteCurrency,
  GetOrderList_ethereum_maker_smartContract,
  GetOrderList_ethereum_maker_transaction,
} from 'services/graphql/bitquery/history/__generated__/GetOrderList';
import {Network, TradeSide} from '../../__generated__/globalTypes';

import {ChainId} from './blockchain';
import {
  GetAMMPairExplorer_ethereum_dexTrades_baseCurrency,
  GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency,
} from 'services/graphql/bitquery/protocol/__generated__/GetAMMPairExplorer';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GetTransferList_ethereum_transfers} from 'services/graphql/bitquery/history/__generated__/GetTransferList';

export enum OrderSide {
  Sell,
  Buy,
  Offer,
}

export enum Steps {
  APPROVE = 'Approval',
  APPROVE_WRAPPER = 'Approval Wrapper',
  CONVERT = 'Conversion',
  MARKET = 'Market',
  LIMIT = 'Limit',
  ERROR = 'Error',
  DONE = 'Done',
}

export type Transfers = GetTransferList_ethereum_transfers & {
  type: 'Send' | 'Receive';
};

export interface Token {
  name: string;
  symbol: string;
  address: string;
  networkName?: EthereumNetwork;
  decimals: number;
  displayDecimals?: 4;
  icon?: string;
  price_usd?: BigNumber;
  price_usd_24h_change?: BigNumber;
  coingecko_id?: string;
  chainId?: ChainId;
  logoURI?: string;
}


export interface Coin {
  name: string;
  symbol: string;
  address: string;
  networkName?: Network;
  decimals: number;
  displayDecimals?: 4;
  icon?: string;
  price_usd?: BigNumber;
  price_usd_24h_change?: BigNumber;
  coingecko_id?: string;
  chainId?: ChainId;
  logoURI?: string;
  isCoin: boolean;
  changelly_support: boolean;
  changelly_id: string;
}

export interface CoinData {
  name: string;
  symbol: string;
  networkName?: Network;
  decimals: number;
  displayDecimals?: 4;
  icon?: string;
  price_usd?: BigNumber;
  price_usd_24h_change?: BigNumber;
  coingecko_id?: string;
  logoURI: string;
}

export interface TokenBalance {
  balance: BigNumber;
  approved: BigNumber;
  token: Token;
}

export interface GasInfo {
  gasPriceInWei: BigNumber;
  estimatedTimeMs: number;
}

export interface ITransactionList {
  block: GetTransactionList_ethereum_sender_block | null;
  sender: GetTransactionList_ethereum_sender_sender | null;
  receiver: GetTransactionList_ethereum_sender_receiver | null;
  currency: GetTransactionList_ethereum_sender_currency | null;
  amount: number | null;
  amountInUsd: number | null;
  transaction: GetTransactionList_ethereum_sender_transaction | null;
  external: boolean | null;
  type: string;
}

export interface IOrderList {
  block: GetOrderList_ethereum_maker_block | null;
  tradeIndex: string | null;
  protocol: string | null;
  transaction: GetOrderList_ethereum_maker_transaction | null;
  exchange: GetOrderList_ethereum_maker_exchange | null;
  smartContract: GetOrderList_ethereum_maker_smartContract | null;
  side: TradeSide | null;
  baseAmount: number | null;
  baseAmountInUsd: number | null;
  baseCurrency: GetOrderList_ethereum_maker_baseCurrency | null;
  quotePrice: number | null;
  quoteAmount: number | null;
  quoteAmountInUsd: number | null;
  quoteCurrency: GetOrderList_ethereum_maker_quoteCurrency | null;
  tradeAmount: number | null;
  tradeAmountIsUsd: number | null;
}

export interface MintBurn {
  baseCurrency: GetAMMPairExplorer_ethereum_dexTrades_baseCurrency;
  quoteCurrency: GetAMMPairExplorer_ethereum_dexTrades_quoteCurrency;
  hash: string;
  block: number;
  type: string;
  time: string;
  amount0: number;
  amount1: number;
  reserve0: number;
  reserve1: number;
  variation: number;
}

export interface ChartTick {
  date: Date;
  value: number;
}
