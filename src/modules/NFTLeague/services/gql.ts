import {gql} from '@apollo/client';
import {GameStatus} from '../constants/enum';

export const GET_ALL_GAMES = gql`
  query GetAllGames($status: String = null, $first: Int!, $skip: Int!) {
    games(
      first: $first
      skip: $skip
      where: {status: $status}
      orderBy: createdAt
    ) {
      id
      type
      status
      duration
      startsAt
      startedAt
      endedAt
      entry
      players {
        id
        player {
          id
        }
      }
    }
  }
`;

// FIXME: find a better way to do this in thegraph.
export function GET_NFT_LEAGUE_QUERY(status?: GameStatus, account?: string) {
  let whereParam = '';
  const params = [];

  if (status !== undefined) {
    params.push(`status: ${status}`);
  }

  if (account !== undefined) {
    params.push(`playerAddresses_contains: ["${account.toLowerCase()}"]`);
  }

  if (status !== undefined || account !== undefined) {
    whereParam = `where: {${params.join(',')}},`;
  }

  return gql`
    query GetAllGames($status: String = null, $first: Int!, $skip: Int!) {
      games(
        first: $first
        skip: $skip,
        ${whereParam}
        orderBy: createdAt
      ) {
        id
        type
        status
        duration
        startsAt
        startedAt
        endedAt
        entry
        players {
          id
          player {
            id
          }
        }
      }
    }
  `;
}

export const GET_GAME = gql`
  query getGame($id: ID!) {
    game(id: $id) {
      id
      type
      status
      duration
      startsAt
      startedAt
      endedAt
      entry
      players {
        id
        player {
          id
        }
      }
    }
  }
`;
