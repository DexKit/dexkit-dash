import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';

import {ethers} from 'ethers';

import {
  addCustomAsset,
  addCustomToken,
  removeCustomAsset,
} from 'redux/_settingsv2/actions';
import {getTokenBalanceOf} from 'services/blockchain/balances';
import {ERC721Abi} from 'contracts/abis/ERC721Abi';
import {getNormalizedUrl} from 'utils/browser';
import {getTokenMetadata} from 'services/nfts';
import {AssetData} from 'modules/Dashboard/types';

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

export function useAddCustomAsset() {
  const dispatch = useDispatch();

  const {getProvider} = useWeb3();

  const addAsset = useCallback(
    async (params: {
      contractAddress: string;
      tokenId: string;
      chainId: number;
    }) => {
      const {contractAddress, tokenId} = params;

      const contract = new ethers.Contract(
        contractAddress,
        ERC721Abi,
        new ethers.providers.Web3Provider(getProvider()),
      );

      const uri = await contract.tokenURI(tokenId);

      const tokenMetadata = await getTokenMetadata(uri);

      const owner = await contract.ownerOf(tokenId);

      const collectionName = await contract.name();
      const symbol = await contract.symbol();

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

      dispatch(addCustomAsset({...params, metadata: data}));
    },
    [dispatch, getProvider],
  );
  return {addAsset};
}

export function useRemoveCustomAsset() {
  const dispatch = useDispatch();

  const removeAsset = useCallback(
    (params: {contractAddress: string; tokenId: string; chainId: number}) => {
      dispatch(removeCustomAsset(params));
    },
    [dispatch],
  );
  return {removeAsset};
}

export function useAssetList() {
  const {assets} = useSelector<AppState, AppState['settingsv2']>(
    ({settingsv2}) => settingsv2,
  );

  return {
    assets: assets || [],
  };
}
