import { useEffect, useState } from "react";

import { NETWORK } from "shared/constants/AppEnums";
import { getBinanceTokens, getEthereumTokens } from "services/rest/tokens";
import { TokenInfo } from "@types";
import { useNetwork } from "./useNetwork";
// useEffect is being triggered multiple times when called inside pairs
let alreadyCalled  = false;
export const useTokens = () => {

  const networkName = useNetwork();
  // const [tokens, setTokens] = useState<{[key: string]: Token}>({});
  const [tokens, setTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
      if(alreadyCalled){
        return;
      }
      alreadyCalled = true;
      if (networkName === NETWORK.ETHEREUM) {
        getEthereumTokens()
        .then(e => setTokens(e))
        .catch(e => {
          setTokens([]);
        }).finally(() => alreadyCalled = false);

      }
      else if (networkName === NETWORK.BSC) {
        getBinanceTokens()
        .then(e => setTokens(e))
        .catch(e => {
          setTokens([]);
        }).finally(() => alreadyCalled = false);
      }
  }, [networkName]);

  return tokens;
}