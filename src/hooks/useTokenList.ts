import {EthereumNetwork} from 'shared/constants/AppEnums';

import {useTokenLists} from './useTokenLists';

export const useTokenList = (networkName: EthereumNetwork) => {
  const tokens = useTokenLists();
  if (networkName === EthereumNetwork.bsc) {
    return tokens.binanceTokens || [];
  } else if (networkName === EthereumNetwork.matic) {
    return tokens.maticTokens || [];
  } else {
    return tokens.ethTokens || [];
  }
};
