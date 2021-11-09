import React, {useEffect, useState} from 'react';
import {
  Breadcrumbs,
  Button,
  Grid,
  Hidden,
  Link,
  Typography,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeagues/hooks/useCoinLeaguesFactory';

import {SupportedNetworkType} from 'types/blockchain';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeagues/components/CreateGameModal';

import {makeStyles} from '@material-ui/core/styles';

import {Link as RouterLink, useHistory} from 'react-router-dom';
import {HOME_ROUTE, LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';

import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';

import useDiscord from 'hooks/useDiscord';

import MyGamesTable from 'modules/CoinLeagues/components/MyGamesTable';

import SwapButton from 'shared/components/SwapButton';

const MyGames = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const defaultAccount = useDefaultAccount();

  useDiscord();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {listGamesRoute} = useCoinLeaguesFactoryRoutes();

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
  }, [account, dispatch]);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12} sm={12} xl={12}>
        <Grid container>
          <Breadcrumbs>
            <Link color='inherit' component={RouterLink} to={HOME_ROUTE}>
              Dashboard
            </Link>
            <Link color='inherit' component={RouterLink} to={listGamesRoute}>
              Games
            </Link>
            <Typography>My Games</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>
      <Grid item xs={6} xl={6} sm={6}>
        <Typography variant='h5'>My Games</Typography>
      </Grid>
      <Grid item xs={6} sm={6} xl={6}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <SwapButton />
          <Box pr={2}>
            <BuyCryptoButton btnMsg={'Buy Matic'} defaultCurrency={'MATIC'} />
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
            Connect Wallet{' '}
          </Button>
        )}
      </Grid>
      <Hidden xsDown={true}>
        <Grid item xs={12} sm={8}>
          <img src={CoinsLeagueBanner} style={{borderRadius: '12px'}} />
        </Grid>
      </Hidden>

      <Grid item xs={12}>
        <MyGamesTable />
      </Grid>
    </Grid>
  );
};

export default MyGames;
