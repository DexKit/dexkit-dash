import {gql} from '@apollo/client';

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
  query GetGame($id) {
    game($id) {
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
      players {
        id
        player {
          id
        }
      }
      earning {
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
