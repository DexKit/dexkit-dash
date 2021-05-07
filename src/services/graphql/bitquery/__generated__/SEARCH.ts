/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SmartContractType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: SEARCH
// ====================================================

export interface SEARCH_search_subject_HederaAccount {
  __typename: "HederaAccount";
}

export interface SEARCH_search_subject_Address {
  __typename: "Address";
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
}

export interface SEARCH_search_subject_Currency {
  __typename: "Currency";
  /**
   * Currency symbol
   */
  symbol: string;
  /**
   * Currency name
   */
  name: string | null;
  /**
   * Token Smart Contract Address
   */
  currencyAddress: string | null;
  /**
   * Token ID
   */
  tokenId: string | null;
  /**
   * Token Type
   */
  tokenType: string | null;
  /**
   * Decimals
   */
  decimals: number;
}

export interface SEARCH_search_subject_SmartContract {
  __typename: "SmartContract";
  /**
   * String address representation
   */
  address: string;
  /**
   * Annotations ( tags ), if exists
   */
  annotation: string | null;
  /**
   * Smart Contract Type
   */
  contractType: SmartContractType;
  /**
   * Smart Contract Protocol Type
   */
  protocol: string | null;
}

export interface SEARCH_search_subject_TransactionHash {
  __typename: "TransactionHash";
  /**
   * Hash hex representation
   */
  hash: string;
}

export type SEARCH_search_subject = SEARCH_search_subject_HederaAccount | SEARCH_search_subject_Address | SEARCH_search_subject_Currency | SEARCH_search_subject_SmartContract | SEARCH_search_subject_TransactionHash;

export interface SEARCH_search {
  __typename: "Result";
  /**
   * Subject in blockchain
   */
  subject: SEARCH_search_subject;
}

export interface SEARCH {
  /**
   * Search by query string
   */
  search: SEARCH_search[] | null;
}

export interface SEARCHVariables {
  value: string;
}
