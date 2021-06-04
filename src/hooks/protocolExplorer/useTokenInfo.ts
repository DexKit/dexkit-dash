import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';

import {BITQUERY_TOKEN_INFO} from 'services/graphql/bitquery/protocol/gql';
import {
  GetTokenInfo,
  GetTokenInfoVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenInfo';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import { EthereumNetwork } from '../../../__generated__/globalTypes';

interface Props {
  networkName: EthereumNetwork;
  address: string;
}

export const useTokenInfo = ({address, networkName}: Props) => {

  const {loading, error, data} = useQuery<GetTokenInfo, GetTokenInfoVariables>(
    BITQUERY_TOKEN_INFO,
    {
      variables: {
        network: networkName,
        address: address,
      },
      pollInterval: POLL_INTERVAL,
    },
  );

  return {loading, error, data};
};
