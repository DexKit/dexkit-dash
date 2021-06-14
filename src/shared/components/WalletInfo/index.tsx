import React, {useContext} from 'react';

import AppContext from '../../../@crema/utility/AppContext';
import clsx from 'clsx';
import {makeStyles, Button, IconButton, Tooltip, Chip} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import {green, grey, orange} from '@material-ui/core/colors';
import {Fonts} from '../../constants/AppEnums';
import AppContextPropsType, {
  CremaTheme,
} from '../../../types/AppContextPropsType';
import {useWeb3} from 'hooks/useWeb3';
import {useBalance} from 'hooks/balance/useBalance';
import {tokenAmountInUnits} from 'utils/tokens';
import {Web3State} from 'types/blockchain';
import {isMobile} from 'web3modal';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { truncateAddress } from 'utils/text';
import { useHistory, useLocation } from 'react-router-dom';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { setDefaultAccount } from 'redux/_ui/actions';
import { GET_CHAIN_ID_NAME } from 'shared/constants/Blockchain';
const WalletInfo = (props: any) => {
  const {themeMode} = useContext<AppContextPropsType>(AppContext);

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
    chainId,
    onCloseWeb3,
  } = useWeb3();
  const defaultAccount = useDefaultAccount();
  const connected  = web3Account === defaultAccount;
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(state => state.ui.accounts);
  const dispatch = useDispatch();

  const {data: balances} = useBalance(defaultAccount);

  const onGoToWallet = () => {
    handleClose();
    history.push('/dashboard/wallet')
  }
  const onGoToManageWallet = () => {
    handleClose();
    history.push('/dashboard/wallet/manage-accounts')
  }

  const filteredBalances = balances?.filter(
    (e) => e.currency?.symbol === 'ETH',
  );

  let ethBalanceValue;

  if (filteredBalances.length > 0) {
    ethBalanceValue = filteredBalances[0].value;
  }

  const onSetDefaultAccount = (a: string) => {
    const pathname = location.pathname;
    if(pathname && pathname.indexOf('dashboard/wallet') === 1){
      // This is need because it was not changing the url and causing loop on update
      history.push(`/dashboard/wallet/${a}`);
      dispatch(setDefaultAccount(a));
    }else{
      dispatch(setDefaultAccount(a));
    }
  
  }

  /*const onConnectWallet = () => {
    connectWeb3().then((w: Web3)=>{
      w.eth.getAccounts().then(console.log);
    
      // setIsWeb3(true);
    })
  }*/

  // const getUserAvatar = () => {
  //   if (user && user.displayName) {
  //     return user.displayName.charAt(0).toUpperCase();
  //   }
  //   if (user && user.email) {
  //     return user.email.charAt(0).toUpperCase();
  //   }
  // };

  const useStyles = makeStyles((theme: CremaTheme) => {
    return {
      crUserInfo: {
        backgroundColor: theme.palette.background.default,
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
    };
  });

  const classes = useStyles(props);

  return (
    <Box
      px={{xs: 4, xl: 7}}
      className={clsx(classes.crUserInfo, 'cr-user-info')}>
      {(web3State === Web3State.Done || defaultAccount) && (
        <Box display='flex' alignItems='center'>
          {/* {user && user.photoURL ? (
          <Avatar className={classes.profilePic} src={user.photoURL} />
        ) : (
          <Avatar className={classes.profilePic}>{getUserAvatar()}</Avatar>
        )} */}

          <Box ml={4} className={clsx(classes.userInfo, 'user-info')}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'>
              <Box mb={0} className={clsx(classes.userName)}>
                {truncateAddress(defaultAccount)}
                <Tooltip title={connected ? 'Wallet Connected' : 'Wallet Not Connected' }>
                      <IconButton aria-label="connected" style={{ color: connected ? green[500] : grey[500] , paddingLeft: '5px'}} size="small">
                      {connected ? <FiberManualRecordIcon /> : <RadioButtonUncheckedIcon/>}
                      </IconButton>
                    </Tooltip>
                   { chainId && 
                    <Tooltip title={'Connected Network' }>  
                     <Chip  color={'default'}  label={GET_CHAIN_ID_NAME(chainId)} size={'small'} style={{marginLeft: '5px'}}/>
                   </Tooltip>
                   }

              </Box>
              <Box ml={3} className={classes.pointer} color={'text.primary'}>
                <Box component='span' onClick={handleClick}>
                  <ExpandMoreIcon />
                </Box>
                <Menu
                  id='simple-menu'
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}>
                  <MenuItem onClick={onGoToWallet}>My Wallet</MenuItem>
                  {accounts.filter(a=> a !== defaultAccount).map(a => 
                    <MenuItem onClick={()=> onSetDefaultAccount(a)}>{truncateAddress(a)}
                   {a === web3Account &&  <Tooltip title={'Wallet Connected'}>
                      <IconButton aria-label="connected" style={{ color:green[500]}} size="small">
                           <FiberManualRecordIcon />
                      </IconButton>
                    </Tooltip>}
                    
                    </MenuItem>
                  )}
                  <MenuItem onClick={onGoToManageWallet}>Manage Accounts</MenuItem>
                  <MenuItem onClick={onCloseWeb3}>Logout</MenuItem>
                </Menu>
              </Box>
            </Box>
            <Box color={grey.A200} className={classes.designation}>
              {ethBalanceValue
                ? ethBalanceValue.toFixed(4)
                : ethBalance && tokenAmountInUnits(ethBalance)}{' '}
              ETH
            </Box>
          </Box>
        </Box>
      )}
      {(web3State !== Web3State.Done && !defaultAccount) && (
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Button
            variant='contained'
            color='primary'
            onClick={onConnectWeb3}
            endIcon={<AccountBalanceWalletIcon />}>
            {web3State === Web3State.Connecting
              ? isMobile()
                ? 'Connecting...'
                : 'Connecting... Check Wallet'
              : isMobile()
              ? 'Connect'
              : 'Connect Wallet'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WalletInfo;
