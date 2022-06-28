import React, {useEffect, useState, useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {Button, Grid, Hidden, IconButton, Typography} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useCoinLeaguesFactoryRoutes} from 'modules/CoinLeague/hooks/useCoinLeaguesFactory';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {SupportedNetworkType} from 'types/blockchain';
import Box from '@material-ui/core/Box';
import CreateGameModal from 'modules/CoinLeague/components/CreateGameModal';

import {useHistory} from 'react-router-dom';
import {LOGIN_WALLET_ROUTE} from 'shared/constants/routes';
import ActiveChainBalance from 'shared/components/ActiveChainBalance';

import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {setDefaultAccount} from 'redux/_ui/actions';
import {useDispatch} from 'react-redux';

import CoinsLeagueBanner from 'assets/images/banners/coinleague.svg';
import BuyCryptoButton from 'shared/components/BuyCryptoButton';
import MaticBridgeButton from 'shared/components/MaticBridgeButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import MyGamesTable from 'modules/CoinLeague/components/MyGamesTable';

import SwapButton from 'shared/components/SwapButton';

import {RoomType} from 'modules/CoinLeague/constants/enums';

import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {ChainSelect} from 'modules/CoinLeague/components/ChainSelect';

const MyGames = () => {
  const history = useHistory();
  const {account} = useWeb3();
  const {coinSymbol} = useLeaguesChainInfo();

  const defaultAccount = useDefaultAccount();
  const [room, setRoom] = useState(RoomType.Stable);
  const isNFT = room === RoomType.Stable ? false : true;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {listGamesRoute} = useCoinLeaguesFactoryRoutes(isNFT);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(listGamesRoute);
    }
    //history.push(listGamesRoute);
  }, [listGamesRoute, history]);

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
    /* eslint-disable */
  }, [account, dispatch]);

  return (
    <Grid container spacing={4} alignItems={'center'}>
      <Hidden smUp={true}>
        <Grid item xs={12}>
          <img
            src={CoinsLeagueBanner}
            style={{borderRadius: '12px'}}
            alt={'Coinleague Banner'}
          />
        </Grid>
      </Hidden>
      <Grid item xs={12} xl={6} sm={6}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h5'>
            {' '}
            <IntlMessages
              id='app.coinLeagues.myGames'
              defaultMessage={'My Games'}
            />
          </Typography>
          <Box p={2}>
            <FormControl>
              <Select
                variant='outlined'
                value={room}
                onChange={(e) => setRoom(e.target.value as RoomType)}
                renderValue={(value) => <> {value}</>}>
                <MenuItem value={RoomType.Stable}>{RoomType.Stable} </MenuItem>
                {/* <MenuItem value={RoomType.NFT}>{RoomType.NFT}</MenuItem>*/}
              </Select>
            </FormControl>
          </Box>
          <Box p={2}>
            <ChainSelect />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6} xl={6}>
        <Box display={'flex'} alignItems={'end'} justifyContent={'end'}>
          <Box pr={2}>
            <SwapButton />
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

      <CreateGameModal open={open} setOpen={setOpen} />
      <Grid item xs={12} sm={4}>
        {account ? (
          <ActiveChainBalance />
        ) : (
          <Button
            variant={'contained'}
            onClick={() => history.push(LOGIN_WALLET_ROUTE)}>
            <IntlMessages id='app.coinLeagues.connectWallet' />
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
      <Grid item xs={12}></Grid>

      <Grid item xs={12}>
        <MyGamesTable isNFT={isNFT} />
      </Grid>
    </Grid>
  );
};

export default MyGames;
