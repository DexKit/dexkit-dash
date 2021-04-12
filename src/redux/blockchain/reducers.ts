import { BigNumber } from '@0x/utils';
import { getType } from 'typesafe-actions';
import {RootAction} from '../store';
import * as actions from '../store/actions';
import { Web3State } from 'types/blockchain';
import { TokenBalance } from 'types/app';
import { ZERO } from 'shared/constants/Blockchain';

export interface BlockchainState {
    readonly ethAccount: string | undefined;
    readonly blocknumber: number;
    readonly chainId: number | undefined;
    readonly web3State: Web3State;
    readonly tokenBalances: TokenBalance[];
    readonly ethBalance: BigNumber;
    readonly wethTokenBalance: TokenBalance | null;
}

const initialBlockchainState: BlockchainState = {
    ethAccount: undefined,
    web3State: Web3State.NotConnected,
    tokenBalances: [],
    ethBalance: ZERO,
    wethTokenBalance: null,
    blocknumber: 0,
    chainId: 1,
   /* gasInfo: {
        gasPriceInWei: DEFAULT_GAS_PRICE,
        estimatedTimeMs: DEFAULT_ESTIMATED_TRANSACTION_TIME_MS,
    },*/
};

export default function(state: BlockchainState = initialBlockchainState, action: RootAction): BlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setBlockNumber):
            return { ...state, blocknumber: action.payload };
        case getType(actions.setTokenBalances):
            return { ...state, tokenBalances: action.payload };
        case getType(actions.setChainId):
            return { ...state, chainId: action.payload };
        case getType(actions.setTokenBalance):
            const tokenBalances = state.tokenBalances;
            const tokenBalance = action.payload;
            const index = tokenBalances.findIndex(t => t.token.address === tokenBalance.token.address);
            tokenBalances[index] = tokenBalance;
            return { ...state, tokenBalances };

        case getType(actions.resetWallet):
            return { ...state, web3State: Web3State.NotConnected };
        case getType(actions.setEthBalance):
            return { ...state, ethBalance: action.payload };
        default:
            return state;
    }
}
