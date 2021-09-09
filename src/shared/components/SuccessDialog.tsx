import React from 'react';

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import {SuccessIcon} from './Icons';

interface SuccessDialogProps extends DialogProps {
  icon: React.ReactNode | React.ReactNode[];
  title: string;
  header: string;
  subheader: string;
}

export function SuccessDialog(props: SuccessDialogProps) {
  const {title, icon, header, subheader} = props;

  return (
    <Dialog {...props} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex'>
            <Typography style={{fontWeight: 500}} variant='body1'>
              {icon} {title}
            </Typography>
          </Box>
          <IconButton size='small'>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              py={2}
              display='flex'
              justifyContent='center'
              alignItems='center'>
              <SuccessIcon />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography align='center' variant='h5'>
              {header}
            </Typography>
            <Typography align='center' variant='body1'>
              {subheader}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default SuccessDialog;
