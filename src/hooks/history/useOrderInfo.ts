import { useChainId } from "../useChainId";
import { useQuery } from "@apollo/client";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { BITQUERY_ORDER_INFO } from "services/graphql/bitquery/history/gql";
import { GetOrderInfo, GetOrderInfoVariables } from "services/graphql/bitquery/history/__generated__/GetOrderInfo";

interface Props {
  hash: string
}

export const useOrderInfo = ({hash}: Props) =>{
  const {currentChainId} = useChainId();

  const { loading, error, data } = useQuery<GetOrderInfo, GetOrderInfoVariables>(BITQUERY_ORDER_INFO, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      hash: hash
    },
    pollInterval: POLL_INTERVAL
  });

  return { loading, error, data };
}