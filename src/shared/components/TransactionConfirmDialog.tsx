import {
  DialogProps,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import React from 'react';

interface TransactionConfirmDialogProps extends DialogProps {}

export const TransactionConfirmDialog: React.FC<TransactionConfirmDialogProps> =
  (props) => {
    return (
      <Dialog {...props}>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button>Confirm</Button>
          <Button>Reject</Button>
        </DialogActions>
      </Dialog>
    );
  };
