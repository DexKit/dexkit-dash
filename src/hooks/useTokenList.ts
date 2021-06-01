import { useEffect, useState } from "react";
import { getBinanceTokens, getEthereumTokens } from "services/rest/tokens";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { Token } from "types/app";
import { useNetwork } from "./useNetwork";

export const useTokenList = () => {
  // const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId);
  const networkName = useNetwork();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (networkName === EthereumNetwork.bsc) {
      getBinanceTokens()
        .then(e  => setTokens(e))
        .catch(e => setTokens([]));
    }
    else {
      getEthereumTokens()
        .then(e  => {
          e.push({
            address: '',
            decimals: 18,
            name: 'Ethereum',
            symbol: 'ETH'
          });

          setTokens(e);
        })
        .catch(e => setTokens([]));
    }
  }, [networkName]);

  return tokens;
}