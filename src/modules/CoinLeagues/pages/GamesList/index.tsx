import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import {useIntl} from 'react-intl';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import {SupportedNetworkType} from 'types/blockchain';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeagues/components/CreateGameModal';
import CardGameSkeleton from 'modules/CoinLeagues/components/CardGame/index.skeleton';
import {makeStyles} from '@material-ui/core/styles';

import {Empty} from 'shared/components/Empty';
import SwapButton from 'shared/components/SwapButton';
import SmallCardGame from 'modules/CoinLeagues/components/SmallCardGame';
import SmallCardGameSkeleton from 'modules/CoinLeagues/components/SmallCardGame/index.skeleton';
import {Link as RouterLink, useHistory, useLocation} from 'react-router-dom';
import {
  COINLEAGUENFT_ROUTE,
  HOME_ROUTE,
  LOGIN_WALLET_ROUTE,
} from 'shared/constants/routes';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import useDiscord from 'hooks/useDiscord';
import {useCoinLeagueGames} from 'modules/CoinLeagues/hooks/useGames';
import CardGame from 'modules/CoinLeagues/components/CardGame';
import {GamesEnded} from 'modules/CoinLeagues/components/GamesEnded';
import {GameLevel, GameOrderBy} from 'modules/CoinLeagues/constants/enums';
import TickerTapeTV from '../../components/TickerTapeTV';
import GameFilterDrawer from 'modules/CoinLeagues/components/GameFilterDrawer';
import {useGamesFilters} from 'modules/CoinLeagues/hooks/useGamesFilter';
import {useToggler} from 'hooks/useToggler';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import GameOrderBySelect from 'modules/CoinLeagues/components/GameOrderBySelect';

import {GET_CHAIN_NATIVE_COIN} from 'shared/constants/Blockchain';
import {GET_LEAGUES_CHAIN_ID} from 'modules/CoinLeagues/utils/constants';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    padding: theme.spacing(2),
    backgroundColor: '#1F1D2B',
  },
  chip: {
    color: '#fff',
    background: '#1F1D2B',
    border: '2px solid #2e3243',
  },
  createGame: {
    padding: theme.spacing(3),
  },
  tabs: {
    maxWidth: '450px',
  },
}));

enum Tabs {
  History = 'History',
  Games = 'Games',
}

const GamesList = () => {
  const classes = useStyles();
  const history = useHistory();
  const {pathname} = useLocation();
  const {account, chainId} = useWeb3();
  const defaultAccount = useDefaultAccount();

  useDiscord();

  const isNFTGame = useMemo(() => {
    if (pathname.startsWith(COINLEAGUENFT_ROUTE)) {
      return true;
    } else {
      return false;
    }
  }, [pathname]);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [value, setValue] = React.useState(Tabs.Games);

  const {messages} = useIntl();

  const handleChange = useCallback(
    (_event: React.ChangeEvent<{}>, _newValue: string) => {
      if (value === Tabs.Games) {
        setValue(Tabs.History);
      } else {
        setValue(Tabs.Games);
      }
    },
    [value],
  );
  const filtersState = useGamesFilters();

  const activeGamesQuery = useCoinLeagueGames({
    status: 'Started',
    //@ts-ignore
    filters: {
      gameLevel: GameLevel.All,
    },
    first: 5,
  });

  const waitingGamesQuery = useCoinLeagueGames({
    status: 'Waiting',
    accounts: account ? [account] : undefined,
    filters: filtersState,
  });

  const {listGamesRoute, activeGamesRoute, enterGameRoute} =
    useCoinLeaguesFactoryRoutes();
  const gamesToJoin = useMemo(() => {
    if (waitingGamesQuery.data) {
      return waitingGamesQuery.data.games.filter(
        (g) => g?.intId?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
      );
    }
  }, [search, waitingGamesQuery.data]);

  const isLoadingStarted = activeGamesQuery.loading;
  const isLoadingCreated = waitingGamesQuery.loading;

  const gamesInProgress = useMemo(() => {
    return activeGamesQuery.data?.games;
  }, [activeGamesQuery.data]);

  // TODO: We are doing this to user see connected account
  useEffect(() => {
    if (account && account !== defaultAccount) {
      dispatch(
        setDefaultAccount({
          account: {
            address: account,
            label: account,
            networkType: SupportedNetworkType.evm,
          },
          type: SupportedNetworkType.evm,
        }),
      );
    }
  }, [account, defaultAccount, dispatch]);

  const onClickEnterGame = useCallback(
    (address: string) => {
      history.push(enterGameRoute(`${address}`));
    },
    [enterGameRoute, history],
  );

  const onClickGoGamesInProgress = useCallback(
    (_ev: any) => {
      history.push(activeGamesRoute);
    },
    [activeGamesRoute, history],
  );

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

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

      <CreateGameModal open={open} setOpen={setOpen} />
      <Grid container spacing={6} alignItems={'center'}>
        <Grid item xs={12}>
          <TickerTapeTV />
        </Grid>

        <Grid item xs={12}>     
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
                Dashboard
              </Link>
              <Link color='inherit' component={RouterLink} to={listGamesRoute}>
                Games
              </Link>
            </Breadcrumbs>
        </Grid>

        <Hidden smUp={true}>
          <Grid item xs={12}>
            <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} alt={'banner'} />
          </Grid>
        </Hidden>
        <Grid item xs={6} xl={6} sm={6}>
          <Typography variant='h5'>
            Coin League {isNFTGame && '- NFT Room'}
          </Typography>
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
              <BuyCryptoButton
                btnMsg={`Buy ${GET_CHAIN_NATIVE_COIN(
                  GET_LEAGUES_CHAIN_ID(chainId),
                )}`}
                defaultCurrency={GET_CHAIN_NATIVE_COIN(
                  GET_LEAGUES_CHAIN_ID(chainId),
                )}
              />
            </Box>
            <Box pr={2}>
              <MaticBridgeButton />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          {account ? (
            <ActiveChainBalance />
          ) : (
            <Button
              variant={'contained'}
              onClick={() => history.push(LOGIN_WALLET_ROUTE)}>
              Connect Wallet{' '}
            </Button>
          )}
        </Grid>
        <Hidden xsDown={true}>
          <Grid item xs={12} sm={8}>
            <img
              src={CoinsLeagueBanner}
              style={{borderRadius: '12px'}}
              alt={'Coinleague Banner'}
            />
          </Grid>
        </Hidden>

        <Grid item xs={6}>
          <Typography variant='h6' style={{margin: 5}}>
            Games in Progress: {gamesInProgress?.length || 0}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button variant={'text'} onClick={onClickGoGamesInProgress}>
              View More 
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            {gamesInProgress?.slice(0, 4).map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={id}>
                <SmallCardGame game={g} key={id} onClick={onClickEnterGame} />
              </Grid>
            ))}
            {isLoadingStarted &&
              [1, 2, 3].map((v, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
                  <SmallCardGameSkeleton />
                </Grid>
              ))}
            {!isLoadingStarted && !gamesInProgress?.length && (
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
        <Grid item xs={12}>
          <Grid container alignItems={'center'} spacing={2}>
            <Grid item xs={12} sm={6}>
              <CustomTabs
                value={value}
                className={classes.tabs}
                onChange={handleChange}
                variant='standard'
                TabIndicatorProps={{
                  style: {display: 'none'},
                }}
                aria-label='wallet tabs'>
                <CustomTab value={Tabs.Games} label={Tabs.Games} />
                <CustomTab value={Tabs.History} label={Tabs.History} />
              </CustomTabs>
            </Grid>

            <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            className={classes.createGame}
            fullWidth
            variant={'contained'}
            onClick={() => setOpen(true)}>
            {'CREATE GAME'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            alignContent='center'
            alignItems='center'
            justifyContent='space-between'
            spacing={2}>
            <Grid item>
              {value === Tabs.Games ? (
                <Typography variant='h6'>Games</Typography>
              ) : (
                <Typography variant='h6'>Last Games</Typography>
              )}
            </Grid>
            {/*   <Grid item xs={12} sm={12}>
              {value === Tabs.Games && (
                <Typography gutterBottom>
                  Recently added &nbsp;
                 <ExpandMoreIcon
                    fontSize='small'
                    style={{verticalAlign: 'top'}}
                 />
                </Typography>
              )}
            </Grid>*/}
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
              {/* <GameOrderByDropdown
                onSelectGameOrder={(value) => setOrderByGame(value)}
              /> */}

              <Grid
                alignItems='center'
                alignContent='center'
                justifyContent='center'
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

        {value === Tabs.Games && (
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {gamesToJoin?.map((g, id) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                  <CardGame game={g} id={g.id} onClick={onClickEnterGame} />
                </Grid>
              ))}
              {isLoadingCreated &&
                [1, 2, 3].map((v, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                    <CardGameSkeleton />
                  </Grid>
                ))}
              {!isLoadingCreated && !gamesToJoin?.length && (
                <Grid item xs={12}>
                  <Empty
                    image={<EmptyGame />}
                    title={'No games to join'}
                    message={'Create games to join'}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
        {value === Tabs.History && (
          <GamesEnded search={search} filters={filtersState} />
        )}
      </Grid>
    </>
  );
};

export default GamesList;
