import React from 'react';
import ReceiverForm from './ReceiverForm';
import {Dialog, DialogTitle, DialogContent} from '@material-ui/core';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Receiver: React.FC<Props> = (props) => {
  return (
    <Dialog fullWidth maxWidth='xs' open={props.open} onClose={props.onClose}>
      <DialogTitle>Receive</DialogTitle>
      <DialogContent dividers>
        <ReceiverForm />
      </DialogContent>
    </Dialog>
  );
};

export default Receiver;
