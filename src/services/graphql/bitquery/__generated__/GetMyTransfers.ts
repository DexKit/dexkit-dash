/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetMyTransfers
// ====================================================

export interface GetMyTransfers_ethereum_sender_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMyTransfers_ethereum_sender_block {
  __typename: "Block";
  /**
   * Block timestamp
   */
  timestamp: GetMyTransfers_ethereum_sender_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetMyTransfers_ethereum_sender_sender {
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

export interface GetMyTransfers_ethereum_sender_receiver {
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

export interface GetMyTransfers_ethereum_sender_currency {
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

export interface GetMyTransfers_ethereum_sender_transaction {
  __typename: "EthereumTransactionInfo";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMyTransfers_ethereum_sender {
  __typename: "EthereumTransfers";
  /**
   * Block where transfer transaction is included
   */
  block: GetMyTransfers_ethereum_sender_block | null;
  /**
   * Transfer sender
   */
  sender: GetMyTransfers_ethereum_sender_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetMyTransfers_ethereum_sender_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetMyTransfers_ethereum_sender_currency | null;
  amount: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetMyTransfers_ethereum_sender_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
}

export interface GetMyTransfers_ethereum_receiver_block_timestamp {
  __typename: "DateTime";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMyTransfers_ethereum_receiver_block {
  __typename: "Block";
  /**
   * Block timestamp
   */
  timestamp: GetMyTransfers_ethereum_receiver_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetMyTransfers_ethereum_receiver_sender {
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

export interface GetMyTransfers_ethereum_receiver_receiver {
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

export interface GetMyTransfers_ethereum_receiver_currency {
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

export interface GetMyTransfers_ethereum_receiver_transaction {
  __typename: "EthereumTransactionInfo";
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMyTransfers_ethereum_receiver {
  __typename: "EthereumTransfers";
  /**
   * Block where transfer transaction is included
   */
  block: GetMyTransfers_ethereum_receiver_block | null;
  /**
   * Transfer sender
   */
  sender: GetMyTransfers_ethereum_receiver_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetMyTransfers_ethereum_receiver_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetMyTransfers_ethereum_receiver_currency | null;
  amount: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetMyTransfers_ethereum_receiver_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
}

export interface GetMyTransfers_ethereum {
  __typename: "Ethereum";
  /**
   * Currency Transfers
   */
  sender: GetMyTransfers_ethereum_sender[] | null;
  /**
   * Currency Transfers
   */
  receiver: GetMyTransfers_ethereum_receiver[] | null;
}

export interface GetMyTransfers {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMyTransfers_ethereum | null;
}

export interface GetMyTransfersVariables {
  network: EthereumNetwork;
  address?: string | null;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
