import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import React, {useEffect} from 'react';
import {useHistory} from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getMagic, getCachedMagicNetwork} from 'services/magic';
import MoneyWalletIcon from 'assets/images/icons/wallet-money.svg';
import Grid from '@material-ui/core/Grid';
import {useWelcomeModal} from 'hooks/useWelcomeModal';

const MagicCallbackEmail = () => {
  const {onConnectMagic} = useMagicProvider();
  const history = useHistory();
  const {loginBackRoute, onSetLoginBackRoute} = useWelcomeModal();
  ////TODO: colocar loading nos callbacks
  useEffect(() => {
    // On mount, we try to login with a Magic credential in the URL query.
    const network = getCachedMagicNetwork();
    const magic = getMagic(network);
    magic.auth.loginWithCredential().finally(() => {
      onConnectMagic().then((acc)=>{
          if(loginBackRoute){   
            history.push(loginBackRoute);
            onSetLoginBackRoute(undefined)
          }else{
            if(acc && acc.length){
              history.push(`/wallet/${acc[0]}`);
            }else{
              history.push('/wallet');
            }
          }  
      })
    });
  }, []);

  return (
    <Box p={20}>
      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'>
        <Grid item>
          <img
            src={MoneyWalletIcon}
            style={{height: 150, width: 150}}
            alt='Wallet'
          />
        </Grid>
        <Grid item>
          <Box display={'flex'} alignItems='center'>
            <Typography variant={'body1'}>Redirecting to Wallet ...</Typography>
            <Box p={4}>
              <CircularProgress color='inherit' />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MagicCallbackEmail;
