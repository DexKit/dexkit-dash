import React, {useCallback} from 'react';
import {Button, Grid} from '@material-ui/core';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Box from '@material-ui/core/Box';

import {Empty} from 'shared/components/Empty';
import {ReactComponent as EmptyWallet} from 'assets/images/icons/empty-wallet.svg';
import {useHistory} from 'react-router-dom';

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

const NoWallet = () => {
  const history = useHistory();
  const {messages} = useIntl();

  const handleConnectWallet = useCallback(() => {
    history.push('/onboarding/login-wallet');
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Empty
          title={messages['app.coinLeagues.noWallet'] as string}
          message={messages['app.coinLeagues.pleaseConnectWallet'] as string}
          image={<EmptyWallet />}
          callToAction={
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Button
                size='large'
                variant='contained'
                color='primary'
                onClick={handleConnectWallet}
                endIcon={<AccountBalanceWalletIcon />}>
                <IntlMessages id='app.coinLeagues.connectWallet' />
              </Button>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default NoWallet;
