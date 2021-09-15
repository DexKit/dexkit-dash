import React, {useCallback, useMemo, useState} from 'react';
import {
  Breadcrumbs,
  Grid,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

import {ChainId} from 'types/blockchain';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Empty} from 'shared/components/Empty';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {COINSLEAGUE_ROUTE, HOME_ROUTE} from 'shared/constants/routes';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import CardGameProgress from 'modules/CoinsLeague/components/CardGameProgress';
import CardGameProgressSkeleton from 'modules/CoinsLeague/components/CardGameProgress/index.skeleton';

enum FilterGame {
  ALL = 'All',
  Fast = 'Fast',
  Medium = 'Medium',
  Day = '24hrs',
}

const GamesInProgress = () => {
  const history = useHistory();
  const {chainId} = useWeb3();

  const [filterGame, setFilterGame] = useState(FilterGame.ALL);
  const [search, setSearch] = useState('');

  const {games, gamesQuery, gamesAddressQuery} = useCoinsLeagueFactory();
  const isLoading = gamesQuery.isLoading || gamesAddressQuery.isLoading;
  const gamesInProgress = useMemo(() => {
    if (filterGame === FilterGame.ALL) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Fast) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() <= 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Medium) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter(
          (g) =>
            g?.duration?.toNumber() > 60 * 60 &&
            g?.duration?.toNumber() < 24 * 60 * 60,
        )
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Day) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() >= 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
  }, [games, filterGame, search]);

  const onClickEnterGame = useCallback((address: string) => {
    history.push(`${COINSLEAGUE_ROUTE}/${address}`);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleBack = useCallback((ev: any) => {
    history.push(COINSLEAGUE_ROUTE);
  }, []);
  return chainId ? (
    chainId === ChainId.Mumbai ? (
      <Grid container spacing={4} alignItems={'center'}>
        <Grid item xs={12} sm={12} xl={12}>
          <Grid container>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.75rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                Dashboard
              </Link>
              <Link
                color='inherit'
                component={RouterLink}
                to={COINSLEAGUE_ROUTE}>
                Games
              </Link>
              <Link
                color='inherit'
                component={RouterLink}
                to={COINSLEAGUE_ROUTE}>
                Games In Progress
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box display={'flex'} alignItems={'center'}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h6' style={{margin: 5}}>
              Games in Progress
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ActiveChainBalance />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <ContainedInput
            value={search}
            onChange={handleSearch}
            placeholder='Search'
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
                  {gamesInProgress?.length || 0} Games
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography gutterBottom>
                  Recently added &nbsp;
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
                    label='All'
                    color={
                      filterGame === FilterGame.ALL ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.ALL)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label='Fast'
                    color={
                      filterGame === FilterGame.Fast ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Fast)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label='Medium'
                    color={
                      filterGame === FilterGame.Medium ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Medium)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label='24hrs'
                    color={
                      filterGame === FilterGame.Day ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Day)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container sm={3} justifyContent='flex-end'></Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            {gamesInProgress?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                <CardGameProgress
                  game={g}
                  key={id}
                  onClick={onClickEnterGame}
                />
              </Grid>
            ))}
            {isLoading &&
              [1, 2, 3, 4, 6, 7, 8].map((v, i) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                  <CardGameProgressSkeleton />
                </Grid>
              ))}
          {!isLoading && !gamesInProgress?.length && (
              <Grid item xs={12} >
                <Empty
                  title={'No games in progress'}
                  message={'Search created games and enter to start games'}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    ) : (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Empty
            title={'Wrong Network'}
            message={'Please connect your wallet to Mumbai Polygon Testnet'}
          />
        </Grid>
      </Grid>
    )
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Empty title={'No Wallet'} message={'Please connect your wallet'} />
      </Grid>
    </Grid>
  );
};

export default GamesInProgress;
