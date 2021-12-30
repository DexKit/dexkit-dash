import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Box,
  DialogActions,
  Button,
  Grid,
  useTheme,
  CircularProgress,
  Typography,
  DialogTitle,
  makeStyles,
  IconButton,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import CloseIcon from '@material-ui/icons/Close';

import GavelIcon from '@material-ui/icons/Gavel';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import IntlMessages from '@crema/utility/IntlMessages';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  content: {
    margin: 0,
    padding: 0,
  },
}));

interface MintKittygotchiDialogProps {
  dialogProps: DialogProps;
  onConfirm?: () => void;
  loading?: boolean;
}

export const MintKittygotchiDialog = (props: MintKittygotchiDialogProps) => {
  const {dialogProps, loading, onConfirm} = props;
  const {onClose} = dialogProps;

  const {chainId} = useWeb3();

  const classes = useStyles();

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    },
    [onClose],
  );

  const theme = useTheme();

  const {messages} = useIntl();

  return (
    <Dialog {...dialogProps} maxWidth='xs' fullWidth>
      <CustomDialogTitle
        title={messages['app.kittygotchi.minting']}
        icon={<GavelIcon className={classes.icon} />}
        onClose={handleClose}
      />

      <DialogContent dividers className={classes.content}>
        {chainId !== ChainId.Matic && chainId !== ChainId.Mumbai ? (
          <Box p={4}>
            <Alert severity='info'>
              <Typography variant='body2'>
                <IntlMessages id='app.kittygotchi.connectTo' />{' '}
                <strong>Polygon(MATIC)</strong>{' '}
                <IntlMessages id='app.kittygotchi.netToCreateKitty' />
              </Typography>
            </Alert>
          </Box>
        ) : null}
        <Box p={4}>
          {loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages id='app.kittygotchi.minting' />
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  <IntlMessages id='app.kittygotchi.pleaseSign' />
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages id='app.kittygotchi.creatingYour' />
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  <IntlMessages id='app.kittygotchi.willNeed' />{' '}
                  <strong>10 MATIC</strong>{' '}
                  <IntlMessages id='app.kittygotchi.tokensInYourWallet' />
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={
            loading ? (
              <CircularProgress color='inherit' size={theme.spacing(6)} />
            ) : (
              <DoneIcon />
            )
          }
          onClick={onConfirm}
          color='primary'
          variant='contained'
          disabled={loading}>
          <IntlMessages id='app.kittygotchi.confirm' />
        </Button>
        <Button
          disabled={loading}
          onClick={handleClose}
          startIcon={<CancelIcon />}>
          <IntlMessages id='app.kittygotchi.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MintKittygotchiDialog;
