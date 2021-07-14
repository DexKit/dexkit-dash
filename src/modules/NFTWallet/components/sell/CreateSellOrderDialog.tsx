import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: theme.spacing(15),
    color: theme.palette.success.main,
  },
}));

interface Props extends DialogProps {
  success?: boolean;
  asset?: any;
}

export default (props: Props) => {
  const {success, asset} = props;
  const classes = useStyles();

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
                  <CheckCircleIcon className={classes.icon} />
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
