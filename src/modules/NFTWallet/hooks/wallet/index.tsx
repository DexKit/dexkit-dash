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
      const params = new Map<string, string>();

      if (query.owner) {
        params.set('owner', query.owner);
      }
      if (query.sortBy) {
        params.set('order_by', query.sortBy);
      }
      if (query.offset) {
        params.set('offset', String(query.offset));
      }
      if (query.limit) {
        params.set('limit', String(query.limit));
      }
      if (query.collection) {
        params.set('collection', query.collection);
      }
      let url = `https://${
        chainId === RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/assets?`;

      for (const [key, value] of params) {
        url += `${key}=${value}&`;
      }

      return axios.get(url, {
        headers: {'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY},
      });
    },
    [getProvider],
  );

  return {getAssets};
};
