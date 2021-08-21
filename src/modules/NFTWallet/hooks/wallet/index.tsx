import axios from 'axios';
import {useWeb3} from 'hooks/useWeb3';
import {AssetsQuery} from 'modules/NFTWallet/types';
import {useCallback} from 'react';
import {getChainId, RINKEBY_NETWORK} from 'utils/opensea';

export const useMyAssets = () => {
  const {getProvider} = useWeb3();

  const getAssets = useCallback(
    async (query: AssetsQuery) => {
      const provider = getProvider();
      const chainId = await getChainId(provider);

      const url = `https://${
        chainId == RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/assets?owner=${query.owner}&order_by=${
        query.sortBy
      }&order_direction=desc&offset=${query.offset}&limit=${
        query.limit
      }&collection=${query.collection || ''}`;

      return axios.get(url, {
        headers: {'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY},
      });
    },
    [getProvider],
  );

  return {getAssets};
};
