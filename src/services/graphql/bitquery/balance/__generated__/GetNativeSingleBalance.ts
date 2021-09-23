/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EthereumNetwork } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetNativeSingleBalance
// ====================================================

export interface GetNativeSingleBalance_ethereum_address {
  __typename: "EthereumAddressInfoWithBalance";
  /**
   * DEPRECATED Current address balance
   */
  balance: number | null;
}

export interface GetNativeSingleBalance_ethereum {
  __typename: "Ethereum";
  /**
   * Basic information about address ( or smart contract )
   */
  address: GetNativeSingleBalance_ethereum_address[];
}

export interface GetNativeSingleBalance {
  /**
   * Ethereum Mainnet / Classic Chain Datasets
   */
  ethereum: GetNativeSingleBalance_ethereum | null;
}

export interface GetNativeSingleBalanceVariables {
  network: EthereumNetwork;
  address: string;
}
