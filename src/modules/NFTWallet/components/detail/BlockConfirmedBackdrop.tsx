import React, {useEffect, useState} from 'react';

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
import {getChainId, RINKEBY_NETWORK} from 'utils/opensea';
import {useWeb3} from 'hooks/useWeb3';

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

function useEtherscanUrl() {
  const [url, setUrl] = useState('https://etherscan.io/tx');
  const {getProvider} = useWeb3();

  useEffect(() => {
    (async () => {
      const provider = getProvider();

      if ((await getChainId(provider)) == RINKEBY_NETWORK) {
        setUrl('https://rinkeby.etherscan.io/tx');
      }
    })();
  }, [getProvider]);

  return {url};
}

export default (props: Props) => {
  const {open, transaction, onClose} = props;
  const classes = useStyles();
  const theme = useTheme();

  const {url} = useEtherscanUrl();

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
                  <Link href={`${url}/${transaction}`} target='_blank'>
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
