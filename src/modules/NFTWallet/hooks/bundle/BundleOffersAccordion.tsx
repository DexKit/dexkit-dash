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
import MoneyOffIcon from '@material-ui/icons/MoneyOff';

import React, {useCallback, useEffect, useState} from 'react';
import AssetOffersTable from '../../components/detail/AssetOffersTable';
import {isAssetOwner} from 'modules/NFTWallet/utils';

import {Alert} from '@material-ui/lab';
import CancelOfferBackdrop from '../../components/detail/CancelOfferBackdrop';
import MakeOfferBackdrop from '../../components/detail/MakeOfferBackdrop';
import AcceptOfferBackdrop from '../../components/detail/AcceptOfferBackdrop';
import AcceptOfferDialog from '../../components/detail/AcceptOfferDialog';

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
  offer: any;
  loading?: boolean;
  error?: any;
  onMakeOffer: () => void;
  onAccept: (offer: any) => void;
  onCancel: (offer: any) => void;
  onConfirmAccept: () => void;
}

export default (props: Props) => {
  const {
    offers,
    offer,
    asset,
    loading,
    onAccept,
    onCancel,
    onConfirmAccept,
    onMakeOffer,
  } = props;
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
      <CancelOfferBackdrop open={showCancel} />
      <AcceptOfferBackdrop open={showAccept} />
      <MakeOfferBackdrop open={showMakeOffer} />
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
        onAccept={onConfirmAccept}
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
              {loading ? (
                <Box
                  py={8}
                  display='flex'
                  alignContent='center'
                  justifyContent='center'
                  alignItems='center'>
                  <CircularProgress color='primary' />
                </Box>
              ) : (
                <>
                  {offers?.length > 0 ? (
                    <AssetOffersTable
                      offers={offers}
                      asset={asset}
                      onCancel={onCancel}
                      onAccept={onAccept}
                    />
                  ) : (
                    <Box display='block' width='100%' py={4}>
                      <Grid
                        direction='column'
                        container
                        spacing={2}
                        justify='center'
                        alignItems='center'>
                        <Grid item>
                          <MoneyOffIcon color='disabled' />
                        </Grid>
                        <Grid item>
                          <Typography
                            color='textSecondary'
                            align='center'
                            variant='body1'>
                            <IntlMessages id='nfts.detail.noOffersYet' />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </>
              )}
            </Grid>
            {!isAssetOwner(asset, userAccountAddress || '') ? (
              <Grid item>
                <Button
                  onClick={onMakeOffer}
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
