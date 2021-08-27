import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import { initWallet } from 'redux/_ui/actions';
import { WALLET_INIT_STATE } from 'redux/_ui/reducers';

import {Network, SupportedNetworkType} from 'types/blockchain';
import {isSupportedWalletType} from 'utils/wallet';

export const useDefaultAccount = (network?: Network) => {
  const dispatch = useDispatch()
  let type: SupportedNetworkType = SupportedNetworkType.evm;
  if (network && isSupportedWalletType(network)) {
    type = (network as any) as SupportedNetworkType;
  }
  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  if(!wallet){
    dispatch(initWallet({wallet: WALLET_INIT_STATE}))
    return;
  }
  const accounts = wallet[type];
  if (accounts.length) {
    return accounts[0].address;
  }
};
