import React, {useCallback, useEffect, useState} from 'react';

import {
  Box,
  Card,
  CardMedia,
  Grid,
  makeStyles,
  Link,
  Breadcrumbs,
  useTheme,
  Button,
  Typography,
} from '@material-ui/core';
import {useHistory, useParams} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';

import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {Skeleton, Alert} from '@material-ui/lab';
import {getWindowUrl} from 'utils/browser';
import {useAsset} from '../../hooks/detail';
import HistoricAccordion from '../../components/detail/HistoricAccordion';
import ListingAccordion from '../../components/detail/ListingAccordion';
import DetailAccordion from '../../components/detail/DetailAccordion';
import DescriptionCard from '../../components/detail/DescriptionCard';
import OffersAccordion from '../../components/detail/OffersAccordion';
import TransferAssetModal from '../../components/detail/TransferAssetModal';
import CopyAddressButton from '../../components/detail/CopyAddressButton';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import {getWeb3Wrapper} from 'services/web3modal';
import WaitingConfirmationBackdrop from '../../components/detail/WaitingConfirmationBackdrop';
import BlockConfirmedBackdrop from '../../components/detail/BlockConfirmedBackdrop';
import {isAssetOwner} from '../../utils';
import {getOpenSeaPort} from 'utils/opensea';
import {AttachMoney, Error as ErrorIcon} from '@material-ui/icons';
import CancellingListingBackdrop from 'modules/NFTWallet/components/detail/CancellingListingBackdrop';
import BuyCheckoutDialog from 'modules/NFTWallet/components/detail/BuyCheckoutDialog';
import BuyingListingBackdrop from 'modules/NFTWallet/components/detail/BuyingListingBackdrop';
import BuySuccessBackdrop from 'modules/NFTWallet/components/detail/BuySuccessBackdrop';
import {AxiosResponse} from 'axios';
import NotFound from 'modules/NFTWallet/components/detail/NotFound';

import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-01.svg';

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

interface RouteParams {
  address: string;
  token: string;
}

// TODO: refactor this to OpenSea api enum
const ORDER_LISTING = 1;
const ORDER_OFFER = 0;

export const AssetDetail = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {address, token}: RouteParams = useParams();

  const {getProvider} = useWeb3();

  const userAccountAddress = useDefaultAccount();

  const {getAsset, loading, data, error} = useAsset();

  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);
  const [blockConfirmed, setBlockConfirmed] = useState(false);
  const [transaction, setTransaction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCancellingListing, setIsCancellingListing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyOrder, setBuyOrder] = useState<any>();
  const [buyTransaction, setBuyTransaction] = useState('');

  const [showCancellingSuccess, setShowCancellingSuccess] = useState(false);
  const [showBuyingSuccess, setShowBuyingSuccess] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const fetchData = useCallback(() => {
    getAsset(address, token);
  }, [getAsset, address, token]);

  const history = useHistory();

  useEffect(() => {
    if (!userAccountAddress) {
      history.replace('/connect-wallet');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseTransferDialog = useCallback(() => {
    setShowTransferDialog(false);
  }, []);

  const handleShowTransferDialog = useCallback(() => {
    setShowTransferDialog(true);
  }, []);

  const handleTransferNFT = useCallback(
    async (asset: any, to: string) => {
      const web3Wrapper = getWeb3Wrapper();

      if (userAccountAddress) {
        const provider = getProvider();
        const seaport = await getOpenSeaPort(provider);

        setWaitingConfirmation(true);

        const transactionHash = await seaport
          .transfer({
            asset: {
              tokenId: data?.token_id,
              tokenAddress: data?.asset_contract?.address,
              schemaName: data?.asset_contract?.schema_name,
            },
            fromAddress: userAccountAddress, // Must own the asset
            toAddress: to,
          })
          .catch((reason: any) => {
            setWaitingConfirmation(false);
            setErrorMessage(reason.message);
          });

        setShowTransferDialog(false);

        if (transactionHash) {
          setTransaction(transactionHash);
          const log = await web3Wrapper
            ?.awaitTransactionSuccessAsync(transactionHash)
            .catch((reason: any) => {
              setErrorMessage(reason.message);
            })
            .finally(() => {
              setWaitingConfirmation(false);
              fetchData();
            });
          setBlockConfirmed(true);
        }
      }
    },
    [data, userAccountAddress, getProvider, fetchData],
  );

  const handleBlockConfirmedClose = useCallback(
    () => setBlockConfirmed(false),
    [],
  );

  const handleAlertClose = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleTryAgain = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelListing = useCallback(
    async (listing: any) => {
      if (userAccountAddress) {
        const provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        const {orders} = await openSeaPort.api.getOrders({
          token_id: data?.token_id,
          asset_contract_address: data?.asset_contract?.address,
        });

        const orderIndex = orders.findIndex(
          (order) =>
            order.hash.toLowerCase() === listing.order_hash.toLowerCase(),
        );

        if (orderIndex > -1) {
          const order = orders[orderIndex];

          setIsCancellingListing(true);

          openSeaPort
            .cancelOrder({order, accountAddress: userAccountAddress})
            .then(() => {
              setShowCancellingSuccess(true);
            })
            .catch((reason: any) => {
              setErrorMessage(reason.message);
            })
            .finally(() => {
              setIsCancellingListing(false);
              fetchData();
            });
        }
      }
    },
    [data, getProvider, fetchData, userAccountAddress],
  );

  const handleBuyListing = useCallback((listing: any) => {
    setBuyOrder(listing);
    setShowCheckout(true);
  }, []);

  const handleCloseCheckout = useCallback(() => {
    setShowCheckout(false);
    setBuyOrder(null);
  }, []);

  const handleConfirmBuy = useCallback(async () => {
    if (userAccountAddress) {
      const provider = getProvider();
      const openSeaPort = await getOpenSeaPort(provider);

      const {orders} = await openSeaPort.api.getOrders({
        token_id: data?.token_id,
        asset_contract_address: data?.asset_contract?.address,
      });

      const orderIndex = orders.findIndex(
        (order) => order.hash == buyOrder.order_hash,
      );

      if (orderIndex > -1) {
        const order = orders[orderIndex];

        setIsBuying(true);

        openSeaPort
          .fulfillOrder({
            order,
            accountAddress: userAccountAddress,
            referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
          })
          .then((hash: string) => {
            setShowBuyingSuccess(true);
            setShowCheckout(false);
            setBuyOrder(null);
            setBuyTransaction(hash);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
            setShowCheckout(false);
            setBuyOrder(null);
          })
          .finally(() => {
            setIsBuying(false);
            fetchData();
          });
      }
    }
  }, [data, getProvider, fetchData, buyOrder, userAccountAddress]);

  const handleCloseBuySuccess = useCallback(() => {
    setShowBuyingSuccess(false);
    setBuyTransaction('');
  }, []);

  const isHttpStatus = useCallback(
    (response: AxiosResponse, status: number) => {
      return response.status == status;
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <CancellingListingBackdrop open={isCancellingListing} />
      <BuyCheckoutDialog
        onConfirm={handleConfirmBuy}
        open={showCheckout}
        onClose={handleCloseCheckout}
        asset={data}
        order={buyOrder}
        loading={isBuying}
      />
      <BuySuccessBackdrop
        transaction={buyTransaction}
        open={showBuyingSuccess}
        onClose={handleCloseBuySuccess}
      />
      <TransferAssetModal
        asset={data}
        open={showTransferDialog}
        onClose={handleCloseTransferDialog}
        onTransfer={handleTransferNFT}
      />
      <WaitingConfirmationBackdrop open={waitingConfirmation} />
      <BlockConfirmedBackdrop
        open={blockConfirmed}
        transaction={transaction}
        onClose={handleBlockConfirmedClose}
      />
      {error ? (
        isHttpStatus((error as any).response, 404) ? (
          <NotFound />
        ) : (
          <Box py={8}>
            <Grid
              container
              justify='center'
              alignItems='center'
              alignContent='center'
              spacing={4}>
              <Grid item>
                <ConnectivityImage />
              </Grid>
              <Grid item>
                <Grid
                  direction='column'
                  container
                  alignItems='center'
                  alignContent='center'
                  spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant='h5'>
                      <IntlMessages id='nfts.walletAssetsListErrorTitle' />
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={handleTryAgain}
                      size='small'
                      color='primary'>
                      <IntlMessages id='nfts.walletAssetsListErrorTryAgain' />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )
      ) : (
        <Box pt={{xs: 8}}>
          <Box mb={4}>
            <Breadcrumbs>
              <Link color='inherit' component={RouterLink} to='/'>
                <IntlMessages id='nfts.walletBreadcrumbDashboard' />
              </Link>
              <Link color='inherit'>
                <IntlMessages id='nfts.walletBreadcrumbAssets' />
              </Link>
              <Link color='inherit'>
                {loading ? (
                  <Skeleton width={theme.spacing(40)} />
                ) : (
                  data?.collection?.name || ''
                )}
              </Link>
              <Link
                component={RouterLink}
                color='inherit'
                to={`/nfts/assets/${address}/${token}`}>
                {loading ? <Skeleton width={theme.spacing(70)} /> : data?.name}
              </Link>
            </Breadcrumbs>
          </Box>
          <Grid container spacing={4}>
            {errorMessage ? (
              <Grid item xs={12}>
                <Alert severity='error' onClose={handleAlertClose}>
                  {errorMessage}
                </Alert>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Card>
                        {loading ? (
                          <Skeleton
                            className={classes.assetImage}
                            height='100%'
                          />
                        ) : null}
                        <CardMedia>
                          <img
                            style={{
                              backgroundColor: `#${
                                data?.background_color
                                  ? data?.background_color
                                  : 'fff'
                              }`,
                            }}
                            src={data?.image_url}
                            className={classes.assetImage}
                          />
                        </CardMedia>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Box mb={2}>
                        <Grid container spacing={4}>
                          {loading ? null : (
                            <Grid item>
                              <CopyAddressButton
                                copyText={`${getWindowUrl()}/nfts/assets/${
                                  data?.asset_contract?.address
                                }/${data?.token_id}`}
                              />
                            </Grid>
                          )}
                          {isAssetOwner(data, userAccountAddress || '') ? (
                            <>
                              <Grid item>
                                <Button
                                  onClick={handleShowTransferDialog}
                                  variant='outlined'
                                  size='small'
                                  startIcon={<SwapHorizIcon />}
                                  color='primary'>
                                  <IntlMessages id='nfts.detail.transfer' />
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  component={RouterLink}
                                  variant='outlined'
                                  size='small'
                                  startIcon={<AttachMoney />}
                                  to={`/nfts/assets/${data?.asset_contract?.address}/${data?.token_id}/sell`}
                                  color='primary'>
                                  Sell
                                </Button>
                              </Grid>
                            </>
                          ) : null}
                        </Grid>
                      </Box>
                      <DescriptionCard
                        asset={data}
                        loading={loading}
                        error={error}
                        onBuy={handleBuyListing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DetailAccordion
                        asset={data}
                        loading={loading}
                        error={error}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ListingAccordion
                        listings={data?.orders?.filter(
                          (order: any) => order.side == ORDER_LISTING,
                        )}
                        loading={loading}
                        error={error}
                        onCancel={handleCancelListing}
                        onBuy={handleBuyListing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <OffersAccordion
                        asset={data}
                        offers={data?.orders?.filter(
                          (order: any) => order.side == ORDER_OFFER,
                        )}
                        loading={loading}
                        error={error}
                        onRefresh={handleRefresh}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {data ? (
              <Grid item xs={12} sm={12}>
                <HistoricAccordion
                  asset={data}
                  loading={loading}
                  error={error}
                />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default AssetDetail;
