import { gql } from "graphql-tag";


export const GET_RANKING_MOST_WINNED = gql`
  query GetRankingMostWinned() {
    players(first: 100, orderBy: totalWinnedGames, orderDirection: desc) {
          id
          totalWinnedGames
          totalJoinedGames
          totalFirstWinnedGames
          totalThirdWinnedGames
          totalSecondWinnedGames
        }
      }
      
  }
`;

export const GET_RANKING_MOST_JOINED = gql`
  query GetRankingMostJoined() {
    players(first: 100, orderBy: totalJoinedGames, orderDirection: desc) {
      id
      totalWinnedGames
      totalJoinedGames
      totalFirstWinnedGames
      totalThirdWinnedGames
      totalSecondWinnedGames
    }
  }
`;