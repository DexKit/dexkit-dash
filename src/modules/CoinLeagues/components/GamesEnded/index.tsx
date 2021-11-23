import React, {useCallback, useMemo} from 'react';

import {Grid} from '@material-ui/core';

import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import {Empty} from 'shared/components/Empty';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {useCoinLeagueGames} from 'modules/CoinLeagues/hooks/useGames';
import {useHistory} from 'react-router-dom';
import CardGameSkeleton from '../CardGameV2/index.skeleton';
import CardGameV2 from '../CardGameV2';
import {FilterGame} from 'modules/CoinLeagues/constants/enums';
import {useWeb3} from 'hooks/useWeb3';
import {GameFiltersState} from 'modules/CoinLeagues/hooks/useGamesFilter';

interface Props {
  filters: GameFiltersState;
  search?: string;
}

export const GamesEnded = (props: Props) => {
  const { search, filters} = props;
  const {account} = useWeb3();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();

  const gamesEndedQuery = useCoinLeagueGames({
    status: 'Ended',
    accounts: account ? [account] : undefined,
    filters,
  });

  const onClickEnterGame = useCallback(
    (id: string) => {
      history.push(enterGameRoute(`${id}`));
    },
    [enterGameRoute],
  );

  const endedGames = useMemo(() => {
    if (gamesEndedQuery.data) {
      return gamesEndedQuery.data.games.filter(
        (g) => g?.intId?.toLowerCase().indexOf(search?.toLowerCase() || '') !== -1,
      );
    }
  }, [search, gamesEndedQuery.data]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={4}>
        {endedGames?.map((g, id) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
            <CardGameV2
              game={g}
              id={g.id}
              onClick={onClickEnterGame}
              btnMessage={'VIEW GAME'}
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
              title={'No history'}
              message={'Join and play games'}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
