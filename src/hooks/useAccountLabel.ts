import {useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {Network, SupportedNetworkType} from 'types/blockchain';
import {isSupportedWalletType} from 'utils/wallet';
import {useDefaultLabelAccount} from './useDefaultLabelAccount';

export const useAccountLabel = (account?: string, network?: Network) => {
  let type: SupportedNetworkType = SupportedNetworkType.evm;
  if (network && isSupportedWalletType(network)) {
    type = network as any as SupportedNetworkType;
  }
  const label = useDefaultLabelAccount();
  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  if (!account) {
    return label;
  }

  const accounts = wallet[type];
  if (accounts && accounts.length) {
    const acc = accounts.find(
      (a) => a.address.toLowerCase() === account.toLowerCase(),
    );
    if (acc) {
      return acc.label || acc.address;
    }
  }
};
