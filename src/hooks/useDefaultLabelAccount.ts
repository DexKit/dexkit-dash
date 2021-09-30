import { Web3Wrapper } from '@0x/web3-wrapper';
import { useMemo } from 'react';
import {useSelector} from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import {AppState} from 'redux/store';
import {Network, SupportedNetworkType} from 'types/blockchain';
import {isSupportedWalletType} from 'utils/wallet';

export const useDefaultLabelAccount = (network?: Network) => {
  let match = useRouteMatch<{account: string}>('/wallet/:account');


  let type: SupportedNetworkType = SupportedNetworkType.evm;
  if (network && isSupportedWalletType(network)) {
    type = (network as any) as SupportedNetworkType;
  }

  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const urlLabelAccount = useMemo(() => {
    if (match && match.params) {
      const {account} = match.params;
      if (account && Web3Wrapper.isAddress(account)) {
        const accounts = wallet[type];
        if (accounts && accounts.length) {
          const acc = accounts.find(a=> a.address.toLowerCase()=== account.toLowerCase());
          if(acc){
            return acc.label || acc.address
          }  
        }
        return account;
      }
    }
  }, [match]);
  if (urlLabelAccount) {
    return urlLabelAccount;
  }
  const accounts = wallet[type];
  if (accounts && accounts.length) {
    return accounts[0].label || accounts[0].address;
  }
};
