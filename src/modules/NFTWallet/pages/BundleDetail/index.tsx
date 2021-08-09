import React, {useState, useEffect, useCallback} from 'react';

import {
  Box,
  Grid,
  Card,
  Typography,
  CardMedia,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import {Alert, Skeleton} from '@material-ui/lab';
import {useBundle} from 'modules/NFTWallet/hooks/bundle';
import {useParams} from 'react-router';
import GalleryItem from 'modules/NFTWallet/hooks/bundle/gallery/GalleryItem';
import {Asset, Order, OrderSide} from 'opensea-js/lib/types';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import OffersAccordion from 'modules/NFTWallet/hooks/bundle/BundleOffersAccordion';
import ListingAccordion from 'modules/NFTWallet/hooks/bundle/BundleListingAccordion';
import {useWeb3} from 'hooks/useWeb3';
import BundleMakeOfferDialog from 'modules/NFTWallet/hooks/bundle/BundleMakeOfferDialog';
import {getOpenSeaPort} from 'utils/opensea';

const useStyles = makeStyles((theme) => ({
  assetImage: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  galleryList: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    overflowX: 'scroll',
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
}));

interface RouteParams {
  slug: string;
}

export default () => {
  const classes = useStyles();

  const {slug}: RouteParams = useParams();
  const {getProvider} = useWeb3();
  const userAccountAddress = useDefaultAccount();

  const {getBundle, loading, error, data} = useBundle();

  const fetchData = useCallback(() => {}, [getBundle, slug]);

  const [imageIndex, setImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [offer, setOffer] = useState<any>();

  const [listingOrder, setListingOrder] = useState<any>();
  const [showCheckout, setShowCheckout] = useState(false);

  const [showSucces, setShowSuccess] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  const [showMakeOffer, setShowMakeOffer] = useState(false);

  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const handleAlertClose = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleChangeImage = useCallback((index: number) => {
    setImageIndex(index);
  }, []);

  const handleCancelListing = useCallback((listing: any) => {}, []);

  const handleBuyListing = useCallback((listing: any) => {
    setListingOrder(listing);
    setShowCheckout(true);
  }, []);

  const handleCloseCheckout = useCallback(() => {
    setShowCheckout(false);
    setListingOrder(null);
  }, []);

  const handleConfirmBuy = useCallback(async () => {
    if (userAccountAddress) {
      const provider = getProvider();
      const openSeaPort = await getOpenSeaPort(provider);

      const {orders} = await openSeaPort.api.getOrders({
        asset_contract_address: data?.asset_contract?.address,
        token_ids: data?.token_id,
      });

      const orderIndex = orders.findIndex(
        (order) => order.hash.toLowerCase() === listingOrder.order_hash,
      );

      if (orderIndex > -1) {
        const order = orders[orderIndex];

        // setIsBuying(true);

        openSeaPort
          .fulfillOrder({
            order,
            accountAddress: userAccountAddress,
            referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
          })
          .then((hash: string) => {
            // setShowBuyingSuccess(true);
            // setShowCheckout(false);
            // setBuyOrder(null);
            // setBuyTransaction(hash);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
            setShowCheckout(false);
            setListingOrder(null);
          })
          .finally(() => {
            // setIsBuying(false);
            fetchData();
          });
      }
    }
  }, [data, getProvider, fetchData, listingOrder, userAccountAddress]);

  const handleAcceptOffer = useCallback(
    (offer: any) => {
      setOffer(offer);
      setShowAcceptDialog(true);
    },
    [setOffer],
  );

  const acceptOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        const provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        const {orders} = await openSeaPort.api.getOrders({});

        // lowercase
        const orderIndex = orders.findIndex((o) => o.hash === offer.order_hash);

        if (orderIndex > -1) {
          const order = orders[orderIndex];

          setShowAccept(true);

          openSeaPort
            .fulfillOrder({
              order,
              accountAddress: userAccountAddress,
              referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
            })
            .then(() => {
              setShowAcceptSuccess(true);
              setOffer(null);
              setShowAcceptDialog(false);
            })
            .catch((reason) => {
              setErrorMessage(reason.message);
            })
            .finally(() => {
              setShowAccept(false);
            });
        }
      }
    },
    [userAccountAddress, getProvider],
  );

  const handleConfirmAcceptOffer = useCallback(() => {
    acceptOffer(offer);
  }, [offer]);

  const handleMakeOfferClose = useCallback(() => {
    setShowMakeOffer(false);
  }, []);

  const handleCancelOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        setShowCancel(true);

        const openSeaPort = await getOpenSeaPort(getProvider());

        const {orders} = await openSeaPort.api.getOrders({
          asset_contract_address: data?.asset_contract?.address,
          token_ids: data?.assets?.map((a: any) => a.token_id),
        });

        const orderIndex = orders.findIndex((o) => o.hash === offer.order_hash);

        if (orderIndex > -1) {
          openSeaPort
            .cancelOrder({
              order: orders[orderIndex],
              accountAddress: userAccountAddress,
            })
            .then(() => {
              setShowCancelSuccess(true);
            })
            .catch((reason) => {
              setErrorMessage(reason.message);
            })
            .finally(() => {
              setShowCancel(false);
            });
        }
      }
    },
    [data, userAccountAddress, getProvider],
  );

  const handleMakeOffer = useCallback(() => {
    setShowMakeOffer(true);
  }, []);

  const handleMakeOfferResult = useCallback(
    async (params: any) => {
      const provider = getProvider();

      const openSeaPort = await getOpenSeaPort(provider);

      if (userAccountAddress) {
        setShowMakeOffer(true);

        console.log(data);

        openSeaPort
          .createBundleBuyOrder({
            paymentTokenAddress: params.tokenAddress,
            accountAddress: userAccountAddress,
            startAmount: params.amount,
            expirationTime: params.expiration,
            referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
            assets: data?.assets?.map((asset: any) => ({
              tokenAddress: asset?.asset_contract?.address,
              tokenId: asset?.token_id,
              schemaName: asset?.asset_contract?.schema_name,
            })),
          })
          .then((order: Order) => {
            setShowSuccess(true);
            setShowMakeOffer(false);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
          })
          .finally(() => {
            setShowMakeOffer(false);
          });
      }
    },
    [data, userAccountAddress, getProvider],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <BundleMakeOfferDialog
        open={showMakeOffer}
        onClose={handleMakeOfferClose}
        onResult={handleMakeOfferResult}
        error={errorMessage}
      />
      <Box py={{xs: 8}}>
        <Grid container spacing={2}>
          {errorMessage != '' ? (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleAlertClose}>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={12} sm={4}>
            <Card>
              {loading ? (
                <Skeleton className={classes.assetImage} height='100%' />
              ) : null}
              <CardMedia>
                <img
                  style={{
                    backgroundColor: `#${
                      data?.background_color ? data?.background_color : 'fff'
                    }`,
                  }}
                  src={data?.assets[imageIndex].image_url}
                  className={classes.assetImage}
                />
              </CardMedia>
              <Box className={classes.galleryList}>
                {data?.assets.map((asset: any, index: number) => (
                  <GalleryItem
                    asset={asset}
                    index={index}
                    key={index}
                    onClick={handleChangeImage}
                  />
                ))}
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      style={{fontWeight: 700}}
                      gutterBottom
                      variant='h4'
                      component='h1'>
                      {loading ? <Skeleton /> : data?.name}
                    </Typography>
                    <Typography variant='body1'>
                      {loading ? <Skeleton /> : data?.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <ListingAccordion
                  listings={data?.orders?.filter(
                    (order: any) => order.side == OrderSide.Sell,
                  )}
                  loading={loading}
                  onCancel={handleCancelListing}
                  onBuy={handleBuyListing}
                />
              </Grid>
              <Grid item xs={12}>
                <OffersAccordion
                  offers={data?.orders?.filter(
                    (order: any) => order.side == OrderSide.Buy,
                  )}
                  offer={offer}
                  loading={loading}
                  onCancel={handleCancelOffer}
                  onAccept={handleAcceptOffer}
                  onConfirmAccept={handleConfirmAcceptOffer}
                  onMakeOffer={handleMakeOffer}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
