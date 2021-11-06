import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeagues/components/CreateGameModal';
import CardGameSkeleton from 'modules/CoinLeagues/components/CardGame/index.skeleton';

import {SupportedNetworkType} from 'types/blockchain';
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

const JoinGames = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const defaultAccount = useDefaultAccount();

  const {messages} = useIntl();

  useDiscord();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [filterGame, setFilterGame] = useState(FilterGame.ALL);
  const [search, setSearch] = useState('');
  const [orderByGame, setOrderByGame] = useState(GameOrderBy.HighLevel);
  const waitingGamesQuery = useWaitingGames(filterGame, undefined, orderByGame);

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

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <TickerTapeTV />
      </Grid>
      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              <IntlMessages id='app.coinLeagues.dashboard' />
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              <IntlMessages id='app.coinLeagues.games' />
            </Link>
            <Typography>
              <IntlMessages id='app.coinLeagues.discoverGames' />
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img alt='' src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={6} sm={3} xl={3}>
        <Typography variant='h5'>
          <IntlMessages id='app.coinLeagues.discoverGames' />
        </Typography>
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
            <ShareButton
              shareText={messages['app.coinLeagues.coinsLeagueGames'] as string}
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

      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Grid item xs={12} sm={12}>
              <Typography variant='h6'>
                <IntlMessages id='app.coinLeagues.gamesToJoin' />
              </Typography>
            </Grid>
          </Grid>
          <Grid item sm={6} justifyContent='center'>
            <Grid container justifyContent='center' spacing={2}>
              {Object.entries(FilterGame).map((value, index) => (
                <Grid item key={index}>
                  <Chip
                    clickable
                    label={value[1]}
                    color={filterGame === value[1] ? 'primary' : 'default'}
                    onClick={() => setFilterGame(value[1])}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item sm={3} justifyContent='flex-end'>
            <GameOrderByDropdown
              onSelectGameOrder={(value) => setOrderByGame(value)}
            />
            {/* <Button variant='text'>
                <FilterListIcon style={{color: '#fff'}} />
                  </Button>*/}
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
                  messages['app.coinLeagues.askAdminCreateGamesJoin'] as string
                }
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JoinGames;
