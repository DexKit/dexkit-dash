/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Network, SmartContractType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: searchByAddress
// ====================================================

export interface searchByAddress_search_subject_HederaAccount {
  __typename: "HederaAccount";
}

export interface searchByAddress_search_subject_Address {
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

export interface searchByAddress_search_subject_Currency {
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

export interface searchByAddress_search_subject_SmartContract {
  __typename: "SmartContract";
  /**
   * String address representation
   */
  contractAdress: string;
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

export interface searchByAddress_search_subject_TransactionHash {
  __typename: "TransactionHash";
  /**
   * Hash hex representation
   */
  hash: string;
}

export type searchByAddress_search_subject = searchByAddress_search_subject_HederaAccount | searchByAddress_search_subject_Address | searchByAddress_search_subject_Currency | searchByAddress_search_subject_SmartContract | searchByAddress_search_subject_TransactionHash;

export interface searchByAddress_search {
  __typename: "Result";
  /**
   * Subject in blockchain
   */
  subject: searchByAddress_search_subject;
}

export interface searchByAddress {
  /**
   * Search by query string
   */
  search: searchByAddress_search[] | null;
}

export interface searchByAddressVariables {
  value: string;
  network: Network;
}
