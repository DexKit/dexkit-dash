import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';

import {BITQUERY_TOKEN_STATISTICS} from 'services/graphql/bitquery/protocol/gql';
import {
  GetTokenStatistics,
  GetTokenStatisticsVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenStatistics';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import { EthereumNetwork } from '../../../__generated__/globalTypes';

interface Props {
  address: string;
  networkName: EthereumNetwork;
}

export const useTokenStatistics = ({address, networkName}: Props) => {

  const {loading, error, data} = useQuery<
    GetTokenStatistics,
    GetTokenStatisticsVariables
  >(BITQUERY_TOKEN_STATISTICS, {
    variables: {
      network: networkName,
      address: address,
    },
    pollInterval: POLL_INTERVAL,
  });

  return {loading, error, data};
};
