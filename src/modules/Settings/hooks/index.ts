import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {} from 'react';
import {useQuery} from 'react-query';
import {getTokenInfo} from '../services/index';

const ERC20_USE_TOKEN_INFO = 'ERC20_USE_TOKEN_INFO';

export function useTokenInfo(contractAddress?: string) {
  const {getProvider, chainId} = useWeb3();

  const query = useQuery(
    [ERC20_USE_TOKEN_INFO, chainId, contractAddress],
    () => {
      if (chainId && contractAddress) {
        return getTokenInfo(
          new ethers.providers.Web3Provider(getProvider()),
          contractAddress,
        );
      }

      return undefined;
    },
  );

  return query;
}
