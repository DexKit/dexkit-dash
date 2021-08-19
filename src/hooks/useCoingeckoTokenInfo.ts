import {Web3Wrapper} from '@0x/web3-wrapper';
import {useState, useEffect} from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | undefined>();
  const [data, setData] = useState<CoinDetailCoinGecko | undefined>();

  useEffect(() => {
    setLoading(true);

    let url = `${COINGECKO_URL}/ethereum`;
    if (address === 'bnb' && network === EthereumNetwork.bsc) {
      url = `${COINGECKO_URL}/binancecoin`;
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

    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch((e) => {
        //console.log(e);
        setError({message: 'No Data on Coingecko for this token'});
      })
      .finally(() => setLoading(false));
  }, [address, network]);

  return {loading, error, data};
};
