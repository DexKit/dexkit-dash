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
import SendIcon from '@material-ui/icons/Send';

import CallReceivedIcon from '@material-ui/icons/CallReceived';
interface TotalBalanceProps {
  balances: MyBalance[];
}

const TotalBalance: React.FC<TotalBalanceProps> = ({balances}) => {
  const [senderModal, setSenderModal] = useState(false);
  const [receiverModal, setReceiverModal] = useState(false);

  const usdAvailable = balances.reduce((acc, current) => {
    return acc += current.valueUsd || 0;
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
        color: 'white'},
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
  }));

  const classes = useStyles();
  console.log('TotalBalance loaded');

  return (
    <Box>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        clone>
        <Card>
          <Box
            mb={{xs: 3, md: 6, xl: 8}}
            display='flex'
            flexDirection={{xs: 'column', xl: 'row'}}
            alignItems={{xl: 'center'}}>
            <Box display='flex' alignItems='center'>
              <Box
                component='h3'
                color='black'
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
                <Button onClick={() => setSenderModal(true)}  className={classes.root}>
                  <IntlMessages id='common.send' /> {'   '}<SendIcon/> 
                </Button>
              </Box>
              <Box ml={3}>
                <Button onClick={() => setReceiverModal(true)}  className={classes.btnPrimary}>
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
          <Box pt={{xl: 5}}>
            <CoinsInfo coins={balances} />
          </Box>
        </Card>
      </Box>
      
      <Sender open={senderModal} onClose={() => setSenderModal(false)} balances={balances} />
      
      <Receiver open={receiverModal} onClose={() => setReceiverModal(false)} />

    </Box>
  );
};

export default TotalBalance;
