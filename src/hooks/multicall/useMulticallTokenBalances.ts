import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {getTokenBalances} from 'services/multicall';
import {Web3State} from 'types/blockchain';

export const useMulticallTokenBalances = (
  token_addresses?: string[],
  account?: string,
) => {
  const {web3State} = useWeb3();

  const tokenBalancesQuery = useQuery(
    ['GET_TOKEN_BALANCES', web3State, account, token_addresses],
    async () => {
      if (web3State !== Web3State.Done) {
        return;
      }
      if (!account || !token_addresses) {
        return;
      }
      const [, tb] = await getTokenBalances(token_addresses, account);
      return token_addresses.map((a) => {
        return {
          address: a,
          balance: tb[a],
        };
      });
    },
  );

  return tokenBalancesQuery;
};
