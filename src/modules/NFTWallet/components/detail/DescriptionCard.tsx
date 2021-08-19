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
  sortByMinPrice,
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
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TokenIconSpan from './TokenIconSpan';
import CountdownTimer from './CountdownTimer';
import CountdownPrice from './CountdownPrice';
import CountdownPriceUSD from './CountdownPriceUSD';

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
  const {getProvider, chainId} = useWeb3();
  const userAccountAddress = useDefaultAccount();

  const hasListing = useCallback((asset: any) => {
    return (
      asset?.orders?.filter((o: any) => o.side == OrderSide.Sell).length > 0
    );
  }, []);

  const getFirstOrder = useCallback((asset: any) => {
    return asset?.orders
      .filter((o: any) => o.side == OrderSide.Sell)
      .sort(sortByMinPrice)[0];
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

  const getEndingPrice = useCallback(
    (asset: any) => {
      const order = getFirstOrder(asset);

      const basePrice = toTokenUnitAmount(
        order.base_price,
        order.payment_token_contract?.decimals,
      );

      const extra = toTokenUnitAmount(
        order.extra,
        order.payment_token_contract?.decimals,
      );

      return basePrice.minus(extra).toNumber();
    },
    [getFirstOrder],
  );

  const handleBuy = useCallback(() => {
    onBuy(getFirstOrder(asset));
  }, [asset, onBuy]);

  useEffect(() => {
    (async () => {
      const cid = await getChainId(getProvider());

      if (cid == RINKEBY_NETWORK) {
        setIsTestnet(true);
      } else {
        setIsTestnet(false);
      }
    })();
  }, [userAccountAddress, getProvider, chainId]);

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
                      isTestnet ? 'testnets.' : ''
                    }opensea.io/assets/${asset?.asset_contract?.address}/${
                      asset?.token_id
                    }?ref=0x2d2193f337a4e446c14caa5c90e7b5849203acd0`}>
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
            <>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box p={4}>
                    <Grid
                      container
                      alignItems='center'
                      alignContent='center'
                      spacing={2}>
                      <Grid item>
                        <AccessTimeIcon />
                      </Grid>
                      <Grid item>
                        <Typography variant='body1'>
                          <IntlMessages id='nfts.detail.saleEndsIn' />{' '}
                          <strong>
                            <CountdownTimer
                              dateTime={moment(
                                getFirstOrder(asset).closing_date,
                              ).utc(true)}
                            />
                          </strong>{' '}
                          <IntlMessages id='nfts.detail.at' />{' '}
                          <TokenIconSpan
                            imageUrl={
                              getFirstOrder(asset).payment_token_contract
                                ?.image_url
                            }
                            symbol={
                              getFirstOrder(asset).payment_token_contract
                                ?.symbol
                            }
                          />{' '}
                          {getEndingPrice(asset)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined'>
                  <Box p={4}>
                    <Box mb={2}>
                      <Typography gutterBottom variant='body1'>
                        <IntlMessages id='nfts.detail.currentPrice' />
                      </Typography>
                      <Grid
                        container
                        alignItems='center'
                        alignContent='center'
                        spacing={2}>
                        <Grid item>
                          <Typography gutterBottom variant='h5'>
                            <Box
                              display='flex'
                              alignItems='center'
                              alignContent='center'>
                              <img
                                src={getFirstOrderTokenImage(asset)}
                                className={classes.tokenImage}
                              />
                              <CountdownPrice
                                price={toTokenUnitAmount(
                                  getFirstOrder(asset).base_price,
                                  getFirstOrder(asset).payment_token_contract
                                    ?.decimals,
                                ).toNumber()}
                                endingDate={moment.utc(
                                  getFirstOrder(asset).closing_date,
                                )}
                                createdDate={moment.utc(
                                  getFirstOrder(asset).created_date,
                                )}
                                endingPrice={getEndingPrice(asset)}
                                active={
                                  !getFirstOrder(asset).closing_extendable &&
                                  getFirstOrder(asset).closing_date
                                }
                              />
                            </Box>
                          </Typography>
                        </Grid>
                      </Grid>
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
            </>
          ) : null}
        </Grid>
      </CardContent>
    </Card>
  );
};
