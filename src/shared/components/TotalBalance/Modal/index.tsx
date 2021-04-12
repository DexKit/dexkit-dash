import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TransferForm from '../Form'
import { BuySellProps } from 'types/models/Crypto';
import { MyBalance } from 'types/bitquery/myBalance.interface';
export { default as  Receive }  from './Receive';

interface TotalBalanceProps {
  open: boolean;
  balances: MyBalance[];
  onClose: () => void;
  onSend: ($e: React.MouseEvent<HTMLButtonElement, MouseEvent>, buySell: BuySellProps) => Promise<void> | void;
}

const FormDialog: React.FC<TotalBalanceProps> = ({open, balances, onClose, onSend}) => {

  const[buySellData] = React.useState<BuySellProps>({
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
  });
  return (
    <div>
      <Dialog fullWidth maxWidth="xs"  open={open} onClose={onClose} aria-labelledby="form-dialog-title">
          <TransferForm balances={balances} buySell={buySellData} onSend={onSend} />
      </Dialog>
    </div>
  );
}

export default FormDialog;