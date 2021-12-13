/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetMintBurn
// ====================================================

export interface GetMintBurn_ethereum_mint_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMintBurn_ethereum_mint_block {
  __typename: 'Block';
  /**
   * Block number (height) in blockchain
   */
  height: number;
  /**
   * Block timestamp
   */
  timestamp: GetMintBurn_ethereum_mint_block_timestamp | null;
}

export interface GetMintBurn_ethereum_mint_transaction {
  __typename: 'EthereumTransactionInfo';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMintBurn_ethereum_mint_arguments {
  __typename: 'ArgumentNameValue';
  /**
   * Argument name
   */
  argument: string;
  /**
   * Argument data type
   */
  argumentType: string;
  /**
   * Value as String
   */
  value: string;
}

export interface GetMintBurn_ethereum_mint {
  __typename: 'EthereumSmartContractEvent';
  /**
   * Block in the blockchain
   */
  block: GetMintBurn_ethereum_mint_block | null;
  /**
   * Transaction where event happened
   */
  transaction: GetMintBurn_ethereum_mint_transaction | null;
  /**
   * Event arguments
   */
  arguments: GetMintBurn_ethereum_mint_arguments[] | null;
}

export interface GetMintBurn_ethereum_burn_block_timestamp {
  __typename: 'DateTime';
  /**
   * String date representation with default format as YYYY-MM-DD
   */
  time: string;
}

export interface GetMintBurn_ethereum_burn_block {
  __typename: 'Block';
  /**
   * Block number (height) in blockchain
   */
  height: number;
  /**
   * Block timestamp
   */
  timestamp: GetMintBurn_ethereum_burn_block_timestamp | null;
}

export interface GetMintBurn_ethereum_burn_transaction {
  __typename: 'EthereumTransactionInfo';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetMintBurn_ethereum_burn_arguments {
  __typename: 'ArgumentNameValue';
  /**
   * Argument name
   */
  argument: string;
  /**
   * Argument data type
   */
  argumentType: string;
  /**
   * Value as String
   */
  value: string;
}

export interface GetMintBurn_ethereum_burn {
  __typename: 'EthereumSmartContractEvent';
  /**
   * Block in the blockchain
   */
  block: GetMintBurn_ethereum_burn_block | null;
  /**
   * Transaction where event happened
   */
  transaction: GetMintBurn_ethereum_burn_transaction | null;
  /**
   * Event arguments
   */
  arguments: GetMintBurn_ethereum_burn_arguments[] | null;
}

export interface GetMintBurn_ethereum {
  __typename: 'Ethereum';
  /**
   * Smart Contract Events
   */
  mint: GetMintBurn_ethereum_mint[] | null;
  /**
   * Smart Contract Events
   */
  burn: GetMintBurn_ethereum_burn[] | null;
}

export interface GetMintBurn {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetMintBurn_ethereum | null;
}

export interface GetMintBurnVariables {
  network: EthereumNetwork;
  address?: string | null;
  limit: number;
  offset: number;
}
