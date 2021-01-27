import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface TotalBalanceProps {
  open: boolean,
  onClose: () => void
}

const FormDialog: React.FC<TotalBalanceProps> = ({open, onClose}) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Transfer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            variant="outlined"
            label="Adress"
            fullWidth
          />
           <TextField
            autoFocus
            margin="dense"
            id="name"
            variant="outlined"
            label="Value"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => false} color="primary">
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog