import { useQuery } from "@apollo/client";
import { SEARCH_BY_ADDRESS } from "services/graphql/bitquery/gql";
import { SearchByAddress, SearchByAddressVariables } from "services/graphql/bitquery/__generated__/SearchByAddress";
import { useNetwork } from "./useNetwork";

export const useSearch = (value: string) => {
  const networkName: any = useNetwork();

  const {loading, error, data} = useQuery<SearchByAddress, SearchByAddressVariables>(SEARCH_BY_ADDRESS, {
    variables: {
      network: networkName,
      value: value
    }
  });

  return {loading, error, data};
}