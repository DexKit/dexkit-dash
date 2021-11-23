import {useNetwork} from 'hooks/useNetwork';
import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {getBalance} from 'services/web3modal';

export const useActiveChainBalance = () => {
  const network = useNetwork();

  const {account} = useWeb3();

  const {data, isLoading} = useQuery(
    ['GetActiveChainBalance', network, account],
    () => {
      if (account && network) {
        return getBalance(account);
      }
    },
  );

  return {balance: data, isLoading, account, network};
};
