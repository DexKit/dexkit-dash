import { useEffect, useState } from "react";
import { getBinanceTokens, getEthereumTokens } from "services/rest/tokens";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { Token } from "types/app";

export const useTokenList = (networkName: EthereumNetwork) => {
  // const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (networkName === EthereumNetwork.bsc) {
      console.log('on Binance List');
      getBinanceTokens()
        .then(e  => {
          e.push({
            address: '',
            decimals: 18,
            name: 'Binance',
            symbol: 'BNB'
          }) 
          e.push({
            address: '0x314593fa9a2fa16432913dbccc96104541d32d11',
            decimals: 18,
            name: 'DexKit',
            symbol: 'KIT'
          }) 
          setTokens(e)}
          )
        .catch(e => { 
          console.log(e);
          console.log('error');
          
          setTokens([])
        
        });
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