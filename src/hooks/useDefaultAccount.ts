import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {initWallet} from 'redux/_ui/actions';
import {WALLET_INIT_STATE} from 'redux/_ui/reducers';
import {useRouteMatch} from 'react-router-dom';
import {Network, SupportedNetworkType} from 'types/blockchain';
import {isSupportedWalletType} from 'utils/wallet';
import {useMemo} from 'react';
import { Web3Wrapper } from '@0x/web3-wrapper';

export const useDefaultAccount = (network?: Network) => {
  let match = useRouteMatch<{account: string}>('/wallet/:account');

  const dispatch = useDispatch();
  let type: SupportedNetworkType = SupportedNetworkType.evm;
  if (network && isSupportedWalletType(network)) {
    type = network as any as SupportedNetworkType;
  }
  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  if (match && match.params) {
  }
  const urlAccount = useMemo(() => {
    if (match && match.params) {
      const {account} = match.params;
      if (account && Web3Wrapper.isAddress(account)) {
        return account;
      }
    }
  }, [match]);
  if (urlAccount) {
    return urlAccount;
  }

  if (!wallet) {
    dispatch(initWallet({wallet: WALLET_INIT_STATE}));
    return;
  }
  const accounts = wallet[type];
  if (accounts.length) {
    return accounts[0].address;
  }
};
