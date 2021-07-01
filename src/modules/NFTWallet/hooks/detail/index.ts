import axios from 'axios';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import useFetch from 'use-http';
import {getChainId, RINKEBY_NETWORK} from 'utils/opensea';

export function useAssetEvents() {
  const {getProvider} = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<any>();

  const getEvents = useCallback(
    async (assetAddress: string, tokenId: string) => {
      const provider = getProvider();
      const chainId = await getChainId(provider);

      const url = `https://${
        chainId == RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/events?asset_contract_address=${assetAddress}&token_id=${tokenId}`;

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

  return {getEvents, loading, data, error};
}

export function useAsset() {
  const {getProvider} = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<any>();

  const getAsset = useCallback(
    async (contractAddress: string, tokenId: string) => {
      setError(undefined);
      const provider = getProvider();
      const chainId = await getChainId(provider);

      const url = `https://${
        chainId == RINKEBY_NETWORK ? 'rinkeby-api' : 'api'
      }.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`;

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

  return {getAsset, loading, data, error};
}
