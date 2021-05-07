/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetContractEventByHash
// ====================================================

export interface GetContractEventByHash_ethereum_smartContractEvents_arguments {
  __typename: "ArgumentNameValue";
  /**
   * Argument name
   */
  argument: string;
  /**
   * Value as String
   */
  value: string;
  /**
   * Argument data type
   */
  argumentType: string;
}

export interface GetContractEventByHash_ethereum_smartContractEvents_smartContractEvent {
  __typename: "Event";
  /**
   * Name
   */
  name: string | null;
}

export interface GetContractEventByHash_ethereum_smartContractEvents {
  __typename: "EthereumSmartContractEvent";
  /**
   * Event arguments
   */
  arguments: GetContractEventByHash_ethereum_smartContractEvents_arguments[] | null;
  /**
   * Contract event logged
   */
  smartContractEvent: GetContractEventByHash_ethereum_smartContractEvents_smartContractEvent | null;
}

export interface GetContractEventByHash_ethereum {
  __typename: "Ethereum";
  /**
   * Smart Contract Events
   */
  smartContractEvents: GetContractEventByHash_ethereum_smartContractEvents[] | null;
}

export interface GetContractEventByHash {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetContractEventByHash_ethereum | null;
}

export interface GetContractEventByHashVariables {
  network: EthereumNetwork;
  address?: string | null;
  hash?: string[] | null;
}
