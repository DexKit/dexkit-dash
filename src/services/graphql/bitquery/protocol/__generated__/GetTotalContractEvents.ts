/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {EthereumNetwork} from './../../../../../../__generated__/globalTypes';

// ====================================================
// GraphQL query operation: GetTotalContractEvents
// ====================================================

export interface GetTotalContractEvents_ethereum_smartContractEvents {
  __typename: 'EthereumSmartContractEvent';
  /**
   * Counts and other metrics
   */
  totalEvents: number | null;
}

export interface GetTotalContractEvents_ethereum {
  __typename: 'Ethereum';
  /**
   * Smart Contract Events
   */
  smartContractEvents:
    | GetTotalContractEvents_ethereum_smartContractEvents[]
    | null;
}

export interface GetTotalContractEvents {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetTotalContractEvents_ethereum | null;
}

export interface GetTotalContractEventsVariables {
  network: EthereumNetwork;
  address?: string | null;
  events?: string[] | null;
}
