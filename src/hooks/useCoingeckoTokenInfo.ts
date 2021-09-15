import {Web3Wrapper} from '@0x/web3-wrapper';
import {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {
  COINGECKO_URL,
  getCoingeckoContractUrlFromNetwork,
} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';

export const useCoingeckoTokenInfo = (
  address?: string,
  network?: EthereumNetwork,
) => {
  const tokenInfoQuery = useQuery(
    ['GetCoingeckoTokenInfo', address, network],
    () => {
      if (address && network) {
        let url = '';
        if (address === 'eth' && network === EthereumNetwork.ethereum) {
          url = `${COINGECKO_URL}/ethereum`;
        }
        
        if (address === 'bnb' && network === EthereumNetwork.bsc) {
          url = `${COINGECKO_URL}/binancecoin`;
        }

        if (address === 'matic' && network === EthereumNetwork.matic) {
          url = `${COINGECKO_URL}/matic-network`;
        }

        if (
          Web3Wrapper.isAddress(address ?? '') &&
          network === EthereumNetwork.ethereum
        ) {
          url = `${getCoingeckoContractUrlFromNetwork(
            EthereumNetwork.ethereum,
          )}/${address}`;
        }

        if (
          Web3Wrapper.isAddress(address ?? '') &&
          network === EthereumNetwork.bsc
        ) {
          url = `${getCoingeckoContractUrlFromNetwork(
            EthereumNetwork.bsc,
          )}/${address}`;
        }

        if (
          Web3Wrapper.isAddress(address ?? '') &&
          network === EthereumNetwork.matic
        ) {
          url = `${getCoingeckoContractUrlFromNetwork(
            EthereumNetwork.matic,
          )}/${address}`;
        }
        return fetch(url)
          .then((r) => r.json())
          .then((r) => r as CoinDetailCoinGecko);
      }
    }, {staleTime: 60*60}
  );

  return {
    loading: tokenInfoQuery.isLoading,
    error: tokenInfoQuery.error && {message: 'Error loading details from Coingecko'},
    data: tokenInfoQuery.data,
  };
};
