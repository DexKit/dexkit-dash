import { BigNumber } from "@0x/utils";
import { Web3State } from "types/blockchain";
import { createAction } from 'typesafe-actions';
import { TokenBalance } from "types/app";

export const setEthAccount = createAction('blockchain/ETH_ACCOUNT_set')<string | undefined>();

export const setEthAccounts = createAction('blockchain/ETH_ACCOUNTS_set')<string[] | undefined>();

export const setBlockNumber = createAction('blockchain/BLOCKNUMBER_set')<number>();

export const setChainId = createAction('blockchain/CHAIN_ID_set')<number | undefined>();

export const setEthBalance = createAction('blockchain/ETH_BALANCE_set')<BigNumber>();

export const setWeb3State = createAction('blockchain/WEB3_STATE_set')<Web3State>();

export const setTokenBalances = createAction('blockchain/TOKEN_BALANCES_set')<TokenBalance[]>();

export const setTokenBalance = createAction('blockchain/TOKEN_BALANCE_set')<TokenBalance>();

export const resetWallet = createAction('blockchain/RESET_WALLET_set')();
