import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';

import {
  Breadcrumbs,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {
  useCoinLeaguesFactory,
  useCoinLeaguesFactoryRoutes,
} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {HOME_ROUTE} from 'shared/constants/routes';

import {Empty} from 'shared/components/Empty';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import CardGameProgress from 'modules/CoinLeagues/components/CardGameProgress';
import CardGameProgressSkeleton from 'modules/CoinLeagues/components/CardGameProgress/index.skeleton';
import CoinsLeagueBanner from 'assets/images/banners/coinsleague.svg';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';

enum FilterGame {
  ALL = 'All',
  Fast = '1hr',
  Medium = '4hrs',
  Eight = '8hrs',
  Day = '24hrs',
  Week = 'Week',
  Mine = 'My Games',
}

const GamesInProgress = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const {messages} = useIntl();

  const [filterGame, setFilterGame] = useState(FilterGame.ALL);
  const [search, setSearch] = useState('');

  const {startedGames, startedGamesAddressQuery, startedGamesQuery} =
    useCoinLeaguesFactory();
  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes();

  const isLoading =
    startedGamesAddressQuery.isLoading || startedGamesQuery.isLoading;
  const gamesInProgress = useMemo(() => {
    if (filterGame === FilterGame.ALL) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Fast) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Mine) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) =>
          g?.players
            //@ts-ignore
            .map((p) => p[1]?.toLowerCase())
            .includes(account?.toLowerCase() || ''),
        )
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Medium) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 4 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Eight) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 8 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Day) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Week) {
      return startedGames
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() > 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
  }, [startedGames, filterGame, search]);

  const onClickEnterGame = useCallback(
    (address: string) => {
      history.push(enterGameRoute(`${address}`));
    },
    [enterGameRoute],
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(listGamesRoute);
    }
    // history.push(listGamesRoute);
  }, [listGamesRoute]);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              {messages['app.dashboard']}
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              {messages['app.games']}
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              {messages['app.gamesInProgress']}
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} alt='' />
        </Grid>
      </Hidden>

      <Grid item xs={6}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' style={{margin: 5}}>
            {messages['app.gamesInProgress']}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} sm={6} xl={6}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <Box pr={2}>
            <ShareButton
              shareText={messages['app.gamesInProgress'] as string}
            />
          </Box>
          <Box pr={2}>
            <BuyCryptoButton
              btnMsg={messages['app.buyMatic'] as string}
              defaultCurrency={'MATIC'}
            />
          </Box>
          <Box pr={2}>
            <MaticBridgeButton />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={4}>
        <ActiveChainBalance />
      </Grid>
      <Hidden smDown={true}>
        <Grid item xs={12} sm={8}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} alt='' />
        </Grid>
      </Hidden>

      <Grid item xs={12}>
        <ContainedInput
          value={search}
          onChange={handleSearch}
          placeholder={messages['app.search'] as string}
          startAdornment={
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          }
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Grid item xs={12} sm={12}>
              <Typography variant='h6'>
                {gamesInProgress?.length || 0} {messages['app.gamesInProgress']}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography gutterBottom>
                {/* <ExpandMoreIcon
                    fontSize='small'
                    style={{verticalAlign: 'top'}}
                 />*/}
              </Typography>
            </Grid>
          </Grid>
          <Grid item sm={6} spacing={1} justifyContent='center'>
            <Grid container justifyContent='center' spacing={2}>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.ALL}
                  color={filterGame === FilterGame.ALL ? 'primary' : 'default'}
                  onClick={() => setFilterGame(FilterGame.ALL)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Fast}
                  color={filterGame === FilterGame.Fast ? 'primary' : 'default'}
                  onClick={() => setFilterGame(FilterGame.Fast)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Medium}
                  color={
                    filterGame === FilterGame.Medium ? 'primary' : 'default'
                  }
                  onClick={() => setFilterGame(FilterGame.Medium)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Eight}
                  color={
                    filterGame === FilterGame.Eight ? 'primary' : 'default'
                  }
                  onClick={() => setFilterGame(FilterGame.Eight)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Day}
                  color={filterGame === FilterGame.Day ? 'primary' : 'default'}
                  onClick={() => setFilterGame(FilterGame.Day)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Week}
                  color={filterGame === FilterGame.Week ? 'primary' : 'default'}
                  onClick={() => setFilterGame(FilterGame.Week)}
                />
              </Grid>
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.Mine}
                  color={filterGame === FilterGame.Mine ? 'primary' : 'default'}
                  onClick={() => setFilterGame(FilterGame.Mine)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container sm={3} justifyContent='flex-end' />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          {gamesInProgress?.map((g, id) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
              <CardGameProgress game={g} key={id} onClick={onClickEnterGame} />
            </Grid>
          ))}
          {isLoading &&
            [1, 2, 3, 4, 6, 7, 8].map((v, i) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                <CardGameProgressSkeleton />
              </Grid>
            ))}
          {!isLoading && !gamesInProgress?.length && (
            <Grid item xs={12}>
              <Empty
                image={<EmptyGame />}
                title={messages['app.noGamesInProgress'] as string}
                message={messages['app.searchCreatedAndEnter'] as string}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GamesInProgress;
