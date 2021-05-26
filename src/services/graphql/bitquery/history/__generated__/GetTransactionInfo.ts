/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetTransactionInfo
// ====================================================

export interface GetTransactionInfo_ethereum_transactions_block_timestamp {
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

export interface GetTransactionInfo_ethereum_transactions_block {
  __typename: "Block";
  /**
   * Block number (height) in blockchain
   */
  height: number;
  /**
   * Block timestamp
   */
  timestamp: GetTransactionInfo_ethereum_transactions_block_timestamp | null;
}

export interface GetTransactionInfo_ethereum_transactions_creates {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetTransactionInfo_ethereum_transactions_currency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Decimals
   */
  decimals: number;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Token ID
   */
  tokenId: string | null;
}

export interface GetTransactionInfo_ethereum_transactions_sender {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetTransactionInfo_ethereum_transactions_to {
  __typename: "EthereumAddressInfo";
  /**
   * String address representation
   */
  address: string;
}

export interface GetTransactionInfo_ethereum_transactions_date {
  __typename: "Date";
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  date: string;
}

export interface GetTransactionInfo_ethereum_transactions_gasCurrency {
  __typename: "Currency";
  /**
   * Token Smart Contract Address
   */
  address: string | null;
  /**
   * Decimals
   */
  decimals: number;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Currency symbol
   */
  symbol: string;
}

export interface GetTransactionInfo_ethereum_transactions {
  __typename: "EthereumTransactions";
  amount: number | null;
  /**
   * Block where transfer transaction is included
   */
  block: GetTransactionInfo_ethereum_transactions_block | null;
  count: number | null;
  /**
   * Created smart contract
   */
  creates: GetTransactionInfo_ethereum_transactions_creates | null;
  /**
   * Currency of amount
   */
  currency: GetTransactionInfo_ethereum_transactions_currency | null;
  /**
   * Error message if any
   */
  error: string | null;
  gas: number | null;
  /**
   * Gas price in Gwei
   */
  gasPrice: number;
  gasValue: number | null;
  /**
   * Hash hex representation
   */
  hash: string;
  /**
   * Success
   */
  success: boolean | null;
  /**
   * Transaction sender
   */
  sender: GetTransactionInfo_ethereum_transactions_sender | null;
  /**
   * Transaction receiver
   */
  to: GetTransactionInfo_ethereum_transactions_to | null;
  /**
   * Transaction nonce
   */
  nonce: number | null;
  /**
   * Calendar date
   */
  date: GetTransactionInfo_ethereum_transactions_date | null;
  /**
   * Currency of gas
   */
  gasCurrency: GetTransactionInfo_ethereum_transactions_gasCurrency | null;
  /**
   * Transaction index in block, 0 based
   */
  index: number | null;
}

export interface GetTransactionInfo_ethereum {
  __typename: "Ethereum";
  /**
   * Blockchain Transactions
   */
  transactions: GetTransactionInfo_ethereum_transactions[] | null;
}

export interface GetTransactionInfo {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTransactionInfo_ethereum | null;
}

export interface GetTransactionInfoVariables {
  network: EthereumNetwork;
  hash: string;
}
