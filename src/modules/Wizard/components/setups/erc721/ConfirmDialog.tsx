import React, {useCallback} from 'react';

import {
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogProps,
  Button,
  useTheme,
  DialogContent,
  Box,
} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';

export interface ConfirmDialogProps extends DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default (props: ConfirmDialogProps) => {
  const {onConfirm, onCancel} = props;

  const theme = useTheme();

  return (
    <Dialog {...props}>
      <DialogTitle>
        <Typography variant='body1'>Creating collection</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid xs={12} item>
            <Box display='flex' justifyContent='center'>
              <InfoIcon style={{fontSize: theme.spacing(16)}} />
            </Box>
          </Grid>
          <Grid xs={12} item>
            <Typography variant='h5' align='center'>
              Creating collection
            </Typography>
            <Typography color='textSecondary' variant='body1' align='center'>
              Do you really want to create a collection?
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={onConfirm}>
          Confirm
        </Button>
        <Button variant='contained' onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
