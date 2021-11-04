import React, {useCallback} from 'react';

import {
  Box,
  IconButton,
  Button,
  Typography,
  DialogProps,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  makeStyles,
  Divider,
  CircularProgress,
  Grid,
  useTheme,
} from '@material-ui/core';
import {DollarSquareIcon} from 'shared/components/Icons';
import clsx from 'clsx';

import CloseIcon from '@material-ui/icons/Close';
import {useWeb3} from 'hooks/useWeb3';
import {getNetworkName} from 'shared/constants/Bitquery';

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
              <DollarSquareIcon
                className={clsx(classes.icon, classes.iconSmall)}
              />
            </Box>
            <Typography variant='body1'>Creating token</Typography>
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
              <DollarSquareIcon
                className={clsx(classes.icon, classes.iconLarge)}
              />
            </Box>
            <Typography align='center' variant='h5'>
              Creating Token
            </Typography>
            <Typography align='center' variant='body1'>
              Please, check your token settings
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
              <Typography variant='body1'>Network</Typography>
              <Typography variant='body1'>{getNetworkName(chainId)}</Typography>
            </Box>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>Token name</Typography>
              <Typography variant='body1'>{data.name}</Typography>
            </Box>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>Symbol</Typography>
              <Typography variant='body1'>{data.symbol}</Typography>
            </Box>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography variant='body1'>Total supply</Typography>
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
          Create
        </Button>
        <Button disabled={pending} onClick={handleClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
