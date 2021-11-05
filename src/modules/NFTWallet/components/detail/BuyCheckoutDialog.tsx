import React from 'react';
import {
  DialogProps,
  Dialog,
  Grid,
  Box,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  makeStyles,
  Paper,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {toTokenUnitAmount} from '@0x/utils';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
  },
  tokenImage: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

interface Props extends DialogProps {
  onConfirm: () => void;
  onClose: () => void;
  asset?: any;
  order?: any;
  loading?: boolean;
}

export default (props: Props) => {
  const {asset, order, onClose, onConfirm, loading} = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Dialog {...props} disableBackdropClick>
      <DialogTitle>
        <IntlMessages id='nfts.sell.checkoutTitle' />
      </DialogTitle>
      <DialogContent dividers>
        <Box py={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1' color='textSecondary'>
                <IntlMessages id='nfts.detail.youAreBuying' />:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper variant='outlined'>
                <Box p={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <img
                        src={asset?.image_url}
                        alt={asset?.name}
                        className={classes.image}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography gutterBottom variant='caption'>
                        {asset?.collection?.name}
                      </Typography>
                      <Typography gutterBottom variant='h5'>
                        {asset?.name}
                      </Typography>
                      <Typography gutterBottom variant='h5'>
                        <Box
                          display='flex'
                          alignItems='center'
                          alignContent='center'>
                          <img
                            alt=''
                            src={order?.payment_token_contract?.image_url}
                            className={classes.tokenImage}
                          />
                          <span>
                            {toTokenUnitAmount(
                              order?.current_price,
                              order?.payment_token_contract?.decimals,
                            ).toNumber()}
                          </span>
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        <Box py={4}>
          <Grid container spacing={2} justify='center' alignItems='center'>
            <Grid item>
              <Button
                disabled={loading}
                onClick={onConfirm}
                variant='contained'
                color='primary'
                size='large'>
                {loading ? (
                  <CircularProgress size={theme.spacing(6)} color='inherit' />
                ) : (
                  <IntlMessages id='nfts.detail.checkout' />
                )}
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={loading}
                onClick={onClose}
                variant='outlined'
                size='large'>
                <IntlMessages id='nfts.detail.checkoutCancel' />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
