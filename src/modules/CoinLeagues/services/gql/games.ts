import { gql } from "graphql-tag";

export const GET_GAMES = gql`
  query GetGames($status: String!) {
    games(first: 100, where: {status: $status}) {
        id
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
  query GetGames($status: String!, $accounts: [String], $player: String) {
    games(first: 100, where: {status: $status, playerAddresses_contains: $accounts}) {
        id
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
        }
      }
  }
`;

export const GET_ALL_GAMES_WITH_PLAYER = gql`
  query GetGames( $accounts: [String], $player: String) {
    games(first: 100, where: { playerAddresses_contains: $accounts}) {
        id
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
        }
      }
  }
`;


export const GET_GAMES_WITH_DURATION = gql`
  query GetGames($status: String!, $duration: Int) {
    games(first: 100, where: {status: $status, duration: $duration}) {
        id
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
