import React, {useCallback} from 'react';

import {
  Box,
  IconButton,
  Button,
  Typography,
  DialogProps,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  Grid,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';

import CloseIcon from '@material-ui/icons/Close';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& > path': {
      stroke: '#fff',
    },
  },
  iconLarge: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  iconSmall: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface ConfirmDialogProps extends DialogProps {
  transactionHash?: string;
}

export const CreatedDialog = (props: ConfirmDialogProps) => {
  const {onClose, transactionHash} = props;

  const {chainId} = useWeb3();
  const classes = useStyles();

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash]);

  return (
    <Dialog {...props} fullWidth maxWidth='xs'>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              mr={2}
              display='flex'
              alignItems='center'
              alignContent='center'>
              <CheckCircleOutlineIcon className={clsx(classes.icon)} />
            </Box>
            <Typography variant='body1'><IntlMessages id='app.wizard.transactionCreated' /></Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              py={4}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <CheckCircleOutlineIcon
                style={{color: theme.palette.success.main}}
                className={clsx(classes.iconLarge)}
              />
            </Box>
            <Box mb={2}>
              <Typography align='center' variant='h5'>
              <IntlMessages id='app.wizard.transactionCreated' />
              </Typography>
              <Typography align='center' variant='body1'>
              <IntlMessages id='app.wizard.pleaseViewTheTransaction' />
              </Typography>
            </Box>
            <Button onClick={handleViewTransaction} color='primary' fullWidth>
              <IntlMessages id='app.wizard.viewTransaction' />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CreatedDialog;
