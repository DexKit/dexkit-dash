import React, {useCallback, useEffect, useState} from 'react';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Link,
  Breadcrumbs,
  useTheme,
  Hidden,
  IconButton,
  Button,
  Backdrop,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import {useParams} from 'react-router';
import {Link as RouterLink} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import {truncateAddress} from 'utils';

import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {Skeleton, Alert} from '@material-ui/lab';
import {getWindowUrl} from 'utils/browser';
import {useAsset, useAssetEvents, useAssetOrders} from '../hooks/detail';
import HistoricAccordion from '../components/detail/HistoricAccordion';
import ListingAccordion from '../components/detail/ListingAccordion';
import DetailAccordion from '../components/detail/DetailAccordion';
import DescriptionCard from '../components/detail/DescriptionCard';
import OffersAccordion from '../components/detail/OffersAccordion';
import TransferAssetModal from '../components/detail/TransferAssetModal';
import CopyAddressButton from '../components/detail/CopyAddressButton';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Network, OpenSeaPort} from 'opensea-js';
import {useWeb3} from 'hooks/useWeb3';
import {getWeb3Wrapper} from 'services/web3modal';
import DoneIcon from '@material-ui/icons/Done';
import WaitingConfirmationBackdrop from '../components/detail/WaitingConfirmationBackdrop';
import BlockConfirmedBackdrop from '../components/detail/BlockConfirmedBackdrop';
import {isAssetOwner} from '../utils';
import {getOpenSeaPort} from 'utils/opensea';

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

const ORDER_LISTING = 1;
const ORDER_OFFER = 0;

function isOwner(asset: any, address: string) {}

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

  const fetchData = useCallback(() => {
    getAsset(address, token);
  }, [getAsset, address, token]);

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
        let seaport = await getOpenSeaPort(provider);

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
            .finally(() => setWaitingConfirmation(false));
          setBlockConfirmed(true);
        }

        fetchData();
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

  return (
    <>
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
      <Box pt={{xs: 8}}>
        <Box mb={2}>
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
        <Grid container spacing={2}>
          {errorMessage ? (
            <Grid item xs={12}>
              <Alert severity='error' onClose={handleAlertClose}>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Grid container spacing={2}>
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
                  <Hidden smDown>
                    <Grid item xs={12}>
                      <DetailAccordion
                        asset={data}
                        loading={loading}
                        error={error}
                      />
                    </Grid>
                  </Hidden>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <CopyAddressButton
                            copyText={`${getWindowUrl()}/nfts/assets/${
                              data?.asset_contract?.address
                            }/${data?.token_id}`}
                          />
                        </Grid>
                        {isAssetOwner(data, userAccountAddress || '') ? (
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
                        ) : null}
                      </Grid>
                    </Box>
                    <DescriptionCard
                      asset={data}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                  <Hidden smUp>
                    <Grid item xs={12}>
                      <DetailAccordion
                        asset={data}
                        loading={loading}
                        error={error}
                      />
                    </Grid>
                  </Hidden>
                  <Grid item xs={12}>
                    <ListingAccordion
                      listings={data?.orders?.filter(
                        (order: any) => order.side == ORDER_LISTING,
                      )}
                      loading={loading}
                      error={error}
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
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <HistoricAccordion asset={data} loading={loading} error={error} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AssetDetail;
