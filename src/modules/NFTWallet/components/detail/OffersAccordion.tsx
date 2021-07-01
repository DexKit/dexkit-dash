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
  Snackbar,
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

import {Alert} from '@material-ui/lab';
import {getOpenSeaPort} from 'utils/opensea';
import CancelOfferBackdrop from './CancelOfferBackdrop';
import MakeOfferBackdrop from './MakeOfferBackdrop';
import AcceptOfferBackdrop from './AcceptOfferBackdrop';
import AcceptOfferDialog from './AcceptOfferDialog';

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

  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

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
        setShowMakeOffer(true);

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
          referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
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
            setShowMakeOffer(false);
          });
      }
    },
    [asset, userAccountAddress, getProvider],
  );

  const acceptOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        let provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        let order = await openSeaPort.api.getOrder({
          hash: offer.order_hash,
        });

        setShowAccept(true);

        openSeaPort
          .fulfillOrder({
            order,
            accountAddress: userAccountAddress,
            referrerAddress: process.env.REACT_APP_OPENSEA_AFFILIATE,
          })
          .then(() => {
            setShowAcceptSuccess(true);
          })
          .catch((reason) => {
            setErrorMessage(reason.message);
          })
          .finally(() => {
            setShowAccept(false);
          });
      }
    },
    [userAccountAddress, getProvider],
  );

  const [offer, setOffer] = useState<any>();

  const handleAcceptOffer = useCallback(
    (offer: any) => {
      console.log(offer);
      setOffer(offer);
      setShowAcceptDialog(true);
    },
    [setOffer],
  );

  const handleConfirmAcceptOffer = useCallback(() => {
    acceptOffer(offer);
  }, [offer]);

  const handleCancelOffer = useCallback(
    async (offer: any) => {
      if (userAccountAddress) {
        let provider = getProvider();

        const openSeaPort = await getOpenSeaPort(provider);

        let order = await openSeaPort.api.getOrder({
          hash: offer.order_hash,
          target: offer.target,
        });

        setShowCancel(true);

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
            setShowCancel(false);
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

  const handleCloseCancel = useCallback(() => {
    setShowCancel(false);
  }, []);

  const handleCloseAccept = useCallback(() => {
    setShowAccept(false);
  }, []);

  const handleCloseMakeOffer = useCallback(() => {
    setShowMakeOffer(false);
  }, []);

  const handleCloseAcceptDialog = useCallback(() => {
    setShowAcceptDialog(false);
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
      <CancelOfferBackdrop open={showCancel} onClick={handleCloseCancel} />
      <AcceptOfferBackdrop open={showAccept} onClick={handleCloseAccept} />
      <MakeOfferBackdrop open={showMakeOffer} onClick={handleCloseMakeOffer} />
      <Snackbar
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity='success'>
          <IntlMessages id='nfts.detail.snackbar.offerSubmitted' />
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        open={showCancelSuccess}
        autoHideDuration={6000}
        onClose={handleCloseCancelSuccess}>
        <Alert onClose={handleCloseCancelSuccess} severity='success'>
          <IntlMessages id='nfts.detail.snackbar.offerCanceled' />
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        open={showAcceptSuccess}
        autoHideDuration={6000}
        onClose={handleCloseAcceptSuccess}>
        <Alert onClose={handleCloseAcceptSuccess} severity='success'>
          <IntlMessages id='nfts.detail.snackbar.offerAccepted' />
        </Alert>
      </Snackbar>
      <AcceptOfferDialog
        open={showAcceptDialog}
        onClose={handleCloseAcceptDialog}
        onAccept={handleConfirmAcceptOffer}
        asset={asset}
        offer={offer}
      />
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
