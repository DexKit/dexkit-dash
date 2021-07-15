import React, {useCallback, useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  Typography,
  Link,
  Grid,
  Button,
  Box,
  Paper,
  makeStyles,
} from '@material-ui/core';

import LinkIcon from '@material-ui/icons/Link';

import {Skeleton} from '@material-ui/lab';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {
  getAssetOwnerName,
  isAssetOwner,
  isAssetSingleOwner,
  getAssetOwnerAddress,
} from 'modules/NFTWallet/utils';
import IntlMessages from '@crema/utility/IntlMessages';
import {toTokenUnitAmount} from '@0x/utils';
import {Link as RouterLink} from 'react-router-dom';
import {OrderSide} from 'opensea-js/lib/types';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {KeyboardDateTimePicker} from '@material-ui/pickers';
import moment from 'moment';
import {useWeb3} from 'hooks/useWeb3';
import {getOpenSeaPort, getChainId, RINKEBY_NETWORK} from 'utils/opensea';

const useStyles = makeStyles((theme) => ({
  tokenImage: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

interface Props {
  asset: any;
  loading?: boolean;
  error?: any;
  onBuy: (listing: any) => void;
}

export default (props: Props) => {
  const {asset, loading, error, onBuy} = props;
  const classes = useStyles();
  const [isTestnet, setIsTestnet] = useState(false);
  const {getProvider} = useWeb3();
  const userAccountAddress = useDefaultAccount();

  const hasListing = useCallback((asset: any) => {
    return (
      asset?.orders?.filter((o: any) => o.side == OrderSide.Sell).length > 0
    );
  }, []);

  const getFirstOrder = useCallback((asset: any) => {
    return asset?.orders.filter((o: any) => o.side == OrderSide.Sell)[0];
  }, []);

  const getFirstOrderTokenImage = useCallback((asset: any) => {
    return getFirstOrder(asset).payment_token_contract?.image_url;
  }, []);

  const getFirstOrderPrice = useCallback((asset: any) => {
    const order = getFirstOrder(asset);

    return toTokenUnitAmount(
      order.current_price,
      order.payment_token_contract?.decimals,
    ).toNumber();
  }, []);

  const handleBuy = useCallback(() => {
    onBuy(getFirstOrder(asset));
  }, [asset, onBuy]);

  useEffect(() => {
    (async () => {
      let chainId = await getChainId(getProvider());

      if (chainId == RINKEBY_NETWORK) {
        setIsTestnet(true);
      } else {
        setIsTestnet(false);
      }
    })();
  }, [userAccountAddress, getProvider]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} justify='space-between'>
              <Grid item xs>
                <Link>
                  <Typography variant='body1'>
                    {loading ? <Skeleton /> : asset?.collection?.name}
                  </Typography>
                </Link>
                <Typography
                  style={{fontWeight: 700}}
                  gutterBottom
                  variant='h4'
                  component='h1'>
                  {loading ? <Skeleton /> : <>{asset?.name}</>}
                </Typography>
                {asset && isAssetSingleOwner(asset) ? (
                  <Typography gutterBottom variant='body2'>
                    <IntlMessages id='nfts.detail.ownedBy' />{' '}
                    {isAssetOwner(asset, userAccountAddress || '') ? (
                      <Link
                        component={RouterLink}
                        to={`/nfts/wallet/${getAssetOwnerAddress(asset)}`}>
                        <IntlMessages id='nfts.detail.you' />
                      </Link>
                    ) : (
                      <Link
                        component={RouterLink}
                        to={`/nfts/wallet/${getAssetOwnerAddress(asset)}`}>
                        {getAssetOwnerName(asset)}
                      </Link>
                    )}
                  </Typography>
                ) : null}
              </Grid>
              {!loading ? (
                <Grid item>
                  <Link
                    target='_blank'
                    href={`https://${
                      isTestnet ? 'testnets' : 'www'
                    }.opensea.io/assets/${asset?.asset_contract?.address}/${
                      asset?.token_id
                    }`}>
                    <Grid
                      container
                      spacing={1}
                      alignItems='center'
                      alignContent='center'>
                      <Grid item>
                        <OpenInNewIcon fontSize='inherit' />
                      </Grid>{' '}
                      <Grid item>
                        <IntlMessages id='nfts.detail.openSea' />
                      </Grid>
                    </Grid>
                  </Link>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          {hasListing(asset) &&
          !isAssetOwner(asset, userAccountAddress || '') ? (
            <Grid item xs={12}>
              <Paper variant='outlined'>
                <Box p={4}>
                  <Box mb={2}>
                    <Typography gutterBottom variant='body1'>
                      <IntlMessages id='nfts.detail.currentPrice' />
                    </Typography>
                    <Typography gutterBottom variant='h5'>
                      <Box
                        display='flex'
                        alignItems='center'
                        alignContent='center'>
                        <img
                          src={getFirstOrderTokenImage(asset)}
                          className={classes.tokenImage}
                        />
                        <span>{getFirstOrderPrice(asset)}</span>
                      </Box>
                    </Typography>
                  </Box>
                  <Button
                    disabled={
                      getFirstOrder(asset).listing_time > moment().unix()
                    }
                    onClick={handleBuy}
                    variant='contained'
                    size='large'
                    color='primary'>
                    <IntlMessages id='nfts.detail.buyNow' />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
};
