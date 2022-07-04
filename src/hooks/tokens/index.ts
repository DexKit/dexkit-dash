import { useWeb3 } from 'hooks/useWeb3';
import { useCallback } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';

import {
  addCustomAsset,
  addCustomToken,
  removeCustomAsset,
  removeCustomToken,
} from 'redux/_settingsv2/actions';
import { getTokenBalanceOf } from 'services/blockchain/balances';
import { ERC721Abi } from 'contracts/abis/ERC721Abi';
import { getNormalizedUrl } from 'utils/browser';
import { getTokenMetadata } from 'services/nfts';
import { AssetData } from 'modules/Dashboard/types';
import { getMulticallFromProvider } from 'services/multicall';
import { Interface } from 'ethers/lib/utils';
import { CallInput } from '@indexed-finance/multicall';
import { providers } from 'ethers';
import { ChainId } from 'types/blockchain';

// por chain ID
// por redes a parte da evm
// flags para network.
// flags para graficos.
// flags para historico.
//usar token list
export function useCustomTokenList() {
  const { tokens } = useSelector<AppState, AppState['settingsv2']>(
    ({ settingsv2 }) => settingsv2,
  );

  return { tokens };
}

const USE_TOKEN_BALANCE = 'USE_TOKEN_BALANCE';

export function useTokenBalance(contractAddress: string, account?: string) {
  const { chainId, getProvider } = useWeb3();

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

  return { addToken };
}

export function useAddCustomAsset() {
  const dispatch = useDispatch();

  const { getProvider } = useWeb3();

  const addAsset = useMutation(
    async (params: {
      contractAddress: string;
      tokenId: string;
      chainId: number;
    }) => {
      const { contractAddress, tokenId } = params;
      const pr = new providers.Web3Provider(getProvider());
      const multicall = await getMulticallFromProvider(pr);
      const iface = new Interface(ERC721Abi);
      let calls: CallInput[] = [];
      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'tokenURI',
        args: [tokenId],
      });

      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'ownerOf',
        args: [tokenId],
      });

      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'name',

      });

      calls.push({
        interface: iface,
        target: contractAddress,
        function: 'symbol',
      });

      const response = await multicall.multiCall(calls);
      const [, results] = response;


      const uri = results[0];
      const owner = results[1];
      const collectionName = results[2];
      const symbol = results[3];

      const tokenMetadata = await getTokenMetadata(uri);

      const data: AssetData = {
        collectionName,
        symbol,
        imageUrl: getNormalizedUrl(
          tokenMetadata?.image || tokenMetadata.image_url || '',
        ),
        contractAddress,
        tokenId,
        description: tokenMetadata.description || '',
        title: tokenMetadata.name || '',
        owner,
      };

      dispatch(addCustomAsset({ ...params, metadata: data }));

    }
  );

  return { addAsset };
}

export function useRemoveCustomAsset() {
  const dispatch = useDispatch();

  const removeAsset = useCallback(
    (params: { contractAddress: string; tokenId: string; chainId: number }) => {
      dispatch(removeCustomAsset(params));
    },
    [dispatch],
  );
  return { removeAsset };
}

export function useAssetList() {
  const { assets } = useSelector<AppState, AppState['settingsv2']>(
    ({ settingsv2 }) => settingsv2,
  );

  return {
    assets: assets || [],
  };
}


export function useRemoveCustomToken() {
  const dispatch = useDispatch();

  const removeToken = useCallback(
    (params: { address: string, chainId: ChainId }) => {
      dispatch(removeCustomToken(params));
    },
    [dispatch],
  );

  return { removeToken };
}

