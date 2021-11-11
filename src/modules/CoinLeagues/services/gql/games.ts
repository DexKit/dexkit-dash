import { gql } from "graphql-tag";

export const GET_GAMES = gql`
  query GetGames($status: String!, $orderBy: String, $orderDirection: String) {
    games(first: 100, where: {status: $status}, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        startedAt
        endedAt
      }
  }
`;

export const GET_GAMES_WITH_PLAYER = gql`
  query GetGamesPlayer($status: String!, $accounts: [String], $player: String, $orderBy: String, $orderDirection: String) {
    games(first: 100, where: {status: $status, playerAddresses_contains: $accounts}, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        startedAt
        endedAt
        earnings(where: {player_contains: $player}){
          place
          amount
          claimed 
        }
      }
  }
`;

export const GET_ALL_GAMES_WITH_PLAYER = gql`
  query GetAllGamePlayer( $accounts: [String], $player: String) {
    games(first: 100, where: { playerAddresses_contains: $accounts}) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        startedAt
        endedAt
        createdAt
        earnings(where: {player_contains: $player}){
          place
          amount
          claimed 
        }
      }
  }
`;


export const GET_GAMES_WITH_DURATION = gql`
  query GetGamesWithDuration($status: String!, $duration: Int, $orderBy: String, $orderDirection: String ) {
    games(first: 100, where: {status: $status, duration: $duration }, orderBy: $orderBy, orderDirection: $orderDirection) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        startedAt
        endedAt
      }
  }
`;
