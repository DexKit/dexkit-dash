import React from 'react';

import {
  Backdrop,
  makeStyles,
  useTheme,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Link,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import IntlMessages from '@crema/utility/IntlMessages';

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
  transaction: string;
  onClose: () => void;
}

let ETHERSCAN_URL = 'https://etherscan.io/tx';

if (process.env.NODE_ENV == 'development') {
  ETHERSCAN_URL = 'https://rinkeby.etherscan.io/tx';
}

export default (props: Props) => {
  const {open, transaction, onClose} = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Backdrop open={open} className={classes.backdrop}>
      <Card>
        <CardContent>
          <Grid
            container
            justify='center'
            alignItems='center'
            spacing={4}
            direction='column'>
            <Grid item>
              <CheckCircleIcon
                style={{
                  fontSize: theme.spacing(16),
                  color: theme.palette.success.main,
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant='h5'>
                <IntlMessages id='nfts.wallet.transfer.yourTransactionSucceeded' />
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
              <Button onClick={onClose} variant='outlined'>
                <IntlMessages id='nfts.wallet.transfer.close' />
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Backdrop>
  );
};
