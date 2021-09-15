import {CoinsProps} from 'modules/Dashboard/Wallet/DefiCoins';
import {useEffect, useState} from 'react';
import {getDefiBalances, parseDefiAssets} from 'services/defi';

export const useDefi = (address: string | undefined) => {
  const [defiBalance, setDefiBalance] = useState<CoinsProps>({} as CoinsProps);

  /*useEffect(() => {
    if (address) {
      getDefiBalances(address).then((e) => setDefiBalance(parseDefiAssets(e)));
    } else {
      setDefiBalance({} as CoinsProps);
    }
  }, [address]);*/

  return {defiBalance};
};
