import axios from 'axios';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import {getChainId, RINKEBY_NETWORK} from 'utils/opensea';

export function useBundle() {
  const {getProvider} = useWeb3();
  const [data, setData] = useState<any>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const getBundle = useCallback(
    async (slug: string) => {
      setError(undefined);
      const provider = getProvider();
      const chainId = await getChainId(provider);

      const url = `https://${
        chainId == RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/bundle/${slug}`;

      setLoading(true);

      return axios
        .get(url, {
          headers: {
            'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY,
          },
        })
        .catch((reason) => setError(reason))
        .then((response) => {
          if (response) {
            setData(response?.data);
          }
        })
        .finally(() => setLoading(false));
    },
    [getProvider],
  );

  return {getBundle, data, loading, error};
}
