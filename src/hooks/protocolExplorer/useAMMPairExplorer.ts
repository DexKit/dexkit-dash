import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';

import {BITQUERY_AMM_PAIR_EXPLORER} from 'services/graphql/bitquery/protocol/amm.gql';
import {
  GetAMMPairExplorer,
  GetAMMPairExplorerVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetAMMPairExplorer';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {GET_DEFAULT_QUOTE} from 'shared/constants/Blockchain';
import {EXCHANGE} from 'shared/constants/AppEnums';

interface Props {
  address: string;
  exchange: EXCHANGE;
}

export const useAMMPairExplorer = ({address, exchange}: Props) => {
  const {currentChainId} = useChainId();

  const {loading, error, data} = useQuery<
    GetAMMPairExplorer,
    GetAMMPairExplorerVariables
  >(BITQUERY_AMM_PAIR_EXPLORER, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      exchangeName: exchange,
      pairAddress: address,
      quoteAddress: GET_DEFAULT_QUOTE(currentChainId) as string,
    },
    pollInterval: POLL_INTERVAL,
  });

  return {loading, error, data};
};
