import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';

import {addCustomToken} from 'redux/_settingsv2/actions';
import {getTokenBalanceOf} from 'services/blockchain/balances';

// por chain ID
// por redes a parte da evm
// flags para network.
// flags para graficos.
// flags para historico.
//usar token list
export function useCustomTokenList() {
  const {tokens} = useSelector<AppState, AppState['settingsv2']>(
    ({settingsv2}) => settingsv2,
  );

  return {tokens};
}

const USE_TOKEN_BALANCE = 'USE_TOKEN_BALANCE';

export function useTokenBalance(contractAddress: string, account?: string) {
  const {chainId, getProvider} = useWeb3();

  const query = useQuery(
    [USE_TOKEN_BALANCE, contractAddress, account, chainId],
    async () => {
      if (account && chainId) {
        return await getTokenBalanceOf(getProvider(), contractAddress, account);
      }
    },
  );

  return query;
}

interface AddTokenParams {
  name: string;
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
}

export function useAddCustomToken() {
  const dispatch = useDispatch();

  const addToken = useCallback(
    (params: AddTokenParams) => {
      dispatch(addCustomToken(params));
    },
    [dispatch],
  );

  return {addToken};
}

export function useAddNftToken() {
  const addNftToken = useCallback(
    (params: {contractAddress: string; tokenId: string}) => {},
    [],
  );
  return {addNftToken};
}
