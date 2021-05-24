/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBalanceBlock
// ====================================================

export interface GetBalanceBlock_ethereum_blocks {
  __typename: "EthereumBlocks";
  /**
   * Block number (height) in blockchain
   */
  height: number;
}

export interface GetBalanceBlock_ethereum {
  __typename: "Ethereum";
  /**
   * Blockchain Blocks
   */
  blocks: GetBalanceBlock_ethereum_blocks[] | null;
}

export interface GetBalanceBlock {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetBalanceBlock_ethereum | null;
}

export interface GetBalanceBlockVariables {
  date: any;
}
