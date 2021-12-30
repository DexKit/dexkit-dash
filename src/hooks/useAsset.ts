import {useQuery} from 'react-query';
import {ethers} from 'ethers';
import {getTokenMetadata} from 'services/nfts';
import {ERC721Abi} from 'types/abis';
import {AssetData} from '../modules/Dashboard/types';
import {Web3State} from 'types/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {getNormalizedUrl} from 'utils/browser';

export const GET_MY_ASSETS = 'GET_MY_ASSETS';

export function useAsset(contractAddress?: string, tokenId?: string) {
  const {getProvider, web3State} = useWeb3();

  return useQuery(
    [GET_MY_ASSETS, contractAddress, tokenId, web3State, getProvider],
    async () => {
      if (web3State === Web3State.Done && contractAddress && tokenId) {
        const contract = new ethers.Contract(
          contractAddress,
          ERC721Abi,
          new ethers.providers.Web3Provider(getProvider()),
        );

        const uri = await contract.tokenURI(tokenId);

        const metadata = await getTokenMetadata(uri);

        const owner = await contract.ownerOf(tokenId);

        const collectionName = await contract.name();
        const symbol = await contract.symbol();

        const data: AssetData = {
          collectionName,
          symbol,
          imageUrl: getNormalizedUrl(metadata?.image || ''),
          contractAddress,
          tokenId,
          description: metadata.description || '',
          title: metadata.name || '',
          owner,
        };

        return data;
      }

      return undefined;
    },
  );
}
