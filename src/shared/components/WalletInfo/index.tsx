import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';

import { useAuthUser } from '../../../@crema/utility/AppHooks';
import AppContext from '../../../@crema/utility/AppContext';
import clsx from 'clsx';
import { makeStyles, Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import { grey, orange } from '@material-ui/core/colors';
import { Fonts } from '../../constants/AppEnums';
import AppContextPropsType, {
  CremaTheme,
} from '../../../types/AppContextPropsType';
import { useWeb3 } from 'hooks/useWeb3';
import { tokenAmountInUnits } from 'utils/tokens';
import { Web3State } from 'types/blockchain';
import { isMobile } from 'web3modal';
import { truncateAddress } from 'utils';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

const WalletInfo = (props: any) => {
  const { themeMode } = useContext<AppContextPropsType>(AppContext);

  const user = useAuthUser();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { onConnectWeb3, account, ethBalance, web3State, onCloseWeb3} = useWeb3();

  /*const onConnectWallet = () => {
    connectWeb3().then((w: Web3)=>{
      w.eth.getAccounts().then(console.log);
    
      // setIsWeb3(true);
    })


  }*/

  const getUserAvatar = () => {
    if (user && user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

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
    <Box px={{ xs: 4, xl: 7 }} className={clsx(classes.crUserInfo, 'cr-user-info')}>
      {web3State === Web3State.Done && <Box display='flex' alignItems='center'>
        {user && user.photoURL ? (
          <Avatar className={classes.profilePic} src={user.photoURL} />
        ) : (
          <Avatar className={classes.profilePic}>{getUserAvatar()}</Avatar>
        )}
        
        <Box ml={4} className={clsx(classes.userInfo, 'user-info')}>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Box mb={0} className={clsx(classes.userName)}>
              {account && truncateAddress(account)}
            </Box>
            <Box ml={3} className={classes.pointer} color={'text.primary'}>
              <Box component='span' onClick={handleClick}>
                <ExpandMoreIcon />
              </Box>
              <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem>My Wallet</MenuItem>
                <MenuItem onClick={onCloseWeb3}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box color={grey.A200} className={classes.designation}>
            {ethBalance && tokenAmountInUnits(ethBalance)} ETH 
          </Box>
        </Box>
      </Box>
      }
      {web3State !== Web3State.Done && <Box display='flex' alignItems='center' justifyContent='center'>
         <Button variant="contained" color="primary" onClick={onConnectWeb3} endIcon={ <AccountBalanceWalletIcon/>}>
            {web3State === Web3State.Connecting ? (isMobile() ? 'Connecting...' : 'Connecting... Check Wallet') : (isMobile() ? 'Connect' : 'Connect Wallet')}
        </Button>
      </Box>
      }
    </Box>
  );
};

export default WalletInfo;
