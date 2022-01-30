import {useWeb3} from 'hooks/useWeb3';
import {useHistory} from 'react-router-dom';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {ChainId} from 'types/blockchain';
import {GET_LEAGUES_CHAIN_ID} from '../utils/constants';

export const useLeaguesChainInfo = () => {
  const {chainId: walletChainId} = useWeb3();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const chainFromSearch =
    searchParams.get('network') === EthereumNetwork.matic
      ? ChainId.Matic
      : searchParams.get('network') === EthereumNetwork.bsc
      ? ChainId.Binance
      : null;
  const chainId = GET_LEAGUES_CHAIN_ID(chainFromSearch || walletChainId);
  const chainFromSearchName =
    searchParams.get('network') === EthereumNetwork.matic
      ? EthereumNetwork.matic
      : searchParams.get('network') === EthereumNetwork.bsc
      ? EthereumNetwork.bsc
      : null;

  const coinSymbol = GET_CHAIN_NATIVE_COIN(chainId);

  return {
    coinSymbol,
    chainId: chainId,
    chainFromSearchName,
  };
};
