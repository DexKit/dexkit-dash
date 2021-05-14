import React, {useState} from 'react';
import {Box, Button, Card} from '@material-ui/core';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {MyBalance} from 'types/bitquery/myBalance.interface';
import CoinsInfo from './CoinsInfo';
import Receiver from './Receiver';
import Sender from './Sender';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { isMobile } from 'web3modal';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { useWeb3 } from 'hooks/useWeb3';
import { Web3State } from 'types/blockchain';
interface TotalBalanceProps {
  balances: MyBalance[];
  featuredTokenBalance?: {symbol: string, address: string};
}

const TotalBalance: React.FC<TotalBalanceProps> = ({balances, featuredTokenBalance}) => {
  const [senderModal, setSenderModal] = useState(false);
  const [receiverModal, setReceiverModal] = useState(false);

  const { onConnectWeb3, account, ethBalance, web3State, onCloseWeb3} = useWeb3();

  const usdAvailable = balances.reduce((acc, current) => {
    return (acc += current.valueUsd || 0);
  }, 0);

  const useStyles = makeStyles((theme: CremaTheme) => ({
    root: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
    btnPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
    btnSecondary: {
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      fontFamily: Fonts.BOLD,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
      },
      lineHeight: '16px',
      [theme.breakpoints.up('sm')]: {
        lineHeight: '20px',
      },
      [theme.breakpoints.up('xl')]: {
        lineHeight: '26px',
      },
    },
  }));

  const classes = useStyles();

  return (
    account ?  
    <Box>
      <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} clone>
        <Card>
          <Box
            mb={3}
            display='flex'
            // flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}
            flexDirection={'row'}
            flexWrap={'wrap'}
            justifyContent={'space-between'}>
            <Box display='flex' alignItems='center' mr={2}>
              <Box
                component='h3'
                color='text.primary'
                fontFamily={Fonts.BOLD}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                ${usdAvailable.toFixed(2)}
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                Avl. Balance
              </Box>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Button
                  onClick={() => setSenderModal(true)}
                  className={classes.root}>
                  <IntlMessages id='common.send' /> {'   '}
                  <CallMadeIcon />
                </Button>
              </Box>
              <Box ml={3}>
                <Button onClick={() => setReceiverModal(true)}  className={classes.btnSecondary}>
                  <IntlMessages id='common.receive' />{' '} <CallReceivedIcon/>
                </Button>
              </Box>
            </Box>
          </Box>
          {/* <Box
            component='p'
            mb={{xs: 3.5, md: 4, xl: 6}}
            fontSize={{xs: 16, xl: 18}}
            color={indigo[100]}>
            <IntlMessages id='dashboard.buyCurrency' />
          </Box> */}
          <Box pt={{lg: 5}}>
            <CoinsInfo coins={balances} coinFeatured={featuredTokenBalance}/>
          </Box>
        </Card>
      </Box>

      <Sender
        open={senderModal}
        onClose={() => setSenderModal(false)}
        balances={balances}
      />

      <Receiver open={receiverModal} onClose={() => setReceiverModal(false)} />
    </Box> : 
      <Box>
      <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} clone>
        <Card>
          <Box
            mb={3}
            display='flex'
            // flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}
            flexDirection={'row'}
            flexWrap={'wrap'}
            justifyContent={'center'}>
               <Button variant="contained" color="primary" onClick={onConnectWeb3}  endIcon={   <AccountBalanceWalletIcon/>}>
                 {web3State === Web3State.Connecting ? (isMobile() ? 'Connecting...' : 'Connecting... Check Wallet') : (isMobile() ? 'Connect' : 'Connect Wallet')}
              </Button>
          </Box>
        </Card>
      </Box>
    </Box>  
  );
};

export default TotalBalance;
