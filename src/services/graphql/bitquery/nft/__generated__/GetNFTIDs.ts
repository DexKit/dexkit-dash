/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetNFTIDs
// ====================================================

export interface GetNFTIDs_ethereum_transfers_currency {
  __typename: 'Currency';
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Type
   */
  tokenType: string | null;
}

export interface GetNFTIDs_ethereum_transfers_transaction {
  __typename: 'EthereumTransactionInfo';
  /**
   * Hash hex representation
   */
  hash: string;
}

export interface GetNFTIDs_ethereum_transfers {
  __typename: 'EthereumTransfers';
  amount: number | null;
  /**
   * Currency of transfer
   */
  currency: GetNFTIDs_ethereum_transfers_currency | null;
  /**
   * Transaction where transfer happened
   */
  transaction: GetNFTIDs_ethereum_transfers_transaction | null;
  /**
   * Entity identifier ( for ERC-721 NFT tokens )
   */
  entityId: string | null;
}

export interface GetNFTIDs_ethereum {
  __typename: 'Ethereum';
  /**
   * Currency Transfers
   */
  transfers: GetNFTIDs_ethereum_transfers[] | null;
}

export interface GetNFTIDs {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetNFTIDs_ethereum | null;
}

export interface GetNFTIDsVariables {
  receiver: string;
  network: EthereumNetwork;
  collection?: string | null;
}
