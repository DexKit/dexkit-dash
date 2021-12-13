import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Network, SupportedNetworkType} from 'types/blockchain';
import {isSupportedWalletType} from 'utils/wallet';

export const useDefaultLabelAccount = (network?: Network) => {
  let type: SupportedNetworkType = SupportedNetworkType.evm;
  if (network && isSupportedWalletType(network)) {
    type = network as any as SupportedNetworkType;
  }

  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  const accounts = wallet[type];
  if (accounts && accounts.length) {
    return accounts[0].label || accounts[0].address;
  }
};
