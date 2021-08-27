import React, {useCallback} from 'react';

import {
  makeStyles,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Hidden,
  Typography,
  useTheme,
  Divider,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import {green, grey, orange} from '@material-ui/core/colors';
import {Fonts} from '../../constants/AppEnums';
import {CremaTheme} from '../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';
import {useBalance} from 'hooks/balance/useBalance';
import {tokenAmountInUnits} from 'utils/tokens';
import {Web3State} from 'types/blockchain';

import {truncateAddress, truncateIsAddress} from 'utils/text';
import {useHistory, useLocation} from 'react-router-dom';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'redux/store';
import {setDefaultAccount} from 'redux/_ui/actions';

import {UIAccount} from 'redux/_ui/reducers';
import {useDefaultLabelAccount} from 'hooks/useDefaultLabelAccount';

import {ReactComponent as WalletAddIcon} from 'assets/images/icons/wallet-add.svg';
import {useAccountsModal} from 'hooks/useAccountsModal';
import {GreenSquare} from '../GreenSquare';
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const history = useHistory();
  const location = useLocation();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    onConnectWeb3,
    account: web3Account,
    ethBalance,
    web3State,
    onCloseWeb3,
  } = useWeb3();
  const defaultAccount = useDefaultAccount();
  const defaultAccountLabel = useDefaultLabelAccount();
  const connected =
    web3Account?.toLowerCase() === defaultAccount?.toLowerCase();
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(
    (state) => state.ui.accounts,
  );
  const dispatch = useDispatch();

  const {data: balances} = useBalance(defaultAccount);

  const onGoToWallet = () => {
    handleClose();
    history.push('/dashboard/wallet');
  };

  const accountsModal = useAccountsModal();

  const handleShowAccounts = useCallback(() => {
    handleClose();
    accountsModal.setShow(true);
  }, [handleClose, accountsModal]);

  const onGoToManageWallet = () => {
    handleClose();
    history.push('/dashboard/wallet/manage-accounts');
  };

  const filteredBalances = balances?.filter(
    (e) => e.currency?.symbol === 'ETH',
  );

  let ethBalanceValue;

  if (filteredBalances.length > 0) {
    ethBalanceValue = filteredBalances[0].value;
  }

  const onSetDefaultAccount = (a: UIAccount) => {
    const pathname = location.pathname;
    if (pathname && pathname.indexOf('dashboard/wallet') === 1) {
      // This is need because it was not changing the url and causing loop on update
      history.push(`/dashboard/wallet/${a.address}`);
      dispatch(setDefaultAccount(a));
    } else {
      dispatch(setDefaultAccount(a));
    }
  };

  const notConnected = !web3Account;

  const classes = useStyles(props);

  const theme = useTheme();

  return web3State === Web3State.Done || defaultAccount ? (
    <Box className={classes.walletBalance}>
      <Grid container alignItems='center' alignContent='center' spacing={2}>
        <Grid item>
          <Grid container alignItems='center' alignContent='center' spacing={2}>
            <Grid item>
              <Tooltip
                title={connected ? 'Wallet Connected' : 'Wallet Not Connected'}>
                <IconButton
                  aria-label='connected'
                  style={{
                    color: connected ? green[500] : grey[500],
                    paddingLeft: '5px',
                  }}
                  size='small'>
                  {connected ? (
                    <FiberManualRecordIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}
                </IconButton>
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
                  ETH
                </Typography>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box ml={3} className={classes.pointer} color={'text.primary'}>
            <IconButton size='small' onClick={handleClick}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}>
              <MenuItem onClick={onGoToWallet}>My Wallet</MenuItem>
              {notConnected && (
                <MenuItem onClick={onConnectWeb3}>Connect Wallet</MenuItem>
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
              <MenuItem onClick={onCloseWeb3}>Logout</MenuItem>
            </Menu>
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box>
      <Button
        variant='contained'
        color='primary'
        size='large'
        onClick={onGoToManageWallet}
        startIcon={<WalletAddIcon />}>
        Connect wallet
      </Button>
    </Box>
  );
};

export default WalletInfo;
