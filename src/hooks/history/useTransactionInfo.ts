import { useChainId } from "../useChainId";
import { useQuery } from "@apollo/client";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { BITQUERY_TRANSACTION_INFO } from "services/graphql/bitquery/history/gql";
import { GetTransactionInfo, GetTransactionInfoVariables } from "services/graphql/bitquery/history/__generated__/GetTransactionInfo";

interface Props {
  hash: string
}

export const useTransactionInfo = ({hash}: Props) =>{
  const {currentChainId} = useChainId();

  const { loading, error, data } = useQuery<GetTransactionInfo, GetTransactionInfoVariables>(BITQUERY_TRANSACTION_INFO, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      hash: hash
    },
    pollInterval: POLL_INTERVAL
  });

  return { loading, error, data };
}