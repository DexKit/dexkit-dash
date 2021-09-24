import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Breadcrumbs,
  Button,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinsLeagueFactory} from 'modules/CoinsLeague/hooks/useCoinsLeagueFactory';

import {ChainId, SupportedNetworkType} from 'types/blockchain';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinsLeague/components/CreateGameModal';
import CardGame from 'modules/CoinsLeague/components/CardGame';
import WrongNetwork from 'modules/CoinsLeague/components/WrongNetwork';
import NoWallet from 'modules/CoinsLeague/components/NoWallet';
import CardGameSkeleton from 'modules/CoinsLeague/components/CardGame/index.skeleton';
import {makeStyles} from '@material-ui/core/styles';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Empty} from 'shared/components/Empty';
import SmallCardGame from 'modules/CoinsLeague/components/SmallCardGame';
import SmallCardGameSkeleton from 'modules/CoinsLeague/components/SmallCardGame/index.skeleton';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {COINSLEAGUE_ROUTE, HOME_ROUTE} from 'shared/constants/routes';
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

enum FilterGame {
  ALL = 'All',
  Fast = '1hr',
  Medium = '4hrs',
  Eight = '8hrs',
  Day = '24hrs',
  Week = 'Week',
  Mine = 'My Games',
}

enum Tabs {
  History = 'History',
  Games = 'Games',
}

const GamesList = () => {
  const classes = useStyles();
  const history = useHistory();
  const {chainId, account} = useWeb3();
  const defaultAccount = useDefaultAccount();

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
  const {games, totalGames, gamesQuery, gamesAddressQuery} =
    useCoinsLeagueFactory();
  const isLoading = gamesQuery.isLoading || gamesAddressQuery.isLoading;
  const gamesInProgress = useMemo(() => {
    return games?.filter((g) => g.started && !g.finished);
  }, [games]);

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

  const gamesToJoin = useMemo(() => {
    if (filterGame === FilterGame.ALL) {
      return games
        ?.filter((g) => !g.started)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Fast) {
      return games
        ?.filter((g) => !g.started)
        .filter((g) => g?.duration?.toNumber() === 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Mine) {
      return games
        ?.filter((g) => !g.started)
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
        ?.filter((g) => !g.started)
        .filter((g) => g?.duration?.toNumber() === 4 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Eight) {
      return games
        ?.filter((g) => !g.started)
        .filter((g) => g?.duration?.toNumber() === 8 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Day) {
      return games
        ?.filter((g) => !g.started)
        .filter((g) => g?.duration?.toNumber() === 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Week) {
      return games
        ?.filter((g) => !g.started)
        .filter((g) => g?.duration?.toNumber() > 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
  }, [games, filterGame, search]);

  const gamesEnded = useMemo(() => {
    if (filterGame === FilterGame.ALL) {
      return games
        ?.filter((g) => g.finished)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Fast) {
      return games
        ?.filter((g) => g.finished)
        .filter((g) => g?.duration?.toNumber() === 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Mine) {
      return games
        ?.filter((g) => g.finished)
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
        ?.filter((g) => g.finished)
        .filter((g) => g?.duration?.toNumber() === 4 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Eight) {
      return games
        ?.filter((g) => g.finished)
        .filter((g) => g?.duration?.toNumber() === 8 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }

    if (filterGame === FilterGame.Day) {
      return games
        ?.filter((g) => g.finished)
        .filter((g) => g?.duration?.toNumber() === 24 * 60 * 60)
        .filter(
          (g) =>
            g?.address?.toLowerCase().indexOf(search?.toLowerCase()) !== -1,
        );
    }
    if (filterGame === FilterGame.Week) {
      return games
        ?.filter((g) => g.finished)
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

  const onClickGoGamesInProgress = useCallback((_ev: any) => {
    history.push(`${COINSLEAGUE_ROUTE}/active-games`);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
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
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Hidden smUp={true}>
          <Grid item xs={12}>
            <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
          </Grid>
        </Hidden>
        <Grid item xs={6} xl={6} sm={6}>
          <Typography variant='h5'>Coin Leagues</Typography>
        </Grid>
        <Grid item xs={6} sm={6} xl={6}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <ShareButton shareText={`Coin Leagues Games`} />
            <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
            <MaticBridgeButton />
          </Box>
    </Grid>

        <CreateGameModal open={open} setOpen={setOpen} />
        <Grid item xs={12} sm={4}>
          <ActiveChainBalance />
        </Grid>
        <Hidden xsDown={true}>
          <Grid item xs={12} sm={8}>
            <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
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
            {gamesInProgress?.map((g, id) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={id}>
                <SmallCardGame {...g} key={id} onClick={onClickEnterGame} />
              </Grid>
            ))}
            {isLoading &&
              [1, 2, 3].map((v, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
                  <SmallCardGameSkeleton />
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
        <Grid item xs={6}>
          <CustomTabs
            value={value}
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
          <Button
            className={classes.createGame}
            fullWidth
            variant={'contained'}
            onClick={() => setOpen(true)}>
            {'CREATE GAME'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item sm={3}>
              <Grid item xs={12} sm={12}>
                {value === Tabs.Games ? (
                  <Typography variant='h6'>
                    {gamesToJoin?.length || 0} Games
                  </Typography>
                ) : (
                  <Typography variant='h6'>
                    {gamesEnded?.length || 0} Games
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                {value === Tabs.Games && (
                  <Typography gutterBottom>
                    Recently added &nbsp;
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
                  <CardGame
                    game={g}
                    id={g.address}
                    onClick={onClickEnterGame}
                  />
                </Grid>
              ))}
              {isLoading &&
                [1, 2, 3].map((v, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                    <CardGameSkeleton />
                  </Grid>
                ))}
              {!isLoading && !gamesToJoin?.length && (
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
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {gamesEnded?.map((g, id) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={id}>
                  <CardGame
                    game={g}
                    id={g.address}
                    onClick={onClickEnterGame}
                    btnMessage={'VIEW GAME'}
                  />
                </Grid>
              ))}
              {isLoading &&
                [1, 2, 3].map((v, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={i}>
                    <CardGameSkeleton />
                  </Grid>
                ))}
              {!isLoading && !gamesEnded?.length && (
                <Grid item xs={12}>
                  <Empty
                    image={<EmptyGame />}
                    title={'No history'}
                    message={'Join and play games'}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    ) : (
      <WrongNetwork />
    )
  ) : (
    <NoWallet />
  );
};

export default GamesList;
