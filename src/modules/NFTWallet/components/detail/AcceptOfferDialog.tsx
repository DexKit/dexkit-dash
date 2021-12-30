import React from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import {getPriceFromOrder} from 'modules/NFTWallet/utils';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  tokenImageSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  image: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  offer: any;
  asset: any;
}

export default (props: Props) => {
  const {open, onClose, onAccept, offer, asset} = props;
  const classes = useStyles();
  const {messages} = useIntl();

  return (
    <Dialog open={open} onClose={onClose}>
      <CustomDialogTitle title={messages['app.nftWallet.acceptThisOffer']} />

      <DialogContent>
        <Box py={2}>
          <Box mb={4}>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              justify='space-between'
              spacing={2}>
              <Grid item>
                <Typography variant='caption'>
                  {asset?.collection?.name}
                </Typography>
                <Typography variant='h5'>{asset?.name}</Typography>
              </Grid>
              <Grid item>
                <Grid
                  alignItems='center'
                  alignContent='center'
                  container
                  spacing={2}>
                  <Grid item>
                    <Tooltip
                      title={offer?.payment_token_contract?.symbol}
                      aria-label='add'>
                      <Avatar
                        className={classes.tokenImageSmall}
                        src={offer?.payment_token_contract?.image_url as string}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    {offer ? (
                      <Typography>
                        {getPriceFromOrder(offer).toFixed(2)}
                      </Typography>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box py={2}>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              justify='space-between'>
              <Grid item>
                <Typography variant='body2' color='textSecondary'>
                  OpenSea Fee
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2' color='textSecondary'>
                  2.50%
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              justify='space-between'>
              <Grid item>
                <Typography variant='body1' color='textSecondary'>
                  Total Earnings
                </Typography>
              </Grid>
              <Grid item>
                <Grid
                  alignItems='center'
                  alignContent='center'
                  container
                  spacing={2}>
                  <Grid item>
                    <Tooltip
                      title={offer?.payment_token_contract?.symbol}
                      aria-label='add'>
                      <Avatar
                        className={classes.tokenImageSmall}
                        src={offer?.payment_token_contract?.image_url as string}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    {offer ? (
                      <Typography>
                        {getPriceFromOrder(offer) * 0.975}
                      </Typography>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box py={4}>
          <Grid container justify='center' alignItems='center' spacing={2}>
            <Grid item>
              <Button
                onClick={onAccept}
                size='large'
                variant='contained'
                color='primary'>
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={onClose} size='large' variant='outlined'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
