import { useEffect, useState } from "react";
import { BigNumber } from "@0x/utils";
import { useChainId } from "./useChainId";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";

export const useNetwork = (): EthereumNetwork => {
  const { currentChainId } = useChainId();
  const [networkName, setNetworkName] = useState<EthereumNetwork>(GET_NETWORK_NAME(currentChainId));

  useEffect(() => {
    const aux = new BigNumber(currentChainId ?? 1).toNumber();
    setNetworkName(GET_NETWORK_NAME(aux));
  }, [currentChainId]);

  return networkName;
}