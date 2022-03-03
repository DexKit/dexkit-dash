import {gql} from '@apollo/client';

export const GET_ALL_GAMES = gql`
  query GetAllGames($status: String!, $first: Int!, $skip: Int!) {
    games(first: $first, skip: $skip, where: {status: $status}) {
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
