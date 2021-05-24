/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetLastTradePairExplorer
// ====================================================

export interface GetLastTradePairExplorer_ethereum_data_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetLastTradePairExplorer_ethereum_data_block {
  __typename: "BlockExtended";
  /**
   * Block timestamp
   */
  timestamp: GetLastTradePairExplorer_ethereum_data_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetLastTradePairExplorer_ethereum_data_smartContract_address {
  __typename: "Address";
  /**
   * String address representation
   */
  address: string;
}

export interface GetLastTradePairExplorer_ethereum_data_smartContract {
  __typename: "EthereumSmartContract";
  /**
   * Smart Contract Address
   */
  address: GetLastTradePairExplorer_ethereum_data_smartContract_address;
}

export interface GetLastTradePairExplorer_ethereum_data {
  __typename: "EthereumDexTrades";
  /**
   * Block in the blockchain
   */
  block: GetLastTradePairExplorer_ethereum_data_block | null;
  /**
   * Protocol name of the smart contract
   */
  protocol: string | null;
  /**
   * Smart contract being called
   */
  smartContract: GetLastTradePairExplorer_ethereum_data_smartContract | null;
}

export interface GetLastTradePairExplorer_ethereum {
  __typename: "Ethereum";
  /**
   * Trades on Ethereum DEX Smart Contracts
   */
  data: GetLastTradePairExplorer_ethereum_data[] | null;
}

export interface GetLastTradePairExplorer {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetLastTradePairExplorer_ethereum | null;
}

export interface GetLastTradePairExplorerVariables {
  network: EthereumNetwork;
  exchangeName?: string | null;
  baseAddress: string;
  quoteAddress: string;
}
