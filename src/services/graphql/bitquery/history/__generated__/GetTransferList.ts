/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTransferList
// ====================================================

export interface GetTransferList_ethereum_transfers_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
  /**
   * Unix timestamp
   */
  unixtime: number;
}

export interface GetTransferList_ethereum_transfers_block {
  __typename: "Block";
  /**
   * Block timestamp
   */
  timestamp: GetTransferList_ethereum_transfers_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetTransferList_ethereum_transfers_sender {
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

export interface GetTransferList_ethereum_transfers_receiver {
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

export interface GetTransferList_ethereum_transfers_currency {
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
  /**
   * Decimals
   */
  decimals: number;
}

export interface GetTransferList_ethereum_transfers_transaction {
  __typename: "EthereumTransactionInfo";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetTransferList_ethereum_transfers {
  __typename: "EthereumTransfers";
  /**
   * Block where transfer transaction is included
   */
  block: GetTransferList_ethereum_transfers_block | null;
  /**
   * Transfer sender
   */
  sender: GetTransferList_ethereum_transfers_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetTransferList_ethereum_transfers_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetTransferList_ethereum_transfers_currency | null;
  amount: number | null;
  amountInUsd: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetTransferList_ethereum_transfers_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
}

export interface GetTransferList_ethereum_receiverCount {
  __typename: "EthereumTransfers";
  count: number | null;
}

export interface GetTransferList_ethereum_senderCount {
  __typename: "EthereumTransfers";
  count: number | null;
}

export interface GetTransferList_ethereum {
  __typename: "Ethereum";
  /**
   * Currency Transfers
   */
  transfers: GetTransferList_ethereum_transfers[] | null;
  /**
   * Currency Transfers
   */
  receiverCount: GetTransferList_ethereum_receiverCount[] | null;
  /**
   * Currency Transfers
   */
  senderCount: GetTransferList_ethereum_senderCount[] | null;
}

export interface GetTransferList {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTransferList_ethereum | null;
}

export interface GetTransferListVariables {
  network: EthereumNetwork;
  address?: string | null;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
