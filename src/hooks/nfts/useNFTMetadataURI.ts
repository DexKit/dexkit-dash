import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useQuery} from 'react-query';
import {getTokenMetadataURI} from 'services/nfts';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useCollectionBaseURI} from './useCollectionBaseURI';

const isIPFS = (uri: string) => {
  return uri.startsWith('ipfs://');
};

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export const useNFTMetadataURI = (
  collection: string,
  networkName: EthereumNetwork,
  tokenIds?: string[],
  opts: {chainId?: number} = {chainId: -1},
) => {
  const baseURIquery = useCollectionBaseURI(collection);
  const provider = useNetworkProvider(
    opts.chainId === -1 ? networkName : undefined,
    opts.chainId,
  );

  const tokensMetadataQuery = useQuery(
    ['GET_TOKENS_METADATA', baseURIquery.data],
    async () => {
      const tokensMetadata = [];
      if (!tokenIds) {
        return;
      }
      if (baseURIquery.data && baseURIquery.data.baseURI) {
        for (let index = 0; index < tokenIds.length; index++) {
          const element = tokenIds[index];

          if (isIPFS(baseURIquery.data.baseURI)) {
            const ipfs_path = baseURIquery.data.baseURI.substring(
              6,
              baseURIquery.data.baseURI.length,
            );
            const metadata = await fetch(
              `${IPFS_GATEWAY}/${ipfs_path}/${element}`,
            ).then((r) => r.json());
            tokensMetadata.push(metadata);
          } else {
            const metadata = await fetch(
              `${baseURIquery.data.baseURI}/${element}`,
            ).then((r) => r.json());
            tokensMetadata.push(metadata);
          }
        }
      } else {
        // if not base URI available we fetch directly from tokenURI's on the contract
        const metadataURIs = await getTokenMetadataURI(
          tokenIds,
          collection,
          provider,
        );
        for (let index = 0; index < metadataURIs.length; index++) {
          const element = metadataURIs[index];

          if (isIPFS(element)) {
            const ipfs_path = element.substring(6, element.length);
            const metadata = await fetch(`${IPFS_GATEWAY}/${ipfs_path}`).then(
              (r) => r.json(),
            );
            tokensMetadata.push(metadata);
          } else {
            const metadata = await fetch(`${element}`).then((r) => r.json());
            tokensMetadata.push(metadata);
          }
        }
      }

      return tokensMetadata;
    },
  );

  return tokensMetadataQuery;
};
