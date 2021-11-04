import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
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
import SmallCardGameV2 from 'modules/CoinLeagues/components/SmallCardGameV2';
import SmallCardGameSkeleton from 'modules/CoinLeagues/components/SmallCardGame/index.skeleton';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {HOME_ROUTE, LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';
import {CustomTab, CustomTabs} from 'shared/components/Tabs/CustomTabs';
import ContainedInput from 'shared/components/ContainedInput';
import {Search} from '@material-ui/icons';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import CoinsLeagueBanner from 'assets/images/banners/coinsleague.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';
import useDiscord from 'hooks/useDiscord';
import {
  useActiveGames,
  useWaitingGames,
} from 'modules/CoinLeagues/hooks/useGames';
import CardGameV2 from 'modules/CoinLeagues/components/CardGameV2';
import {GamesEnded} from 'modules/CoinLeagues/components/GamesEnded';
import {FilterGame} from 'modules/CoinLeagues/constants/enums';
import TickerTapeTV from '../../components/TickerTapeTV';
import {isGameCreator} from 'modules/CoinLeagues/utils/game';

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
}));

enum Tabs {
  History = 'History',
  Games = 'Games',
}

const GamesListV2 = () => {
  const classes = useStyles();
  const history = useHistory();
  const {account} = useWeb3();
  const defaultAccount = useDefaultAccount();

  const {messages} = useIntl();

  useDiscord();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filterGame, setFilterGame] = useState(FilterGame.ALL);
  const [search, setSearch] = useState('');
  const [value, setValue] = React.useState(Tabs.Games);

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
  const waitingGamesQuery = useWaitingGames(filterGame);
  const activeGamesQuery = useActiveGames();

  const {listGamesRoute, activeGamesRoute, enterGameRoute} =
    useCoinLeaguesFactoryRoutes();
  const gamesToJoin = useMemo(() => {
    if (waitingGamesQuery.data) {
      return waitingGamesQuery.data.games.filter(
        (g) => g?.id?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
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
  }, [account]);

  const onClickEnterGame = useCallback(
    (address: string) => {
      history.push(enterGameRoute(`${address}`));
    },
    [enterGameRoute],
  );

  const onClickGoGamesInProgress = useCallback(() => {
    history.push(activeGamesRoute);
  }, [activeGamesRoute]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <TickerTapeTV />
      </Grid>

      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              <IntlMessages key='app.coinLeagues.dashboard' />
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              <IntlMessages key='app.coinLeagues.games' />
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>

      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img alt='' src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={6} xl={6} sm={6}>
        <Typography variant='h5'>
          <IntlMessages key='app.coinLeagues.coinLeagues' />
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6} xl={6}>
        <Box display='flex' alignItems='end' justifyContent='end'>
          <Box pr={2}>
            <SwapButton />
          </Box>
          <Box pr={2}>
            <ShareButton
              shareText={messages['app.coinLeagues.coinsLeagueGame'] as string}
            />
          </Box>
          <Box pr={2}>
            <BuyCryptoButton
              btnMsg={messages['app.coinLeagues.buyMatic'] as string}
              defaultCurrency={'MATIC'}
            />
          </Box>
          <Box pr={2}>
            <MaticBridgeButton />
          </Box>
        </Box>
      </Grid>

      <CreateGameModal open={open} setOpen={setOpen} />
      <Grid item xs={12} sm={4}>
        {account ? (
          <ActiveChainBalance />
        ) : (
          <Button
            variant={'contained'}
            onClick={() => history.push(LOGIN_WALLET_ROUTE)}>
            <IntlMessages key='app.coinLeagues.connectWallet' />
          </Button>
        )}
      </Grid>
      <Hidden xsDown={true}>
        <Grid item xs={12} sm={8}>
          <img alt='' src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>

      <Grid item xs={6}>
        <Typography variant='h6' style={{margin: 5}}>
          <IntlMessages key='app.coinLeagues.gamesInProgress' />{' '}
          {gamesInProgress?.length || 0}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button variant={'text'} onClick={onClickGoGamesInProgress}>
            <IntlMessages key='app.coinLeagues.viewMore' />
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={4}>
          {gamesInProgress?.slice(0, 4).map((g, id) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={id}>
              <SmallCardGameV2 game={g} key={id} onClick={onClickEnterGame} />
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
                title={messages['app.coinLeagues.noGamesInProgress'] as string}
                message={
                  messages['app.coinLeagues.searchCreatedAndEnter'] as string
                }
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <CustomTabs
          value={value}
          onChange={handleChange}
          variant='standard'
          TabIndicatorProps={{style: {display: 'none'}}}
          aria-label='wallet tabs'>
          <CustomTab value={Tabs.Games} label={Tabs.Games} />
          <CustomTab value={Tabs.History} label={Tabs.History} />
        </CustomTabs>
      </Grid>
      <Grid item xs={6}>
        <ContainedInput
          value={search}
          onChange={handleSearch}
          placeholder={messages['app.coinLeagues.search'] as string}
          startAdornment={
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          }
          fullWidth
        />
      </Grid>

      {isGameCreator(account) && (
        <Grid item xs={12}>
          <Button
            className={classes.createGame}
            fullWidth
            variant={'contained'}
            onClick={() => setOpen(true)}>
            <IntlMessages key='app.coinLeagues.createGame' />
          </Button>
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Grid item xs={12} sm={12}>
              {value === Tabs.Games ? (
                <Typography variant='h6'>
                  <IntlMessages key='app.coinLeagues.games' />
                </Typography>
              ) : (
                <Typography variant='h6'>
                  <IntlMessages key='app.coinLeagues.lastGames' />
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              {value === Tabs.Games && (
                <Typography gutterBottom>
                  <IntlMessages key='app.coinLeagues.recentlyAdded' /> &nbsp;
                  {/* <ExpandMoreIcon
                    fontSize='small'
                    style={{verticalAlign: 'top'}}
                 />*/}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item sm={6} justifyContent='center'>
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
              <Grid item>
                <Chip
                  clickable
                  label={FilterGame.BitBoy}
                  color={
                    filterGame === FilterGame.BitBoy ? 'primary' : 'default'
                  }
                  onClick={() => setFilterGame(FilterGame.BitBoy)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={3} justifyContent='flex-end'>
            {/* <Button variant='text'>
                <FilterListIcon style={{color: '#fff'}} />
                  </Button>*/}
          </Grid>
        </Grid>
      </Grid>

      {value === Tabs.Games && (
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {gamesToJoin?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                <CardGameV2 game={g} id={g.id} onClick={onClickEnterGame} />
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
                  title={messages['app.coinLeagues.noGamesJoin'] as string}
                  message={
                    messages['app.coinLeagues.createGamesJoin'] as string
                  }
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
      {value === Tabs.History && (
        <GamesEnded filter={filterGame} search={search} />
      )}
    </Grid>
  );
};

export default GamesListV2;
