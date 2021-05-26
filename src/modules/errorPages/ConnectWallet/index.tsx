import React from 'react';
import Button from '@material-ui/core/Button';

import InfoView from '../../../@crema/core/InfoView';

import Box from '@material-ui/core/Box';

import {makeStyles} from '@material-ui/core';
import {Fonts} from '../../../shared/constants/AppEnums';
import { useWeb3 } from 'hooks/useWeb3';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

interface ComingSoonProps {}



const ConnectWallet: React.FC<ComingSoonProps> = () => {
  const { onConnectWeb3 } = useWeb3();
  const useStyles = makeStyles(() => {
    return {
      form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 12,
      },
      textField: {
        width: '100%',
        marginBottom: 20,
      },
      button: {
        fontFamily: Fonts.LIGHT,
        fontSize: 20,
        textTransform: 'capitalize',
        padding: '8px 32px',
      },
    };
  });

  const classes = useStyles();

  return (
    <>
      <Box
        py={{xl: 8}}
        flex={1}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        textAlign='center'>
        <Box>
          <Box
            component='h3'
            mb={{xs: 4, xl: 10}}
            fontSize={{xs: 24, md: 28}}
            fontFamily={Fonts.LIGHT}>
           You need to connect your wallet to check this page
          </Box>
          <Box mx='auto' mb={5} maxWidth={384} display={'flex'} alignItems={'center'}>   
          <AccountBalanceWalletIcon color={'primary'} style={{fontSize:'128px', marginRight: '35px'}}/>     
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    className={classes.button}
                    onClick={onConnectWeb3}
                    >
                   Connect Wallet
                  </Button>  
          </Box>
          <Box mb={5} maxWidth={{xs: 300, sm: 400, xl: 672}} width='100%' display={'flex'}>
            
            {/*<img
              src={require('assets/images/errorPageImages/connect-wallet.png')}
              alt='Connect Wallet'
            />*/}
          </Box>
        </Box>
        <InfoView />
      </Box>
    </>
  );
};

export default ConnectWallet;
