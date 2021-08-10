import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface TotalBalanceProps {
  open: boolean;
  address?: string;
  value?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

const FormDialog: React.FC<TotalBalanceProps> = (props) => {
  const {open, onClose, onConfirm} = props;
  const [address, setAddress] = useState<string>(props?.address ?? '');
  const [value, setValue] = useState<string>(props?.value ?? '');
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Transfer</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin='dense'
            id='address'
            variant='outlined'
            label='Adress'
            fullWidth
            value={address}
            onChange={($e) => setAddress($e.target.value)}
          />
          <TextField
            autoFocus
            margin='dense'
            id='value'
            variant='outlined'
            label='Value'
            fullWidth
            value={value}
            onChange={($e) => setValue($e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={onConfirm} color='primary'>
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
