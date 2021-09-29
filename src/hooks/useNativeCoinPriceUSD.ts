import {useState, useEffect} from 'react';
import {COINGECKO_URL_SIMPLE_PRICE} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';

export const useNativeCoinPriceUSD = (network: EthereumNetwork) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string} | undefined>();
  const [data, setData] = useState<number | undefined>();

  useEffect(() => {
    setLoading(true);
    let id = 'ethereum';

    let url = `${COINGECKO_URL_SIMPLE_PRICE}?ids=${id}&vs_currencies=usd`;

    if (network === EthereumNetwork.bsc) {
      id = 'binancecoin';
      url = `${COINGECKO_URL_SIMPLE_PRICE}?ids=${id}&vs_currencies=usd`;
    } else if (network === EthereumNetwork.matic) {
      id = 'matic-network';
      url = `${COINGECKO_URL_SIMPLE_PRICE}?ids=${id}&vs_currencies=usd`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(Number(d[id].usd)))
      .catch((e) => {
        //console.log(e);
        setError({message: 'No Data on Coingecko for this token'});
      })
      .finally(() => setLoading(false));
  }, [network]);

  return {loading, error, data};
};
