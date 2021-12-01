import {useMemo, useCallback} from 'react';
import {useWeb3} from 'hooks/useWeb3';

import {usePlayerHoldingTokenBalances} from './usePlayerHoldingBalances';
import {useIsNFTGame} from './useCoinLeaguesFactory';
import {getChampionsCoinSymbol} from '../utils/champions';

export const useMultipliers = (address?: string) => {
  const {account} = useWeb3();
  const isNFTGame = useIsNFTGame();
  const holdingBalancesQuery = usePlayerHoldingTokenBalances(
    address,
    isNFTGame,
  );

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
      const multi =
        multiplierTokens &&
        addr &&
        multiplierTokens.find(
          (a) => a.playerAddress.toLowerCase() === addr.toLowerCase(),
        );
      if (multi && isNFTGame) {
        if (multi) {
          if (multi.isHoldingKitMultiplier || multi.isHoldingBittMultiplier) {
            return 1.3 * multi.championsMultiplier;
          } else {
            return 1.2 * multi.championsMultiplier;
          }
        }
        return 1.2;
      } else {
        return 1.2;
      }
    },
    [multiplierTokens, isNFTGame],
  );

  const tooltipMessage = useCallback(
    (addr?: string) => {
      const multi =
        multiplierTokens &&
        addr &&
        multiplierTokens.find(
          (a) => a.playerAddress.toLowerCase() === addr.toLowerCase(),
        );

      if (multi && isNFTGame && addr) {
        if (account && account.toLowerCase() === addr.toLowerCase()) {
          if (multi.isChampionsMultiplier) {
            if (multi.isHoldingBittMultiplier || multi.isHoldingKitMultiplier) {
              return `Congrats you are holding 50 KIT or 200 BITT and a ${getChampionsCoinSymbol(
                multi.rarity,
              )} to boost your multiplier to ${
                Number(multi.championsMultiplier * 1.3).toFixed(3)
              }`;
            } else {
              return `Congrats you ar holding a ${getChampionsCoinSymbol(
                multi.rarity
              )} to boost your multiplier to ${
                Number(multi.championsMultiplier * 1.2).toFixed(3)
              }`;
            }
          } else {
            if (multi.isHoldingBittMultiplier || multi.isHoldingKitMultiplier) {
              return 'Congrats you are holding 50 KIT or 200 BITT to boost your multiplier to 1.3';
            } else {
              return 'Hold 50 KIT or 200 BITT to boost multiplier to 1.3';
            }
          }
        } else {
          if (multi.isChampionsMultiplier) {
            if (multi.isHoldingBittMultiplier || multi.isHoldingKitMultiplier) {
              return `Player holding 50 KIT or 200 BITT and a ${getChampionsCoinSymbol(
                multi.rarity
              )} to boost your multiplier to ${
                Number(multi.championsMultiplier * 1.3).toFixed(3)
              }`;
            } else {
             return `Player holding a ${getChampionsCoinSymbol(
                multi.rarity,
              )} to boost your multiplier to ${
                Number(multi.championsMultiplier * 1.2).toFixed(3)
              }`;
            }
          } else {
            if (multi.isHoldingBittMultiplier || multi.isHoldingKitMultiplier) {
              return 'Player holding 50 KIT or 200 BITT';
            } else {
              return 'Hold 50 KIT or 200 BITT to boost multiplier to 1.3';
            }
          }
        }
      } else {
        return 'Captain coin with multiplier 1.2';
        // return 'Hold 50 KIT or 200 BITT to boost multiplier to 1.3';
      }
    },
    [multiplierTokens, account, isNFTGame],
  );

  return {
    tooltipMessage,
    multiplier,
    loadingMultiplier,
    holdingBalancesQuery,
  };
};
