import React, {useCallback, useMemo, useState} from 'react';
import {
  Breadcrumbs,
  Grid,
  InputAdornment,
  Link,
  Hidden,
  Typography,
  Badge,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {HOME_ROUTE} from 'shared/constants/routes';

import {Empty} from 'shared/components/Empty';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import SwapButton from 'shared/components/SwapButton';

import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import CardGameProgressV2 from 'modules/CoinLeagues/components/CardGameProgressV2';
import CardGameProgressSkeleton from 'modules/CoinLeagues/components/CardGameProgress/index.skeleton';
import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import {useCoinLeagueGames} from 'modules/CoinLeagues/hooks/useGames';
import {GameOrderBy} from 'modules/CoinLeagues/constants/enums';
import {useGamesFilters} from 'modules/CoinLeagues/hooks/useGamesFilter';
import {useToggler} from 'hooks/useToggler';
import {useIntl} from 'react-intl';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import GameOrderBySelect from 'modules/CoinLeagues/components/GameOrderBySelect';
import GameFilterDrawer from 'modules/CoinLeagues/components/GameFilterDrawer';

const GamesInProgress = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const {messages} = useIntl();

  const [search, setSearch] = useState('');

  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes();

  const filtersState = useGamesFilters();

  const activeGamesQuery = useCoinLeagueGames({
    status: 'Started',
    accounts: account ? [account] : undefined,
    filters: filtersState,
  });

  const isLoading = activeGamesQuery.loading;
  const gamesInProgress = useMemo(() => {
    if (activeGamesQuery.data) {
      return activeGamesQuery.data.games.filter(
        (g) => g?.id?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
      );
    }
  }, [activeGamesQuery.data, search]);

  const onClickEnterGame = useCallback(
    (address: string) => {
      history.push(enterGameRoute(`${address}`));
    },
    [enterGameRoute, history],
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
    //history.push(listGamesRoute);
  }, [listGamesRoute, history]);

  const filterToggler = useToggler(false);

  const handleChangeOrderBy = useCallback(
    (value: GameOrderBy) => {
      filtersState.setOrderByGame(value);
    },
    [filtersState],
  );

  const handleSelectAll = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(false);
  }, [filtersState]);

  const handleToggleBitBoy = useCallback(() => {
    filtersState.setIsMyGames(false);
    filtersState.setIsBitboy(!filtersState.isBitboy);
  }, [filtersState]);

  const handleToggleMyGames = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(!filtersState.isMyGames);
  }, [filtersState]);

  const handleToggleFilters = useCallback(() => {
    filterToggler.set(true);
  }, [filterToggler]);

  return (
    <>
      <GameFilterDrawer
        show={filterToggler.show}
        onClose={filterToggler.toggle}
        filtersState={filtersState}
      />
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12}>
          <Grid container>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                Dashboard
              </Link>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                Games
              </Link>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                Games In Progress
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Hidden smUp={true}>
          <Grid item xs={12}>
            <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
          </Grid>
        </Hidden>

        <Grid item xs={6}>
          <Box display={'flex'} alignItems={'center'}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h6' style={{margin: 5}}>
              Games in Progress
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} xl={6}>
          <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
            <Box pr={2}>
              <SwapButton />
            </Box>
            <Box pr={2}>
              <ShareButton shareText={`Coin league Games`} />
            </Box>
            <Box pr={2}>
              <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
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
            <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
          </Grid>
        </Hidden>

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
          <Grid
            container
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'>
            <Grid item>
              <Typography variant='h6'>
                {gamesInProgress?.length || 0} Games in Progress
              </Typography>
            </Grid>
            <Grid item>
              <Grid container justifyContent='center' spacing={2}>
                <Grid item>
                  <Chip
                    onClick={handleSelectAll}
                    color={
                      !filtersState.isBitboy && !filtersState.isMyGames
                        ? 'primary'
                        : 'default'
                    }
                    size='small'
                    label={messages['app.coinLeagues.all'] as string}
                    clickable
                  />
                </Grid>
                <Grid item>
                  <Chip
                    size='small'
                    label={messages['app.coinLeagues.myGames'] as string}
                    clickable
                    onClick={handleToggleMyGames}
                    color={filtersState.isMyGames ? 'primary' : 'default'}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    size='small'
                    label={messages['app.coinLeagues.bitboy'] as string}
                    clickable
                    onClick={handleToggleBitBoy}
                    color={filtersState.isBitboy ? 'primary' : 'default'}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                alignItems='center'
                alignContent='center'
                container
                spacing={2}>
                <Grid item>
                  <GameOrderBySelect
                    value={filtersState.orderByGame}
                    onChange={handleChangeOrderBy}
                  />
                </Grid>
                <Grid item>
                  <SquaredIconButton onClick={handleToggleFilters}>
                    <Badge
                      color='primary'
                      variant='dot'
                      invisible={!filtersState.isModified()}>
                      <FilterSearchIcon style={{color: '#fff'}} />
                    </Badge>
                  </SquaredIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            {gamesInProgress?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                <CardGameProgressV2
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
    </>
  );
};

export default GamesInProgress;
