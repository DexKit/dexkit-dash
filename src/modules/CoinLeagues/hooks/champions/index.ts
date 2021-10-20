import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';

import {BigNumber} from '@ethersproject/bignumber';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useQuery} from 'react-query';
import {getTokenBalances} from 'services/multicall';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {DEXKIT, BITTOKEN} from 'shared/constants/tokens';
import {Token} from 'types/app';
import {ChainId} from 'types/blockchain';

export function useChampionMint() {
  const {getProvider, web3State, chainId} = useWeb3();

  const mint = useCallback(() => {}, []);

  return {};
}

// export const useHoldingTokenBalances = (account?: string) => {
//   const {web3State, chainId} = useWeb3();

//   const networkProvider = useNetworkProvider(EthereumNetwork.matic);

//   const query = useQuery(
//     ['GET_COIN_LEAGUES_BALANCES', account, chainId],
//     async () => {
//       if (account && chainId) {
//         const DexKit = DEXKIT[chainId] as ;
//         const Bitt = BITTOKEN[chainId];

//         const tokens = [DexKit, Bitt];

//         const [, tb] = await getTokenBalances(
//           (tokens.filter((t) => t !== undefined) as Token[]).map(
//             (t) => t.address,
//           ),
//           account,
//           networkProvider,
//         );

//         return (tokens.filter((t) => t !== undefined) as Token[]).map((t) => {
//           return {
//             token: t,
//             balance: tb[t.address],
//           };
//         });
//       }
//     },
//   );

//   return query;
// };
