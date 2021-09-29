import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {getTokenIDsByTransfer} from 'services/nfts';
import {EthereumNetwork} from 'shared/constants/AppEnums';

import {ChainId, Web3State} from 'types/blockchain';

/**
 * @dev Get all ids received by user from collection
 */
export const useCollectionIds = (
  address: string,
  networkName: EthereumNetwork,
) => {
  const {chainId} = useWeb3();
  const account = useDefaultAccount();
  const provider = useNetworkProvider(networkName, chainId);

  const tokenIdsQuery = useQuery(
    ['GetCollectionTokenIds', address, account],
    () => {
      if (address && account) {
        console.log('called');
        return getTokenIDsByTransfer(address, account, provider);
      }
    },
  );

  return tokenIdsQuery;
};
