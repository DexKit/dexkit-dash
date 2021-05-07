import { useEffect, useState } from "react";
import { useNetwork } from "./useNetwork";
import { Token } from "types/app";
import { NETWORK } from "shared/constants/AppEnums";
import { getBinanceTokens, getEthereumTokens } from "services/rest/tokens";

export const useTokens = (networkName: NETWORK) => {
  console.log('networkName', networkName)
  // const networkName = useNetwork();
  // const [tokens, setTokens] = useState<{[key: string]: Token}>({});
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {

      if (networkName === NETWORK.ETHEREUM) {
        getEthereumTokens()
        .then(e => setTokens(e))
        .catch(e => {
          setTokens([]);
        });

      }
      else if (networkName === NETWORK.BSC) {
        getBinanceTokens()
        .then(e => setTokens(e))
        .catch(e => {
          setTokens([]);
        });
      }
  }, [networkName]);

  return tokens;
}