import React, {useCallback, useMemo} from 'react';

import {useIntl} from 'react-intl';

import {Grid} from '@material-ui/core';

import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import {Empty} from 'shared/components/Empty';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import {useCoinLeagueGames} from 'modules/CoinLeague/hooks/useGames';
import {useHistory} from 'react-router-dom';
import CardGameSkeleton from '../CardGame/index.skeleton';
import CardGameV2 from '../CardGame';
import {useWeb3} from 'hooks/useWeb3';
import {GameFiltersState} from 'modules/CoinLeague/hooks/useGamesFilter';
import {useGamesMetadata} from 'modules/CoinLeague/hooks/useGameMetadata';

interface Props {
  filters: GameFiltersState;
  search?: string;
}

export const GamesEnded = (props: Props) => {
  const {search, filters} = props;
  const {account} = useWeb3();
  const {messages} = useIntl();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();

  const gamesEndedQuery = useCoinLeagueGames({
    status: 'Ended',
    accounts: account ? [account] : undefined,
    filters,
  });
  const endedGamesData = gamesEndedQuery?.data?.games;

  const endedGamesIds = useMemo(() => {
    if (endedGamesData) {
      if (endedGamesData.length) {
        return endedGamesData
          ?.map((g) => g.intId)
          .reduce((p, c) => `${p},${c}`);
      }
    }
  }, [endedGamesData]);

  const gamesMetadata = useGamesMetadata(endedGamesIds);

  const onClickEnterGame = useCallback(
    (id: string) => {
      history.push(enterGameRoute(`${id}`));
    },
    [enterGameRoute, history],
  );

  const endedGames = useMemo(() => {
    if (gamesEndedQuery.data) {
      if (gamesMetadata.data) {
        const metadata = gamesMetadata.data;
        // We merge the metadata with the game
        return gamesEndedQuery.data.games
          .map((g) => {
            const withMetadata = metadata.find(
              (m) => Number(m.gameId) === Number(g.intId),
            );
            if (withMetadata) {
              return {
                ...withMetadata,
                ...g,
              };
            } else {
              return g;
            }
          })
          .filter((g) => {
            if (filters.isJackpot) {
              return !!g.title;
            }
            return true;
          })
          .filter(
            (g) =>
              g?.intId?.toLowerCase().indexOf(search?.toLowerCase() || '') !==
              -1,
          );
      } else {
        return gamesEndedQuery.data.games.filter(
          (g) =>
            g?.intId?.toLowerCase().indexOf(search?.toLowerCase() || '') !== -1,
        );
      }
    }
  }, [search, gamesEndedQuery.data, gamesMetadata.data, filters.isJackpot]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={4}>
        {endedGames?.map((g, id) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
            <CardGameV2
              game={g}
              id={g.id}
              onClick={onClickEnterGame}
              btnMessage={messages['app.coinLeagues.viewGame'] as string}
            />
          </Grid>
        ))}
        {gamesEndedQuery.loading &&
          [1, 2, 3].map((v, i) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
              <CardGameSkeleton />
            </Grid>
          ))}
        {!gamesEndedQuery.loading && !endedGames?.length && (
          <Grid item xs={12}>
            <Empty
              image={<EmptyGame />}
              title={messages['app.coinLeagues.noHistory'] as string}
              message={messages['app.coinLeagues.joinAndPlayGames'] as string}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
