import {useMemo, useCallback} from 'react';
import {useWeb3} from 'hooks/useWeb3';

import {usePlayerHoldingTokenBalances} from './usePlayerHoldingBalances';

export const useMultipliers = (address?: string) => {
  const holdingBalancesQuery = usePlayerHoldingTokenBalances(address);
  const {account} = useWeb3();

  const multiplierTokens = useMemo(() => {
    if (holdingBalancesQuery.data) {
      const multipliers = holdingBalancesQuery.data.filter(
        (t) => t.isHoldingMultiplier,
      );
      if (multipliers.length) {
        return multipliers;
      }
    }
  }, [holdingBalancesQuery.data]);

  const loadingMultiplier = holdingBalancesQuery.isLoading;

  const multiplier = useCallback(
    (addr?: string) => {
      if (
        multiplierTokens &&
        addr &&
        multiplierTokens.find(
          (a) => a.playerAddress.toLowerCase() === addr.toLowerCase(),
        )
      ) {
        return 1.2;
      } else {
        return 1.2;
      }
    },
    [multiplierTokens],
  );

  const tooltipMessage = useCallback(
    (addr?: string) => {
      /*if (multiplierTokens && addr && multiplierTokens.find(a=> a.playerAddress.toLowerCase() === addr.toLowerCase())) {
        if(account && account.toLowerCase() === addr.toLowerCase()){
          return "Congrats you are holding 50 KIT or 200 BITT to boost your multiplier to 1.3"
        }else{
          return "Player holding 50 KIT or 200 BITT"
        }
       
      } else {
        return "Hold 50 KIT or 200 BITT to boost multiplier to 1.3"
      }*/
      return 'Captain coin with multiplier 1.2';
    },
    [multiplierTokens, account],
  );

  return {
    tooltipMessage,
    multiplier,
    loadingMultiplier,
    holdingBalancesQuery,
  };
};
