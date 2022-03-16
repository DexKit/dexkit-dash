import { gql } from '@apollo/client';

export const GET_ALL_GAMES = gql`
  query GetAllGames($status: String!, $first: Int!, $skip: Int!) {
    games(first: $first, skip: $skip, where: {status: $status}) {
      id
      intId
      status
      currentRound
      createdAt
      startedAt
      startsAt
      pastRoundChallengeResult
      currentRoundTotalPlayers
      currentRoundSetupAt
      currentRoundStartsAt
      currentRoundEndsAt
      currentRoundType
      endedAt
      createdBy
      duration
      entry
    }
  }
`;
/**
 * TODO: Players have no limit on players, we likely need to pass first, skip to it, the same for earning field
 */
export const GET_GAME = gql`
  query GetGame($id: String, $first: Int!, $skip: Int!) {
    game(id: $id) {
      id
      intId
      status
      currentRound
      createdAt
      startedAt
      startsAt
      pastRoundChallengeResult
      currentRoundTotalPlayers
      currentRoundSetupAt
      currentRoundStartsAt
      currentRoundEndsAt
      currentRoundType
      endedAt
      createdBy
      duration
      entry
      players(first: $first, skip: $skip) {
        id
        player {
          id
        }
      }
      earning(first: $first, skip: $skip) {
        id
        player {
          id
        }
        amount
        claimed
      }
    }
  }
`;

export const GET_PLAYERS_FROM_GAME = gql`
  query GetPlayersFromGame($id: String, $first: Int!, $skip: Int! ) {
    game(id: $id) {
      players(first: $first, skip: $skip ) {
        player {
          id
        }
      }
    }
  }
`;
