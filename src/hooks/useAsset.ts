import {useQuery} from 'react-query';
import {getAssetMetadata} from 'services/nfts';
import {Web3State} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';

export const GET_MY_ASSETS = 'GET_MY_ASSETS';

export function useAsset(contractAddress?: string, tokenId?: string) {
  const {getProvider, web3State} = useWeb3();

  return useQuery(
    [GET_MY_ASSETS, contractAddress, tokenId, web3State, getProvider],
    async () => {
      if (web3State === Web3State.Done && contractAddress && tokenId) {
        return await getAssetMetadata(contractAddress, getProvider(), tokenId);
      }

      return undefined;
    },
  );
}
