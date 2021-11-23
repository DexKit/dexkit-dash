import {gql} from '@apollo/client';

export const GET_NFT_IDs = gql`
  query GetNFTIDs(
    $receiver: String!
    $network: EthereumNetwork!
    $collection: String
  ) {
    ethereum(network: $network) {
      transfers(receiver: {is: $receiver}, currency: {is: $collection}) {
        amount
        currency {
          name
          tokenType
        }
        transaction {
          hash
        }
        entityId
      }
    }
  }
`;
