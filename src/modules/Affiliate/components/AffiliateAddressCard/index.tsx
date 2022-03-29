import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {truncateAddress} from 'utils';
import {isAddress} from 'utils/ethers';

interface Props {
  address?: string;
}

function AffiliateAddressCard({address}: Props) {
  return (
    <Box p={2} component={Paper}>
      <Grid container spacing={4} alignItems='center'>
        <Grid item>
          <AccountBalanceWalletIcon style={{fontSize: 50}} />
        </Grid>
        <Grid item xs>
          <Typography gutterBottom variant='caption' color='textSecondary'>
            <IntlMessages
              id='app.affiliate.address'
              defaultMessage='Affiliate Address'
            />
          </Typography>
          <Typography variant='h5'>
            {isAddress(address) ? truncateAddress(address) : address}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AffiliateAddressCard;
