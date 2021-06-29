import IntlMessages from '@crema/utility/IntlMessages';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  Button,
  Backdrop,
  CircularProgress,
  makeStyles,
  Paper,
  Box,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useWeb3} from 'hooks/useWeb3';
import {OpenSeaPort} from 'opensea-js';
import {Network, Order, WyvernSchemaName} from 'opensea-js/lib/types';

import React, {useCallback, useEffect, useState} from 'react';
import MakeOfferDialog from './MakeOfferDialog';
import AssetOffersTable from './AssetOffersTable';
import {isAssetOwner} from 'modules/NFTWallet/utils';
import {CheckCircle} from '@material-ui/icons';
import {Alert} from '@material-ui/lab';
import {getOpenSeaPort} from 'utils/opensea';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
  icon: {
    color: theme.palette.success.main,
    fontSize: theme.spacing(24),
  },
}));

interface Props {
  asset?: any;
  offers: any;
  loading?: boolean;
  error?: any;
}

export default (props: Props) => {
  const {offers, asset, loading} = props;
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userAccountAddress = useDefaultAccount();
  const {getProvider} = useWeb3();

  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);

  const classes = useStyles();

  const handleShowDialog = useCallback(() => {
    setShowDialog(true);
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage('');
  }, []);

  const handleClose = useCallback(() => setShowDialog(false), []);

  const handleMakeOfferResult = useCallback(
    async (params: any) => {
      let provider = getProvider();

      const openSeaPort = await getOpenSeaPort(provider);

      if (userAccountAddress) {
        setShowBackdrop(true);

        let orderParams: any = {
          asset: {
            tokenId: asset?.token_id,
            tokenAddress: asset?.asset_contract?.address,
            schemaName: asset?.asset_contract?.schema_name,
          },
          paymentTokenAddress: params.tokenAddress,
          accountAddress: userAccountAddress,
          startAmount: params.amount,
          expirationTime: params.expiration,
        };

        openSeaPort
          .createBuyOrder(orderParams)
          .then((order: Order) => {
            setShowSuccess(true);
            setShowDialog(false);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
          })
          .finally(() => {
            setShowBackdrop(false);
          });
      }
    },
    [asset, userAccountAddress, getProvider],
  );

  const handleAcceptOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        let provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        let order = await openSeaPort.api.getOrder({
          hash: offer.order_hash,
          target: offer.target,
        });

        setShowBackdrop(true);

        openSeaPort
          .fulfillOrder({
            order,
            accountAddress: userAccountAddress,
          })
          .then(() => {
            setShowAcceptSuccess(true);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
          })
          .finally(() => {
            setShowBackdrop(false);
          });
      }
    },
    [userAccountAddress, getProvider],
  );

  const handleCancelOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        let provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        let order = await openSeaPort.api.getOrder({
          hash: offer.order_hash,
          target: offer.target,
        });

        setShowBackdrop(true);

        openSeaPort
          .cancelOrder({
            order,
            accountAddress: userAccountAddress,
          })
          .then(() => {
            setShowCancelSuccess(true);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
          })
          .finally(() => {
            setShowBackdrop(false);
          });
      }
    },
    [userAccountAddress, getProvider],
  );

  const handleCloseSuccess = useCallback(() => setShowSuccess(false), []);
  const handleCloseCancelSuccess = useCallback(
    () => setShowCancelSuccess(false),
    [],
  );
  const handleCloseAcceptSuccess = useCallback(
    () => setShowAcceptSuccess(false),
    [],
  );

  const handleErrorClose = useCallback(() => {
    setErrorMessage('');
  }, []);

  return (
    <>
      <MakeOfferDialog
        asset={asset}
        open={showDialog}
        onClose={handleClose}
        onResult={handleMakeOfferResult}
        error={errorMessage}
        onCloseError={handleCloseError}
      />
      <Backdrop
        className={classes.backdrop}
        open={showBackdrop}
        onClick={handleClose}>
        <Paper>
          <Box p={4}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
              alignContent='center'
              spacing={4}>
              <Grid item xs={12}>
                <Typography variant='h4'>
                  <IntlMessages id='nfts.detail.attention' />
                </Typography>
                <Typography variant='h5'>
                  <IntlMessages id='nfts.detail.pleaseSignTransaction' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CircularProgress color='primary' />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Backdrop>
      <Backdrop
        className={classes.backdrop}
        open={showSuccess}
        onClick={handleCloseSuccess}>
        <Paper>
          <Box p={4}>
            <Grid
              justify='center'
              alignItems='center'
              alignContent='center'
              direction='column'
              container
              spacing={4}>
              <Grid item>
                <CheckCircle className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant='h5'>
                  <IntlMessages id='nfts.detail.offerCreated' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Backdrop>
      <Backdrop
        className={classes.backdrop}
        open={showCancelSuccess}
        onClick={handleCloseCancelSuccess}>
        <Paper>
          <Box p={4}>
            <Grid
              justify='center'
              alignItems='center'
              alignContent='center'
              direction='column'
              container
              spacing={4}>
              <Grid item>
                <CheckCircle className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant='h5'>
                  <IntlMessages id='nfts.detail.offerCanceled' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Backdrop>
      <Backdrop
        className={classes.backdrop}
        open={showAcceptSuccess}
        onClick={handleCloseAcceptSuccess}>
        <Paper>
          <Box p={4}>
            <Grid
              justify='center'
              alignItems='center'
              alignContent='center'
              direction='column'
              container
              spacing={4}>
              <Grid item>
                <CheckCircle className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant='h5'>
                  <IntlMessages id='nfts.detail.offerAccepted' />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Backdrop>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListIcon />{' '}
          <Typography variant='body1'>
            <IntlMessages id='nfts.detail.offersAccordionLabel' />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {errorMessage ? (
              <Grid item xs={12}>
                <Alert onClose={handleErrorClose} severity='error'>
                  {errorMessage}
                </Alert>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <AssetOffersTable
                offers={offers}
                asset={asset}
                onCancel={handleCancelOffer}
                onAccept={handleAcceptOffer}
              />
            </Grid>
            {!isAssetOwner(asset, userAccountAddress || '') ? (
              <Grid item>
                <Button
                  onClick={handleShowDialog}
                  color='primary'
                  variant='outlined'>
                  <IntlMessages id='nfts.detail.offersMakeOffer' />
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
