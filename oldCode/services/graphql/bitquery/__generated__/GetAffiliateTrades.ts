/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAffiliateTrades
// ====================================================

export interface GetAffiliateTrades_ethereum_transfers_currency {
  __typename: "Currency";
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

export interface GetAffiliateTrades_ethereum_transfers {
  __typename: "EthereumTransfers";
  amountUSD: number | null;
  amount: number | null;
  /**
   * Currency of transfer
   */
  currency: GetAffiliateTrades_ethereum_transfers_currency | null;
  count: number | null;
}

export interface GetAffiliateTrades_ethereum {
  __typename: "Ethereum";
  /**
   * Currency Transfers
   */
  transfers: GetAffiliateTrades_ethereum_transfers[] | null;
}

export interface GetAffiliateTrades {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetAffiliateTrades_ethereum | null;
}

export interface GetAffiliateTradesVariables {
  network: EthereumNetwork;
  sender: string;
  receiver: string;
  from?: any | null;
  till?: any | null;
}
