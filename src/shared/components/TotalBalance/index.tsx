import React from 'react';
import {Card} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import CoinsInfo from './CoinsInfo';
import {indigo} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from 'shared/constants/AppEnums';
import {BuySellProps, TotalBalanceData} from 'types/models/Crypto';
import {CremaTheme} from 'types/AppContextPropsType';
import Modal, { Receive } from './Modal';
import { useWeb3 } from 'hooks/useWeb3';
import { MyBalance } from 'types/bitquery/myBalance.interface';
interface TotalBalanceProps {
  totalBalanceData: TotalBalanceData;
  balances: MyBalance[];
}

const TotalBalance: React.FC<TotalBalanceProps> = ({totalBalanceData, balances}) => {
  const [open, setOpen] = React.useState(false);
  const [receiveModal, setReceive] = React.useState(false);
  const { onActionWeb3Transaction, account } = useWeb3();
  const [_balances] = React.useState<MyBalance[]>(balances ?? []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = async ($e: React.MouseEvent<HTMLButtonElement, MouseEvent>, buySell: BuySellProps): Promise<void> => {
    try{
      console.log('buySell', buySell);
      const result = await onActionWeb3Transaction({
        to: buySell.address,
        from: account,
        value: Number(buySell.buyData.price)*Number(buySell.buyData.amount)
      });
      console.log('transaction result', result);
    }catch(e){
      console.error('transaction error', e);
    }
  }

  const useStyles = makeStyles((theme: CremaTheme) => ({
    root: {
      backgroundColor: 'white',
      color: 'black',
      fontFamily: Fonts.LIGHT,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {backgroundColor: 'white', color: 'black'},
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
      fontFamily: Fonts.LIGHT,
      textTransform: 'capitalize',
      width: 96,
      fontSize: 16,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.main,
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
    <Box>
      <Box
        py={{xs: 5, sm: 5, xl: 5}}
        px={{xs: 6, sm: 6, xl: 6}}
        style={{backgroundColor: indigo[500]}}
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
                color='primary.contrastText'
                fontFamily={Fonts.LIGHT}
                fontSize={{xs: 18, sm: 20, xl: 22}}>
                {totalBalanceData.balance}
              </Box>
              <Box
                component='span'
                ml={3}
                color={indigo[100]}
                fontSize={{xs: 16, xl: 18}}
                whiteSpace='nowrap'>
                ETH
              </Box>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              ml={{xs: 0, xl: 'auto'}}
              mt={{xs: 2, xl: 0}}>
              <Box>
                <Button onClick={handleClickOpen}  className={classes.root}>
                  <IntlMessages id='common.send' />
                </Button>
              </Box>
              <Box ml={3}>
                <Button onClick={() => setReceive(true)}  className={classes.btnPrimary}>
                  <IntlMessages id='common.receive' />
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
            <CoinsInfo coins={totalBalanceData.coins} />
          </Box>
        </Card>
      </Box>
      <Modal  balances={_balances} open={open} onClose={handleClose} onSend={handleSend} />
      <Receive open={receiveModal} onClose={() => setReceive(false)} />

    </Box>
  );
};

export default TotalBalance;
