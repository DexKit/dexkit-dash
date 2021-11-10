import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Badge,
  Breadcrumbs,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import {SupportedNetworkType} from 'types/blockchain';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeagues/components/CreateGameModal';
import CardGameSkeleton from 'modules/CoinLeagues/components/CardGame/index.skeleton';

import {Empty} from 'shared/components/Empty';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {HOME_ROUTE} from 'shared/constants/routes';
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
import {useWaitingGames} from 'modules/CoinLeagues/hooks/useGames';
import CardGameV2 from 'modules/CoinLeagues/components/CardGameV2';
import {FilterGame} from 'modules/CoinLeagues/constants/enums';
import TickerTapeTV from '../../components/TickerTapeTV';
import SwapButton from 'shared/components/SwapButton';
import {GameOrderByDropdown} from 'modules/CoinLeagues/components/GameOrderByDropdown';
import {GameOrderBy} from 'modules/CoinLeagues/constants/enums';
import {useGamesFilters} from 'modules/CoinLeagues/hooks/useGamesFilter';
import GameOrderBySelect from 'modules/CoinLeagues/components/GameOrderBySelect';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import {useToggler} from 'hooks/useToggler';
import {useIntl} from 'react-intl';

const JoinGames = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const defaultAccount = useDefaultAccount();
  useDiscord();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filterGame, setFilterGame] = useState(FilterGame.ALL);
  const [search, setSearch] = useState('');
  const [orderByGame, setOrderByGame] = useState(GameOrderBy.HighLevel);

  const {messages} = useIntl();
  const filtersState = useGamesFilters();

  const waitingGamesQuery = useWaitingGames({
    filter: filterGame,
    accounts: account ? [account] : undefined,
    orderBy: orderByGame,
    filters: filtersState,
  });

  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes();
  const gamesToJoin = useMemo(() => {
    if (waitingGamesQuery.data) {
      return waitingGamesQuery.data.games.filter(
        (g) => g?.id?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
      );
    }
  }, [search, waitingGamesQuery.data]);

  const isLoadingCreated = waitingGamesQuery.loading;

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
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <TickerTapeTV />
      </Grid>
      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              Dashboard
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              Games
            </Link>
            <Typography>Discover Games</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} alt={'Coinleague Banner'} />
        </Grid>
      </Hidden>
      <Grid item xs={6} sm={3} xl={3}>
        <Typography variant='h5'>Discover Games</Typography>
      </Grid>
      <Hidden xsDown={true}>
        <Grid item xs={12} sm={5} xl={5}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} alt={'Coinleague Banner'}/>
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={4} xl={4}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <Box pr={2}>
            <SwapButton />
          </Box>
          <Box pr={2}>
            <ShareButton shareText={`Coin leagues Games`} />
          </Box>
          <Box pr={2}>
            <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
          </Box>
          <Box pr={2}>
            <MaticBridgeButton />
          </Box>
        </Box>
      </Grid>

      <CreateGameModal open={open} setOpen={setOpen} />

      <Grid item xs={6}>
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
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'
          spacing={2}>
          <Grid item>
            <Typography variant='h6'>Games To Join</Typography>
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
            {/* <GameOrderByDropdown
              onSelectGameOrder={(value) => setOrderByGame(value)}
            />
             */}

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
                title={'No games to join'}
                message={'Ask Admin to create games to join'}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JoinGames;
