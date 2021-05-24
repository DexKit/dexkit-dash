/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTotalContractOrders
// ====================================================

export interface GetTotalContractOrders_ethereum_dexTrades {
  __typename: "EthereumDexTrades";
  totalTrades: number | null;
}

export interface GetTotalContractOrders_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  dexTrades: GetTotalContractOrders_ethereum_dexTrades[] | null;
}

export interface GetTotalContractOrders {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTotalContractOrders_ethereum | null;
}

export interface GetTotalContractOrdersVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  address: string;
  from?: any | null;
  till?: any | null;
}
