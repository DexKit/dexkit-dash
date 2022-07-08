import React, {useCallback, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {
  Breadcrumbs,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
  Badge,
  TextField,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {HOME_ROUTE} from 'shared/constants/routes';

import {Empty} from 'shared/components/Empty';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import {Search} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import {useCoinLeagueGames} from 'modules/CoinLeague/hooks/useGames';
import {GameOrderBy} from 'modules/CoinLeague/constants/enums';
import {useGamesFilters} from 'modules/CoinLeague/hooks/useGamesFilter';
import {useToggler} from 'hooks/useToggler';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import GameOrderBySelect from 'modules/CoinLeague/components/GameOrderBySelect';
import GameFilterDrawer from 'modules/CoinLeague/components/GameFilterDrawer';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {ChainSelect} from 'modules/CoinLeague/components/ChainSelect';
import CardGame from 'modules/CoinLeague/components/CardGame';
import CoinLeagueShareDialog from 'modules/CoinLeague/components/CoinLeagueShareDialog';
import {useMobile} from 'hooks/useMobile';

const GamesInProgress = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const {coinSymbol} = useLeaguesChainInfo();
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

  const handleToggleMyGames = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(!filtersState.isMyGames);
  }, [filtersState]);

  const handleToggleFilters = useCallback(() => {
    filterToggler.set(true);
  }, [filterToggler]);

  const shareDialogToggler = useToggler();

  const [shareSelectedId, setShareSelectedId] = useState<string>();

  const handleShareGame = useCallback(
    (id) => {
      setShareSelectedId(id);
      shareDialogToggler.set(true);
    },
    [shareDialogToggler],
  );

  const handleCloseShareDialog = useCallback(() => {
    setShareSelectedId(undefined);
    shareDialogToggler.set(false);
  }, [shareDialogToggler]);

  const isMobile = useMobile();

  return (
    <>
      <CoinLeagueShareDialog
        dialogProps={{
          open: shareDialogToggler.show,
          onClose: handleCloseShareDialog,
          fullWidth: true,
          maxWidth: 'sm',
          fullScreen: isMobile,
        }}
        id={shareSelectedId}
      />
      <GameFilterDrawer
        show={filterToggler.show}
        onClose={filterToggler.toggle}
        filtersState={filtersState}
      />
      <Grid container spacing={6} alignItems='center'>
        <Grid item xs={12}>
          <Grid container>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                <IntlMessages id='app.coinLeagues.dashboard' />
              </Link>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                <IntlMessages id='app.coinLeagues.games' />
              </Link>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                <IntlMessages id='app.coinLeagues.gamesInProgress' />
              </Link>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Hidden smUp={true}>
          <Grid item xs={12}>
            <img
              src={CoinsLeagueBanner}
              style={{borderRadius: '12px'}}
              alt={'Coinleagues Banner'}
            />
          </Grid>
        </Hidden>

        <Grid item xs={6}>
          <Box display={'flex'} alignItems={'center'}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant='h5' style={{margin: 5}}>
              <IntlMessages id='app.coinLeagues.gamesInProgress' />
            </Typography>
            <Box p={2}>
              <ChainSelect />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} xl={6}>
          <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
            <Box pr={2}>
              <ShareButton
                shareText={
                  messages['app.coinLeagues.gamesInProgress'] as string
                }
              />
            </Box>
            <Box pr={2}>
              <BuyCryptoButton
                btnMsg={`Buy ${coinSymbol}`}
                defaultCurrency={coinSymbol}
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
            <img
              src={CoinsLeagueBanner}
              style={{borderRadius: '12px'}}
              alt={'Coinleagues Banner'}
            />
          </Grid>
        </Hidden>

        <Grid item xs={12}>
          <TextField
            variant='outlined'
            value={search}
            onChange={handleSearch}
            placeholder={messages['app.coinLeagues.search'] as string}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
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
                {gamesInProgress?.length || 0}{' '}
                <IntlMessages id='app.coinLeagues.gamesInProgress' />
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
                    label={messages['app.coinLeagues.all'] as string}
                    clickable
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={messages['app.coinLeagues.myGames'] as string}
                    clickable
                    onClick={handleToggleMyGames}
                    color={filtersState.isMyGames ? 'primary' : 'default'}
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
                      <FilterSearchIcon />
                    </Badge>
                  </SquaredIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            {gamesInProgress?.map((game, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <CardGame
                  onShare={handleShareGame}
                  game={game}
                  onClick={onClickEnterGame}
                />
              </Grid>
            ))}
            {isLoading &&
              new Array(8).fill(null).map((v, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <CardGame loading />
                </Grid>
              ))}
            {!isLoading && !gamesInProgress?.length && (
              <Grid item xs={12}>
                <Empty
                  image={<EmptyGame />}
                  title={
                    messages['app.coinLeagues.noGamesInProgress'] as string
                  }
                  message={
                    messages['app.coinLeagues.searchCreatedAndEnter'] as string
                  }
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
