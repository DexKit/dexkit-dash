import {EthereumNetwork} from 'shared/constants/AppEnums';

import {useTokenLists} from './useTokenLists';

export const useTokenList = (networkName: EthereumNetwork) => {
  const tokens = useTokenLists();
  if (networkName === EthereumNetwork.bsc) {
    return tokens.binanceTokens || [];
  } else {
    return tokens.ethTokens || [];
  }
};
