import {gql} from 'graphql-tag';

export const GET_RANKING_MOST_WINNED = gql`
  {
    players(
      first: 100
      orderBy: totalWinnedGames
      orderDirection: desc
      where: {totalWinnedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
    }
  }
`;

export const GET_RANKING_MOST_JOINED = gql`
  {
    players(
      first: 100
      orderBy: totalJoinedGames
      orderDirection: desc
      where: {totalJoinedGames_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
    }
  }
`;

export const GET_RANKING_MOST_EARNED = gql`
  {
    players(
      first: 100
      orderBy: totalEarned
      orderDirection: desc
      where: {totalEarned_gt: 0}
    ) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
      totalEarned
    }
  }
`;
