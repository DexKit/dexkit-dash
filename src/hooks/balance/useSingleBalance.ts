import {useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';

import {BITQUERY_SINGLE_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {
  GetSingleBalance_ethereum_address_balances,
  GetSingleBalance,
  GetSingleBalanceVariables,
} from 'services/graphql/bitquery/balance/__generated__/GetSingleBalance';
import {useQuery} from '@apollo/client';
import {getCurrency} from 'utils/bitquery';

export const useSingleBalance = (
  address: string,
  network: EthereumNetwork,
  defaultAccount?: string,
) => {
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;

  const [
    data,
    setData,
  ] = useState<GetSingleBalance_ethereum_address_balances>();

  const {loading, error, data: dataFn} = useQuery<
    GetSingleBalance,
    GetSingleBalanceVariables
  >(BITQUERY_SINGLE_BALANCE_INFO, {
    variables: {
      network,
      currency: getCurrency(network, address) as string,
      address: account as string,
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (
      dataFn &&
      dataFn.ethereum?.address &&
      dataFn.ethereum.address.length &&
      dataFn.ethereum.address[0].balances &&
      dataFn.ethereum.address[0].balances.length
    ) {
      setData(dataFn.ethereum.address[0].balances[0]);
    }
  }, [dataFn]);

  return {loading, error, data};
};
