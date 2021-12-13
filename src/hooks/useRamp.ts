import {useCallback} from 'react';
import {useWeb3} from './useWeb3';

type Props = {
  defaultCurrency?: string;
};

export function useRamp(props: Props) {
  const {defaultCurrency} = props;
  const {account} = useWeb3();
  /* eslint-disable */
  const initRamp = useCallback(() => {
    import('@ramp-network/ramp-instant-sdk').then((ramp) => {
      new ramp.RampInstantSDK({
        hostAppName: 'DexKit',
        swapAsset: defaultCurrency,
        userAddress: account,
        hostLogoUrl: `${window.location.origin}/logo192.png`,
        hostApiKey: 'zwcb8enuk9dd7a37pwczsh7j5qahsomcdnmoj72r',
      }).show();
    });
  }, [defaultCurrency, account]);

  return {
    initRamp,
  };
}
