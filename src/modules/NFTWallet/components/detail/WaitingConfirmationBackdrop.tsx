import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  Backdrop,
  Card,
  CardContent,
  makeStyles,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  assetImage: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
}));

interface Props {
  open: boolean;
}

export default (props: Props) => {
  const {open} = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <Card>
        <CardContent>
          <Grid container justify='center' alignItems='center' spacing={4}>
            <Grid item>
              <CircularProgress size={theme.spacing(10)} color='primary' />
            </Grid>
            <Grid item>
              <Typography variant='h5'>Transferring NFT</Typography>
              <Typography variant='body1' color='textSecondary'>
                <IntlMessages id='nfts.wallet.transfer.waitingBlockForConfirmation' />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Backdrop>
  );
};
