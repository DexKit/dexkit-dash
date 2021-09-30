import React, {useCallback, useMemo, useState} from 'react';

import {
  makeStyles,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Hidden,
  Typography,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import {green, grey, orange} from '@material-ui/core/colors';
import {Fonts} from '../../constants/AppEnums';
import {CremaTheme} from '../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';

import {tokenAmountInUnits} from 'utils/tokens';
import {SupportedNetworkType, Web3State} from 'types/blockchain';

import {truncateAddress, truncateIsAddress} from 'utils/text';
import {useHistory, useLocation} from 'react-router-dom';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {setDefaultAccount} from 'redux/_ui/actions';

import {UIAccount} from 'redux/_ui/reducers';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';

import {ReactComponent as WalletAddIcon} from 'assets/images/icons/wallet-add.svg';
import {useAccountsModal} from 'hooks/useAccountsModal';
import {
  FORMAT_NETWORK_NAME,
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {useNetwork} from 'hooks/useNetwork';

import {GetNativeCoinFromNetworkName} from 'utils/tokens';

import {useNativeSingleBalance} from 'hooks/balance/useNativeSingleBalance';
import {StatusSquare} from '../StatusSquare';
import {LOGIN_WALLET_ROUTE, WALLET_ROUTE} from 'shared/constants/routes';
const useStyles = makeStyles((theme: CremaTheme) => {
  return {
    crUserInfo: {
      paddingTop: 9,
      paddingBottom: 9,
      minHeight: 56,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 70,
      },
    },
    profilePic: {
      height: 40,
      width: 40,
      fontSize: 24,
      backgroundColor: orange[500],
      [theme.breakpoints.up('xl')]: {
        height: 45,
        width: 45,
      },
    },
    userInfo: {
      width: 'calc(100% - 75px)',
    },
    userName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 18,
      fontFamily: Fonts.MEDIUM,
      [theme.breakpoints.up('xl')]: {
        fontSize: 20,
      },
      color: 'text.primary',
    },
    designation: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    pointer: {
      cursor: 'pointer',
    },
    adminRoot: {
      color: grey[500],
      fontSize: 16,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    walletBalance: {
      padding: theme.spacing(2),
      backgroundColor: '#252836',
      borderRadius: 8,
    },
  };
});

const WalletInfo = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const networkName = useNetwork();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const accountsModal = useAccountsModal();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const history = useHistory();
  const location = useLocation();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {account: web3Account, ethBalance, web3State, onCloseWeb3} = useWeb3();
  const defaultAccount = useDefaultAccount();
  const network = useNetwork();
  const defaultAccountLabel = useDefaultLabelAccount();
  const connected = useMemo(() => {
    return web3Account?.toLowerCase() === defaultAccount?.toLowerCase();
  }, [web3Account, defaultAccount]);

  const wallet = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  const accounts = wallet[SupportedNetworkType.evm];
  const dispatch = useDispatch();

  const {data: balances} = useNativeSingleBalance(
    GET_NATIVE_COIN_FROM_NETWORK_NAME(network).toUpperCase(),
    network,
    defaultAccount,
  );

  const onGoToWallet = () => {
    handleClose();
    history.push('/wallet');
  };

  const handleShowAccounts = useCallback(() => {
    handleClose();
    accountsModal.setShow(true);
  }, [handleClose, accountsModal]);

  const onGoToManageWallet = () => {
    handleClose();
    history.push('/onboarding/login-wallet');
  };

  const onGoToLoginWallet = () => {
    handleClose();
    history.push('/onboarding/login-wallet');
  };

  let ethBalanceValue;

  ethBalanceValue = balances;

  const onSetDefaultAccount = (a: UIAccount) => {
    const pathname = location.pathname;
    if (pathname && pathname.startsWith('/wallet')) {
      history.push(`/wallet/${a.address}`);
      // This is need because it was not changing the url and causing loop on update
      dispatch(setDefaultAccount({account: a, type: SupportedNetworkType.evm}));
    } else {
      dispatch(setDefaultAccount({account: a, type: SupportedNetworkType.evm}));
    }
  };

  const notConnected = !web3Account;

  const classes = useStyles(props);

  const isOnLoginPage = useCallback(() => {
    return history.location.pathname == LOGIN_WALLET_ROUTE;
  }, [history]);

  return web3State === Web3State.Done || defaultAccount ? (
    <Box className={classes.walletBalance}>
      <Grid
        container
        alignItems='center'
        alignContent='center'
        justify='space-between'
        spacing={2}>
        <Grid item>
          <Grid
            container
            alignItems='stretch'
            alignContent='center'
            spacing={2}>
            <Grid item>
              <Tooltip
                title={connected ? 'Wallet Connected' : 'Wallet Not Connected'}>
                {connected ? (
                  <StatusSquare color={green[500]} />
                ) : (
                  <StatusSquare color={grey[500]} />
                )}
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant='body1'>
                {truncateIsAddress(defaultAccountLabel)}
              </Typography>
              <Hidden smDown={true}>
                <Typography variant='caption'>
                  {ethBalanceValue
                    ? ethBalanceValue.toFixed(4)
                    : ethBalance && tokenAmountInUnits(ethBalance)}{' '}
                  {GetNativeCoinFromNetworkName(networkName)}
                </Typography>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box className={classes.pointer} color={'text.primary'}>
            <IconButton size='small' onClick={handleClick}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
             {!history.location.pathname.startsWith(WALLET_ROUTE) && <MenuItem onClick={onGoToWallet}>My Wallet</MenuItem>}
              {notConnected && (
                <MenuItem onClick={onGoToLoginWallet}>Connect Wallet</MenuItem>
              )}
              
              {accounts
                .filter(
                  (a) =>
                    a?.address?.toLowerCase() !== defaultAccount?.toLowerCase(),
                )
                .map((a, i) => (
                  <MenuItem key={i} onClick={() => onSetDefaultAccount(a)}>
                    <Box display='flex' alignItems='center'>
                      {a?.address?.toLowerCase() ===
                      web3Account?.toLowerCase() ? (
                        <Box
                          mr={2}
                          display='flex'
                          alignItems='center '
                          alignContent='center'
                          justifyContent='center'>
                          <FiberManualRecordIcon
                            style={{color: theme.palette.success.main}}
                          />
                        </Box>
                      ) : null}
                      <Box>
                        {truncateIsAddress(a.label) ||
                          truncateAddress(a.address)}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
             
              <MenuItem onClick={handleShowAccounts}>Manage Accounts</MenuItem>
              {!notConnected && (
                <MenuItem onClick={onGoToLoginWallet}>Connect Other Wallet</MenuItem>
              )}
              {!notConnected && (
                <MenuItem onClick={onCloseWeb3}>Disconnect Wallet</MenuItem>
              )}
            </Menu>
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : !isOnLoginPage() && !defaultAccount ? (
    <Box>
      <Button
        variant='contained'
        color='primary'
        size={isMobile ? 'small' : 'large'}
        onClick={onGoToManageWallet}
        startIcon={<WalletAddIcon />}>
        Connect wallet
      </Button>
    </Box>
  ) : null;
};

export default WalletInfo;
