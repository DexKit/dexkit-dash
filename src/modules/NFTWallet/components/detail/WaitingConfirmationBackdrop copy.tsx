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
  Link,
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
  transaction?: string;
}

let ETHERSCAN_URL = 'https://etherscan.io/tx';

if (process.env.NODE_ENV == 'development') {
  ETHERSCAN_URL = 'https://rinkeby.etherscan.io/tx';
}

export default (props: Props) => {
  const {open, transaction} = props;
  const classes = useStyles();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <Card>
        <CardContent>
          <Grid
            container
            justify='center'
            alignItems='center'
            spacing={2}
            direction='column'>
            <Grid item>
              <Typography variant='body1'>
                <IntlMessages id='nfts.wallet.transfer.waitingBlockForConfirmation' />
              </Typography>
            </Grid>
            {transaction ? (
              <Grid item>
                <Typography variant='body1'>
                  <Link
                    href={`${ETHERSCAN_URL}/${transaction}`}
                    target='_blank'>
                    <IntlMessages id='nfts.wallet.transferViewTransaction' />
                  </Link>
                </Typography>
              </Grid>
            ) : null}
            <Grid item>
              <CircularProgress color='inherit' />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Backdrop>
  );
};
