import { useEffect, useState } from "react";
import { useNetwork } from "./useNetwork";
import { Token } from "types/app";
import { NETWORK } from "shared/constants/AppEnums";
import { getBinanceTokens, getEthereumTokens } from "services/rest/tokens";

export const useTokens = (networkName: NETWORK) => {
  // const networkName = useNetwork();
  // const [tokens, setTokens] = useState<{[key: string]: Token}>({});
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    try {
      // const tokensFn = e.tokens.reduce<{[key: string]: Token}>((acc: any, item: any) => {
      //   acc[item.address] = {
      //     name: item.name,
      //     symbol: item.symbol,
      //     address: item.address,
      //     decimals: item.decimals,
      //     icon: item.logoURI
      //   };
      //   return acc;
      // }, {});

      if (networkName == NETWORK.ETHEREUM) {
        getEthereumTokens().then(e => setTokens(e));
      }
      else if (networkName == NETWORK.BSC) {
        getBinanceTokens().then(e => setTokens(e));
      }

    } catch (e) {
      setTokens([]);
    }
  }, [networkName]);

  return tokens;
}