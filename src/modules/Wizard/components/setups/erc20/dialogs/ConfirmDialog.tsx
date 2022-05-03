import React, {useCallback} from 'react';

import {
  Box,
  Button,
  Typography,
  DialogProps,
  Dialog,
  DialogContent,
  DialogActions,
  makeStyles,
  Divider,
  CircularProgress,
  Grid,
  useTheme,
} from '@material-ui/core';
import {DollarSquareIcon} from 'shared/components/Icons';
import clsx from 'clsx';

import {useWeb3} from 'hooks/useWeb3';
import {getNetworkName} from 'shared/constants/Bitquery';
import IntlMessages from '@crema/utility/IntlMessages';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& > path': {
      stroke: theme.palette.text.primary,
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
  onConfirm: () => void;
  data: any;
  pending: boolean;
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {onConfirm, onClose, data, pending} = props;

  const {chainId} = useWeb3();

  const classes = useStyles();
  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  return (
    <Dialog {...props} fullWidth maxWidth='xs'>
      <CustomDialogTitle
        icon={
          <DollarSquareIcon className={clsx(classes.icon, classes.iconSmall)} />
        }
        title={<IntlMessages id='app.wizard.creatingToken' />}
        onClose={handleClose}
      />

      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              py={4}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <DollarSquareIcon
                className={clsx(classes.icon, classes.iconLarge)}
              />
            </Box>
            <Typography align='center' variant='h5'>
              <IntlMessages id='app.wizard.creatingToken' />
            </Typography>
            <Typography align='center' variant='body1'>
              <IntlMessages id='app.wizard.pleaseCheckYourToken' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>
                <IntlMessages id='app.wizard.network' />
              </Typography>
              <Typography variant='body1'>{getNetworkName(chainId)}</Typography>
            </Box>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>
                <IntlMessages id='app.wizard.tokenName' />
              </Typography>
              <Typography variant='body1'>{data.name}</Typography>
            </Box>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>
                <IntlMessages id='app.wizard.symbol' />
              </Typography>
              <Typography variant='body1'>{data.symbol}</Typography>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>
                <IntlMessages id='app.wizard.totalSupply' />
              </Typography>
              <Typography variant='body1'>{data.supply}</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={
            pending ? (
              <CircularProgress color='inherit' size={theme.spacing(6)} />
            ) : undefined
          }
          disabled={pending}
          onClick={onConfirm}
          variant='contained'
          color='primary'>
          <IntlMessages id='app.wizard.create' />
        </Button>
        <Button disabled={pending} onClick={handleClose} variant='contained'>
          <IntlMessages id='app.wizard.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
