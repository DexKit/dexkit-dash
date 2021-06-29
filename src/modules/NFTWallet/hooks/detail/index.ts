import {useCallback} from 'react';
import useFetch from 'use-http';

const ENV = process.env.NODE_ENV;
const API_ENV = ENV == 'development' ? 'rinkeby-api' : 'api';

export const OPENSEA_FETCH_OPTIONS = {
  headers: {
    'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY || '',
  },
};

export const OPENSEA_ASSET_ENDPOINT = `https://${API_ENV}.opensea.io/api/v1/asset`;

export const OPENSEA_ASSET_EVENTS_ENDPOINT = `https://${API_ENV}.opensea.io/api/v1/events`;

export const OPENSEA_ASSET_ORDERS_ENDPOINT = `https://${API_ENV}.opensea.io/wyvern/v1/orders`;

export const OPENSEA_TOKENS = `https://${API_ENV}.opensea.io/api/v1/tokens`;

export function useAssetOrders() {
  const {get, loading, data, error} = useFetch(
    OPENSEA_ASSET_ORDERS_ENDPOINT,
    OPENSEA_FETCH_OPTIONS,
  );

  const getOrders = useCallback(
    (assetAddress: string, tokenId: string) => {
      return get(
        `?asset_contract_address=${assetAddress}&bundled=false&include_bundled=false&include_invalid=false&token_id=${tokenId}&limit=100&offset=0&order_by=created_date&order_direction=desc`,
      );
    },
    [get],
  );

  return {getOrders, loading, data, error};
}

export function useAssetEvents() {
  const {get, data, loading, error} = useFetch(
    OPENSEA_ASSET_EVENTS_ENDPOINT,
    OPENSEA_FETCH_OPTIONS,
  );

  const getEvents = useCallback(
    (assetAddress: string, tokenId: string) => {
      return get(`?asset_contract_address=${assetAddress}&token_id=${tokenId}`);
    },
    [get],
  );

  return {getEvents, data, loading, error};
}

export function useAsset() {
  const {get, loading, data, error} = useFetch(
    OPENSEA_ASSET_ENDPOINT,
    OPENSEA_FETCH_OPTIONS,
  );

  const getAsset = useCallback(
    (contractAddress: string, tokenId: string) => {
      get(`/${contractAddress}/${tokenId}/`);
    },
    [get],
  );

  return {getAsset, loading, data, error};
}
