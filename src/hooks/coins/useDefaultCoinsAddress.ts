import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { SupportedNetworkType } from 'types/blockchain';

/**
 * First address's of each supported coin
 * @returns 
 */
export const useDefaultCoinsAddress = () => {

    const wallet = useSelector<AppState, AppState['ui']['wallet']>(
        (state) => state.ui.wallet,
      );

    const getDefaultBTCWallet = () => {
        if(wallet && wallet[SupportedNetworkType.bitcoin] && wallet[SupportedNetworkType.bitcoin].length){
          return wallet[SupportedNetworkType.bitcoin][0].address;
        }
    }

    return {btcAddress: getDefaultBTCWallet() }
  


}







