import { useDefaultAccount } from "hooks/useDefaultAccount"
import { useQuery } from "react-query";
import { client } from "services/graphql/bitquery";
import { GET_NFT_IDs } from "services/graphql/bitquery/nft/gql";
import { GetNFTIDs, GetNFTIDsVariables } from "services/graphql/bitquery/nft/__generated__/GetNFTIDs";
import { EthereumNetwork } from "shared/constants/AppEnums";





export const useCollectionIds = (address: string, networkName: EthereumNetwork) => {
  const account = useDefaultAccount();
  const tokenIdsQuery = useQuery(['GetCollectionTokenIds', address, account, networkName], () => {
        if(address && account){
          return client.query<GetNFTIDs, GetNFTIDsVariables>({
            query: GET_NFT_IDs,
            variables: {
              receiver: account,
              network: networkName,
              collection: address
            },
            errorPolicy: 'none',
          }).then(d => {
            if(d && d.data.ethereum && d.data.ethereum?.transfers && d.data.ethereum?.transfers){
              return d.data.ethereum?.transfers.filter(t => t.entityId).map(t => t.entityId as string);
            }
          })
        }
  })

  return tokenIdsQuery

}