import { useState, useCallback } from 'react';

import {
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameStakeAmount,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';

export interface GameFiltersState {
  numberOfPlayers: NumberOfPLayers;
  setNumberOfPlayers: (value: NumberOfPLayers) => void;
  stakeAmount: GameStakeAmount;
  setStakeAmount: (value: GameStakeAmount) => void;
  gameLevel: GameLevel;
  setGameLevel: (value: GameLevel) => void;
  gameType: GameType;
  setGameType: (value: GameType) => void;
  setDuration: (value: GameDuration) => void;
  duration: GameDuration;
  setIsBitboy: (value: boolean) => void;
  isBitboy: boolean;
  setIsMyGames: (value: boolean) => void;
  isMyGames: boolean;
  setIsJackpot: (value: boolean) => void;
  isJackpot: boolean;
  setOrderByGame: (value: GameOrderBy) => void;
  orderByGame: GameOrderBy;
  reset(): void;
  isModified(): boolean;
}

export function useGamesFilters(): GameFiltersState {
  const [orderByGame, setOrderByGame] = useState(GameOrderBy.HighLevel);
  const [numberOfPlayers, setNumberOfPlayers] = useState<NumberOfPLayers>(
    NumberOfPLayers.ALL,
  );
  const [stakeAmount, setStakeAmount] = useState<GameStakeAmount>(
    GameStakeAmount.ALL,
  );
  const [gameLevel, setGameLevel] = useState<GameLevel>(GameLevel.All);
  const [gameType, setGameType] = useState<GameType>(GameType.ALL);
  const [duration, setDuration] = useState<GameDuration>(GameDuration.ALL);

  const [isBitboy, setIsBitboy] = useState(false);
  const [isJackpot, setIsJackpot] = useState(false);
  const [isMyGames, setIsMyGames] = useState(false);

  const reset = useCallback(() => {
    setOrderByGame(GameOrderBy.HighLevel);
    setNumberOfPlayers(NumberOfPLayers.ALL);
    setStakeAmount(GameStakeAmount.ALL);
    setGameLevel(GameLevel.All);
    setGameType(GameType.ALL);
    setDuration(GameDuration.ALL);
    setIsBitboy(false);
    setIsJackpot(false);
    setIsMyGames(false);
  }, []);

  const isModified = useCallback(() => {
    return (
      orderByGame !== GameOrderBy.HighLevel ||
      isMyGames ||
      isBitboy ||
      isJackpot ||
      duration !== GameDuration.ALL ||
      numberOfPlayers !== NumberOfPLayers.ALL ||
      stakeAmount !== GameStakeAmount.ALL ||
      gameLevel !== GameLevel.All ||
      gameType !== GameType.ALL
    );
  }, [
    orderByGame,
    isMyGames,
    isBitboy,
    isJackpot,
    duration,
    numberOfPlayers,
    stakeAmount,
    gameLevel,
    gameType,
  ]);

  return {
    orderByGame,
    setOrderByGame,
    isModified,
    isMyGames,
    setIsMyGames,
    isBitboy,
    setIsBitboy,
    isJackpot,
    setIsJackpot,
    duration,
    setDuration,
    numberOfPlayers,
    setNumberOfPlayers,
    stakeAmount,
    setStakeAmount,
    gameLevel,
    setGameLevel,
    gameType,
    setGameType,
    reset,
  };
}
