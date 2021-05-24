import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';

import {BITQUERY_TOKEN_INFO} from 'services/graphql/bitquery/protocol/gql';
import {
  GetTokenInfo,
  GetTokenInfoVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenInfo';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';

interface Props {
  address: string;
}

export const useTokenInfo = ({address}: Props) => {
  const {currentChainId} = useChainId();

  const {loading, error, data} = useQuery<GetTokenInfo, GetTokenInfoVariables>(
    BITQUERY_TOKEN_INFO,
    {
      variables: {
        network: GET_NETWORK_NAME(currentChainId),
        address: address,
      },
      pollInterval: POLL_INTERVAL,
    },
  );

  return {loading, error, data};
};
