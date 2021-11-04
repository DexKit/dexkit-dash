import React, {useCallback, useMemo} from 'react';

import {useIntl} from 'react-intl';

import {Grid} from '@material-ui/core';

import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import {Empty} from 'shared/components/Empty';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';
import {useEndedGames} from 'modules/CoinLeagues/hooks/useGames';
import {useHistory} from 'react-router-dom';
import CardGameSkeleton from '../CardGameV2/index.skeleton';
import CardGameV2 from '../CardGameV2';
import {FilterGame} from 'modules/CoinLeagues/constants/enums';
import {useWeb3} from 'hooks/useWeb3';

interface Props {
  filter?: FilterGame;
  search?: string;
}

export const GamesEnded = (props: Props) => {
  const {filter, search} = props;
  const {account} = useWeb3();
  const {messages} = useIntl();
  const {enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const history = useHistory();
  const gamesEndedQuery = useEndedGames(
    filter,
    account ? [account] : undefined,
  );

  const onClickEnterGame = useCallback(
    (address: string) => {
      history.push(enterGameRoute(`${address}`));
    },
    [enterGameRoute],
  );

  const endedGames = useMemo(() => {
    if (gamesEndedQuery.data) {
      return gamesEndedQuery.data.games.filter(
        (g) => g?.id?.toLowerCase().indexOf(search?.toLowerCase() || '') !== -1,
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
