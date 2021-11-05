import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  Typography,
} from '@material-ui/core';
import React from 'react';

import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {ReactComponent as SuccessIcon} from 'assets/images/icons/success-icon.svg';

interface Props extends DialogProps {
  success?: boolean;
  asset?: any;
}

export default (props: Props) => {
  const {success, asset} = props;
  return (
    <Dialog {...props} disableBackdropClick>
      <DialogContent>
        <Box mb={4}>
          {success ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'
                  mb={2}>
                  <SuccessIcon />
                </Box>
                <Typography gutterBottom align='center' variant='h5'>
                  <IntlMessages id='nfts.sell.itemSuccessFullyListed' />
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  <IntlMessages id='nfts.sell.accessItemListing' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  component={RouterLink}
                  to={`/nfts/assets/${asset?.asset_contract?.address}/${asset?.token_id}`}
                  variant='contained'
                  color='primary'
                  size='large'>
                  <IntlMessages id='nfts.sell.viewListing' />
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h5'>
                  <IntlMessages id='nfts.sell.listingYourItem' />
                </Typography>
                <Typography
                  align='center'
                  color='textSecondary'
                  variant='body1'>
                  <IntlMessages id='nfts.sell.acceptSignatureRequest' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <CircularProgress color='primary' />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
