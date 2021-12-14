/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTotalAffiliateTrades
// ====================================================

export interface GetTotalAffiliateTrades_ethereum_transfers_currency {
  __typename: 'Currency';
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetTotalAffiliateTrades_ethereum_transfers {
  __typename: 'EthereumTransfers';
  amountUSD: number | null;
  amount: number | null;
  /**
   * Currency of transfer
   */
  currency: GetTotalAffiliateTrades_ethereum_transfers_currency | null;
  count: number | null;
}

export interface GetTotalAffiliateTrades_ethereum {
  __typename: 'Ethereum';
  /**
   * Currency Transfers
   */
  transfers: GetTotalAffiliateTrades_ethereum_transfers[] | null;
}

export interface GetTotalAffiliateTrades {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTotalAffiliateTrades_ethereum | null;
}

export interface GetTotalAffiliateTradesVariables {
  network: EthereumNetwork;
  sender: string;
  receiver: string;
  from?: any | null;
  till?: any | null;
  tradeAmount?: number | null;
}
