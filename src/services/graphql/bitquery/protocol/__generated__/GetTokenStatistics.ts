/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTokenStatistics
// ====================================================

export interface GetTokenStatistics_ethereum_transfers_currency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
}

export interface GetTokenStatistics_ethereum_transfers {
  __typename: "EthereumTransfers";
  /**
   * Currency of transfer
   */
  currency: GetTokenStatistics_ethereum_transfers_currency | null;
  median: number | null;
  average: number | null;
  amount: number | null;
  count: number | null;
  days: number | null;
  sender_count: number | null;
  receiver_count: number | null;
  min_date: string | null;
  max_date: string | null;
}

export interface GetTokenStatistics_ethereum {
  __typename: "Ethereum";
  /**
   * Currency Transfers
   */
  transfers: GetTokenStatistics_ethereum_transfers[] | null;
}

export interface GetTokenStatistics {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTokenStatistics_ethereum | null;
}

export interface GetTokenStatisticsVariables {
  network: EthereumNetwork;
  address: string;
  from?: any | null;
  till?: any | null;
}
