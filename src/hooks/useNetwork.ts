import { useWeb3 } from "./useWeb3";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { useEffect, useState } from "react";
import { NETWORK } from "shared/constants/AppEnums";
import { BigNumber } from "@0x/utils";

export const useNetwork = (): NETWORK => {
  const { chainId } = useWeb3();
  const [ networkName, setNetworkName] = useState(GET_NETWORK_NAME(chainId));
  useEffect(() => {
    const aux = new BigNumber(chainId ?? 1).toNumber();
    setNetworkName(GET_NETWORK_NAME(aux));
  }, [chainId]);
  return networkName;
}