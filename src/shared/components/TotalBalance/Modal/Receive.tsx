import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Form from '../ReceiveForm'

interface TotalBalanceProps {
  open: boolean,
  onClose: () => void,
}

const Receive: React.FC<TotalBalanceProps> = ({open, onClose}) => {
  return (
    <div>
      <Dialog fullWidth maxWidth="xs"  open={open} onClose={onClose} aria-labelledby="form-dialog-title">
          <Form buySell={
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

export default Receive