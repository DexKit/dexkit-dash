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
import CoinsLeagueBanner from 'assets/images/banners/coinsleague.svg';
import WrongNetwork from 'modules/CoinsLeague/components/WrongNetwork';
import NoWallet from 'modules/CoinsLeague/components/NoWallet';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
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
  const {chainId, account} = useWeb3();

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
        .filter((g) => g?.duration?.toNumber() === 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Mine) {
      return games
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
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 4 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Eight) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 8 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Day) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() === 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Week) {
      return games
        ?.filter((g) => g.started && !g.finished && !g.aborted)
        .filter((g) => g?.duration?.toNumber() > 24 * 60 * 60)
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
    chainId === ChainId.Mumbai || chainId === ChainId.Matic ? (
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

        <Grid item xs={12} sm={4}>
              <ActiveChainBalance />  
        </Grid>

        <Grid item xs={12}  sm={8}>
              <img src={CoinsLeagueBanner} style={{borderRadius:'12px'}} />
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
                  {gamesInProgress?.length || 0} Games in Progress
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
                    color={
                      filterGame === FilterGame.ALL ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.ALL)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label={FilterGame.Fast}
                    color={
                      filterGame === FilterGame.Fast ? 'primary' : 'default'
                    }
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
                    color={
                      filterGame === FilterGame.Day ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Day)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label={FilterGame.Week}
                    color={
                      filterGame === FilterGame.Week ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Week)}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    clickable
                    label={FilterGame.Mine}
                    color={
                      filterGame === FilterGame.Mine ? 'primary' : 'default'
                    }
                    onClick={() => setFilterGame(FilterGame.Mine)}
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
              <Grid item xs={12}>
                <Empty
                  image={<EmptyGame />}
                  title={'No games in progress'}
                  message={'Search created games and enter to start games'}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    ) : (
      <WrongNetwork />
    )
  ) : (
    <NoWallet />
  );
};

export default GamesInProgress;
