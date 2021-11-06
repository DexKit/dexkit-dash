import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useMemo} from 'react';
import {
  COIN_LEAGUES_FACTORY_ADDRESS,
  createGame,
  getCreatedGamesAddressFromFactory,
  getEndedGamesAddressFromFactory,
  getGamesAddressFromFactory,
  getStartedGamesAddressFromFactory,
} from 'modules/CoinLeagues/services/coinLeaguesFactory';
import {Web3State} from 'types/blockchain';
import {GameParams} from 'types/coinsleague';
import {getGamesData} from '../services/coinLeagues';
import {useQuery} from 'react-query';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {GET_LEAGUES_CHAIN_ID} from '../utils/constants';
import {useParams} from 'react-router-dom';
import {COINSLEAGUE_ROUTE} from 'shared/constants/routes';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useCoinLeaguesFactoryRoutes = () => {
  const {chainId} = useWeb3();
  const {room} = useParams<{room: string}>();

  const factoryAddress = useMemo(() => {
    return room
      ? room
      : COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId, room]);

  const enterGameRoute = useCallback(
    (address: string) => {
      if (room) {
        return `${COINSLEAGUE_ROUTE}/room/${room}/game/${address}`;
      } else {
        return `${COINSLEAGUE_ROUTE}/${address}`;
      }
    },
    [room],
  );

  const activeGamesRoute = useMemo(() => {
    if (room) {
      return `${COINSLEAGUE_ROUTE}/room/${room}/active-games`;
    } else {
      return `${COINSLEAGUE_ROUTE}/active-games`;
    }
  }, [room]);

  const listGamesRoute = useMemo(() => {
    if (room) {
      return `${COINSLEAGUE_ROUTE}/room/${room}`;
    } else {
      return `${COINSLEAGUE_ROUTE}`;
    }
  }, [room]);


  return {
    enterGameRoute,
    activeGamesRoute,
    listGamesRoute
  }
};

export const useCoinLeaguesFactory = () => {
  const {web3State, chainId} = useWeb3();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_LEAGUES_CHAIN_ID(chainId),
  );

  const {room} = useParams<{room: string}>();
  const factoryAddress = useMemo(() => {
    return room
      ? room
      : COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId, room]);


  const onGameCreateCallback = useCallback(
    async (params: GameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !factoryAddress) {
        return;
      }
      try {
        const tx = await createGame(factoryAddress, params);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, chainId],
  );

  const gamesAddressQuery = useQuery(['GetGamesAddress', chainId], () => {
    if (!provider || !factoryAddress) {
      return;
    }

    return getGamesAddressFromFactory(factoryAddress, 10, provider);
  });

  const gamesQuery = useQuery(
    ['GetGamesDataAddress', gamesAddressQuery.data],
    () => {
      if (
        !gamesAddressQuery?.data ||
        !gamesAddressQuery?.data[0].length ||
        !provider
      ) {
        return;
      }
      const gAddress = gamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const createdGamesAddressQuery = useQuery(
    ['GetCreatedGamesAdddress', chainId],
    () => {
      if (!provider || !factoryAddress) {
        return;
      }

      return getCreatedGamesAddressFromFactory(factoryAddress, 10, provider);
    },
  );

  const createdGamesQuery = useQuery(
    ['GetCreatedGamesData', createdGamesAddressQuery.data],
    () => {
      if (
        !createdGamesAddressQuery?.data ||
        !createdGamesAddressQuery?.data[0].length ||
        !provider
      ) {
        return;
      }
      const gAddress = createdGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const startedGamesAddressQuery = useQuery(
    ['GetStartedGamesAdddress', chainId],
    () => {
      if (!provider || !factoryAddress) {
        return;
      }

      return getStartedGamesAddressFromFactory(factoryAddress, 11, provider);
    },
  );

  const startedGamesQuery = useQuery(
    ['GetStartedGamesData', startedGamesAddressQuery.data],
    () => {
      if (
        !startedGamesAddressQuery?.data ||
        !startedGamesAddressQuery?.data[0].length ||
        !provider
      ) {
        return;
      }
      const gAddress = startedGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const endedGamesAddressQuery = useQuery(
    ['GetEndedGamesAdddress', chainId],
    () => {
      if (!provider || !factoryAddress) {
        return;
      }

      return getEndedGamesAddressFromFactory(factoryAddress, 7, provider);
    },
  );

  const endedGamesQuery = useQuery(
    ['GetEndedGamesData', endedGamesAddressQuery.data],
    () => {
      if (
        !endedGamesAddressQuery?.data ||
        !endedGamesAddressQuery?.data[0].length ||
        !provider
      ) {
        return;
      }
      const gAddress = endedGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  return {
    onGameCreateCallback,
    gamesAddress: gamesAddressQuery?.data ? gamesAddressQuery?.data[0] : [],
    games: gamesQuery?.data,
    totalGames: gamesAddressQuery?.data && gamesAddressQuery?.data[1],
    refetch: gamesAddressQuery.refetch,
    gamesAddressQuery,
    gamesQuery,
    // created queries
    createdGames: createdGamesQuery?.data,
    totalCreatedGames:
      createdGamesAddressQuery?.data && createdGamesAddressQuery?.data[1],
    createdGamesQuery,
    createdGamesAddressQuery,
    refetchCreated: createdGamesAddressQuery.refetch,
    // started queries
    startedGames: startedGamesQuery?.data,
    totalStartedGames:
      startedGamesAddressQuery?.data && startedGamesAddressQuery?.data[1],
    startedGamesQuery,
    startedGamesAddressQuery,
    refetchStarted: startedGamesAddressQuery.refetch,
    // started queries
    endedGames: endedGamesQuery?.data,
    totalEndedGames:
      endedGamesAddressQuery?.data && endedGamesAddressQuery?.data[1],
    endedGamesQuery,
    endedGamesAddressQuery,
    refetchEnded: endedGamesAddressQuery.refetch,
  };
};
