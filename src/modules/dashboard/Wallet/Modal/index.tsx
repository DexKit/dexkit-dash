import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TransferForm from '../Form'

interface TotalBalanceProps {
  open: boolean,
  onClose: () => void,
}

const FormDialog: React.FC<TotalBalanceProps> = ({open, onClose}) => {
  return (
    <div>
      <Dialog fullWidth maxWidth="xs"  open={open} onClose={onClose} aria-labelledby="form-dialog-title">
          <TransferForm buySell={
            {
              buyData: {
                value: '',
                price: '',
                amount: '',
              },
              sellData: {
              value: '',
              price: '',
              amount: '',
            }
            }
          } />
       
      </Dialog>
    </div>
  );
}

export default FormDialog