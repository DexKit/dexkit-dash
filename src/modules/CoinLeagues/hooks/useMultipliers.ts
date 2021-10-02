import { useMemo } from "react";
import { useHoldingTokenBalances } from "./useHoldingTokenBalances";




export const useMultipliers = (account?: string) => {
    const holdingBalancesQuery = useHoldingTokenBalances(account);

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
  
    const multiplier = useMemo(() => {
      if (multiplierTokens) {
        return 1.3;
      } else {
        return 1.2;
      }
    }, [multiplierTokens]);
  
    const tooltipMessage = useMemo(() => {
      if (multiplierTokens) {
        return "Congrats you are holding 50 KIT or 200 BITT to boost your multiplier to 1.3"
      } else {
        return "Hold 50 KIT or 200 BITT to boost multiplier to 1.3"
      }
    }, [multiplierTokens]);


    return {
        tooltipMessage,
        multiplier,
        loadingMultiplier,
        holdingBalancesQuery

    }

}