/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAffiliateTrades
// ====================================================

export interface GetAffiliateTrades_ethereum_transfers_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetAffiliateTrades_ethereum_transfers_block {
  __typename: "Block";
  /**
   * Block timestamp
   */
  timestamp: GetAffiliateTrades_ethereum_transfers_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetAffiliateTrades_ethereum_transfers_sender {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetAffiliateTrades_ethereum_transfers_receiver {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetAffiliateTrades_ethereum_transfers_currency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
}

export interface GetAffiliateTrades_ethereum_transfers_transaction {
  __typename: "EthereumTransactionInfo";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetAffiliateTrades_ethereum_transfers {
  __typename: "EthereumTransfers";
  /**
   * Block where transfer transaction is included
   */
  block: GetAffiliateTrades_ethereum_transfers_block | null;
  /**
   * Transfer sender
   */
  sender: GetAffiliateTrades_ethereum_transfers_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetAffiliateTrades_ethereum_transfers_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetAffiliateTrades_ethereum_transfers_currency | null;
  amount: number | null;
  amountUsd: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetAffiliateTrades_ethereum_transfers_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
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
  limit: number;
  offset: number;
  sender: string;
  receiver: string;
  from?: any | null;
  till?: any | null;
  tradeAmount?: number | null;
}
