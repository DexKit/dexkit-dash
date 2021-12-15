import {BigNumber} from '@ethersproject/bignumber';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useQuery} from 'react-query';
import {getTokenBalances} from 'services/multicall';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {DEXKIT, BITTOKEN} from 'shared/constants/tokens';
import {Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {
  BITTOKEN_MULTIPLIER_HOLDING,
  DEXKIT_MULTIPLIER_HOLDING,
} from '../constants';

type TokenWithMultiplier = Token & {
  multiplierHolding: BigNumber;
};

export const useHoldingTokenBalances = (account?: string) => {
  const networkProvider = useNetworkProvider(EthereumNetwork.matic);

  const tokenBalancesQuery = useQuery(
    ['GET_LEAGUES_TOKEN_BALANCES', account],
    async () => {
      if (!account) {
        return;
      }
      const DexKit = DEXKIT[ChainId.Matic] as TokenWithMultiplier;
      DexKit.multiplierHolding = DEXKIT_MULTIPLIER_HOLDING;
      const Bitt = BITTOKEN[ChainId.Matic] as TokenWithMultiplier;
      Bitt.multiplierHolding = BITTOKEN_MULTIPLIER_HOLDING;
      const tokens = [DexKit, Bitt];

      const [, tb] = await getTokenBalances(
        tokens.map((t) => t.address),
        account,
        networkProvider,
      );
      return tokens.map((t) => {
        return {
          token: t,
          balance: tb[t.address],
          isHoldingMultiplier: tb[t.address].gte(t.multiplierHolding),
        };
      });
    },
  );

    const [, tb] = await getTokenBalances(
      tokens.map((t) => t.address),
      account,
      networkProvider,
    );
    return tokens.map((t) => {
      return {
        token: t,
        balance: tb[t.address],
        isHoldingMultiplier: tb[t.address].gte(t.multiplierHolding),
      };
    });
  });
};
