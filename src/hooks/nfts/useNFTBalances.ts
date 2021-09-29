import {useWeb3} from 'hooks/useWeb3';
import {ChainId, MyBalances, Web3State} from 'types/blockchain';
import {useQuery} from 'react-query';
import {COLLECTION_LIST, GET_CHAIN_FROM_NETWORK_FOR_COLLECTIONS} from 'shared/constants/collections';
import {getNFTBalances} from 'services/nfts';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { GET_CHAIN_FROM_NETWORK } from 'shared/constants/Blockchain';

/**
 *
 * Get NFT balances directly from token list, object is compatible with Bitquery Balance type
 */
export const useNFTBalances = (
  account?: string,
  networkName?: EthereumNetwork,
  collection?: string,
) => {
  const { chainId } = useWeb3();
  const network = networkName || EthereumNetwork.matic;
  const provider = useNetworkProvider(network, chainId);

  const nftBalancesQuery = useQuery(
    [`GetCollectionBalance${network}`, account, networkName],
    () => {
      if (account) {
        const chain = GET_CHAIN_FROM_NETWORK_FOR_COLLECTIONS(network, chainId)
        // We use here a collection list
        let collections = COLLECTION_LIST[chain]?.map((c) => c.address);
        if (collection) {
          collections?.filter(
            (c) => c.toLowerCase() === collection.toLowerCase(),
          );
        }
        if (collections?.length) {
          return getNFTBalances(collections, account, provider).then(
            (balances) => {
              return balances.map((b) => {
                const collection = COLLECTION_LIST[chain]?.find(
                  (c) => c.address.toLowerCase() === b.address.toLowerCase(),
                );
                return {
                  __typename: 'EthereumBalance',
                  currency: {
                    __typename: 'Currency',
                    name: collection?.name,
                    symbol: collection?.symbol,
                    decimals: 0,
                    address: b.address,
                    tokenType: 'ERC721',
                  },
                  value: b.balance.toNumber() || 0,
                  valueInUsd: 0,
                  network: networkName
                } as MyBalances;
              });
            },
          );
        }
      }
    },
  );

  return nftBalancesQuery;
};
