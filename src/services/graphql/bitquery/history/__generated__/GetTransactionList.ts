/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTransactionList
// ====================================================

export interface GetTransactionList_ethereum_sender_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
  /**
   * Unix timestamp
   */
  unixtime: number;
}

export interface GetTransactionList_ethereum_sender_block {
  __typename: 'Block';
  /**
   * Block timestamp
   */
  timestamp: GetTransactionList_ethereum_sender_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetTransactionList_ethereum_sender_sender {
  __typename: 'EthereumAddressInfo';
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetTransactionList_ethereum_sender_receiver {
  __typename: 'EthereumAddressInfo';
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetTransactionList_ethereum_sender_currency {
  __typename: 'Currency';
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

export interface GetTransactionList_ethereum_sender_transaction {
  __typename: 'EthereumTransactionInfo';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetTransactionList_ethereum_sender {
  __typename: 'EthereumTransfers';
  /**
   * Block where transfer transaction is included
   */
  block: GetTransactionList_ethereum_sender_block | null;
  /**
   * Transfer sender
   */
  sender: GetTransactionList_ethereum_sender_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetTransactionList_ethereum_sender_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetTransactionList_ethereum_sender_currency | null;
  amount: number | null;
  amountInUsd: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetTransactionList_ethereum_sender_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
}

export interface GetTransactionList_ethereum_receiver_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetTransactionList_ethereum_receiver_block {
  __typename: 'Block';
  /**
   * Block timestamp
   */
  timestamp: GetTransactionList_ethereum_receiver_block_timestamp | null;
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetTransactionList_ethereum_receiver_sender {
  __typename: 'EthereumAddressInfo';
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetTransactionList_ethereum_receiver_receiver {
  __typename: 'EthereumAddressInfo';
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface GetTransactionList_ethereum_receiver_currency {
  __typename: 'Currency';
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

export interface GetTransactionList_ethereum_receiver_transaction {
  __typename: 'EthereumTransactionInfo';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetTransactionList_ethereum_receiver {
  __typename: 'EthereumTransfers';
  /**
   * Block where transfer transaction is included
   */
  block: GetTransactionList_ethereum_receiver_block | null;
  /**
   * Transfer sender
   */
  sender: GetTransactionList_ethereum_receiver_sender | null;
  /**
   * Transfer receiver
   */
  receiver: GetTransactionList_ethereum_receiver_receiver | null;
  /**
   * Currency of transfer
   */
  currency: GetTransactionList_ethereum_receiver_currency | null;
  amount: number | null;
  amountInUsd: number | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetTransactionList_ethereum_receiver_transaction | null;
  /**
   * External transfer executed explicitly by tx sender. Internal transfers executed by smart contracts.
   */
  external: boolean | null;
}

export interface GetTransactionList_ethereum_receiverCount {
  __typename: 'EthereumTransfers';
  count: number | null;
}

export interface GetTransactionList_ethereum_senderCount {
  __typename: 'EthereumTransfers';
  count: number | null;
}

export interface GetTransactionList_ethereum {
  __typename: 'Ethereum';
  /**
   * Currency Transfers
   */
  sender: GetTransactionList_ethereum_sender[] | null;
  /**
   * Currency Transfers
   */
  receiver: GetTransactionList_ethereum_receiver[] | null;
  /**
   * Currency Transfers
   */
  receiverCount: GetTransactionList_ethereum_receiverCount[] | null;
  /**
   * Currency Transfers
   */
  senderCount: GetTransactionList_ethereum_senderCount[] | null;
}

export interface GetTransactionList {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTransactionList_ethereum | null;
}

export interface GetTransactionListVariables {
  network: EthereumNetwork;
  address?: string | null;
  limit: number;
  offset: number;
  from?: any | null;
  till?: any | null;
}
