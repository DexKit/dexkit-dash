import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Badge,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';

import GameFilterDrawer from 'modules/CoinLeague/components/GameFilterDrawer';

import {ReactComponent as FilterSearchIcon} from 'assets/images/icons/filter-search.svg';

import {SupportedNetworkType} from 'types/blockchain';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeague/components/CreateGameModal';
import CardGameSkeleton from 'modules/CoinLeague/components/CardGame/index.skeleton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {Empty} from 'shared/components/Empty';
import {useHistory} from 'react-router-dom';
import {Search} from '@material-ui/icons';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';
import {ReactComponent as EmptyGame} from 'assets/images/icons/empty-game.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import {ShareButton} from 'shared/components/ShareButton';

import {useCoinLeagueGames} from 'modules/CoinLeague/hooks/useGames';
import CardGameV2 from 'modules/CoinLeague/components/CardGame';
import TickerTapeTV from '../../components/TickerTapeTV';
import {GameOrderBy, RoomType} from 'modules/CoinLeague/constants/enums';
import {useGamesFilters} from 'modules/CoinLeague/hooks/useGamesFilter';
import GameOrderBySelect from 'modules/CoinLeague/components/GameOrderBySelect';
import SquaredIconButton from 'shared/components/SquaredIconButton';
import {useToggler} from 'hooks/useToggler';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {ChainSelect} from 'modules/CoinLeague/components/ChainSelect';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
}));

const JoinGames = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const {coinSymbol} = useLeaguesChainInfo();
  const defaultAccount = useDefaultAccount();

  const {messages} = useIntl();

  const classes = useStyles();

  const [room, setRoom] = useState(RoomType.Stable);
  const isNFT = room === RoomType.Stable ? false : true;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtersState = useGamesFilters();

  const waitingGamesQuery = useCoinLeagueGames(
    {
      status: 'Waiting',
      accounts: account ? [account] : undefined,
      filters: filtersState,
    },
    isNFT,
  );

  const {listGamesRoute, enterGameRoute} = useCoinLeaguesFactoryRoutes(isNFT);
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

  const handleToggleMyGames = useCallback(() => {
    filtersState.setIsBitboy(false);
    filtersState.setIsMyGames(!filtersState.isMyGames);
  }, [filtersState]);

  const handleToggleFilters = useCallback(() => {
    filterToggler.set(true);
  }, [filterToggler]);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(listGamesRoute);
    }
    //history.push(listGamesRoute);
  }, [listGamesRoute, history]);

  return (
    <>
      <GameFilterDrawer
        show={filterToggler.show}
        onClose={filterToggler.toggle}
        filtersState={filtersState}
      />
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={12} sm={12} xl={12}>
          <TickerTapeTV />
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent='space-between'>
            <Grid item>
              <Grid
                container
                spacing={4}
                alignItems='center'
                alignContent='center'>
                <Grid item>
                  <IconButton size='small' onClick={handleBack}>
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant='h5'>
                    <IntlMessages
                      id='app.coinLeagues.discoverGames'
                      defaultMessage={'Discover Games'}
                    />
                  </Typography>
                </Grid>
                <Grid>
                  <FormControl>
                    <Select
                      variant='outlined'
                      value={room}
                      onChange={(e) => setRoom(e.target.value as RoomType)}
                      renderValue={(value) => <> {value}</>}>
                      <MenuItem value={RoomType.Stable}>{'Main'} </MenuItem>
                      {/*<MenuItem value={RoomType.NFT}>{RoomType.NFT}</MenuItem>*/}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <ChainSelect />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
                <Box pr={2}>
                  <ShareButton shareText={`Coin leagues Games`} />
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
          </Grid>
        </Grid>

        <CreateGameModal open={open} setOpen={setOpen} />

        <Grid item xs={12} sm={6}>
          <TextField
            value={search}
            variant='outlined'
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
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'
            spacing={2}>
            <Grid item>
              <Typography variant='h6'>
                <IntlMessages id='app.coinLeagues.gamesToJoin' />
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
                    variant='outlined'
                  />
                </Grid>
                <Grid item>
                  <Chip
                    size='small'
                    label={messages['app.coinLeagues.myGames'] as string}
                    clickable
                    onClick={handleToggleMyGames}
                    color={filtersState.isMyGames ? 'primary' : 'default'}
                    variant='outlined'
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
                      <FilterSearchIcon className={classes.icon} />
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
                  title={messages['app.coinLeagues.noGamesJoin'] as string}
                  message={
                    messages[
                      'app.coinLeagues.askAdminCreateGamesJoin'
                    ] as string
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

export default JoinGames;
