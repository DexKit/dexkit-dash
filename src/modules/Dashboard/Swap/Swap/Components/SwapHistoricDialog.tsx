import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {SwapHistoricTable} from './SwapHistoricTable';
import CloseIcon from '@material-ui/icons/Close';
import {ChangellyTransaction} from 'types/changelly';
import ClearIcon from '@material-ui/icons/Clear';
import {useSwapTransactions} from '../../hooks';

interface Props {
  transactions: ChangellyTransaction[];
  onSelectTransaction: (tx: ChangellyTransaction) => void;
  onClose: () => void;
  open: boolean;
}

export const SwapHistoricDialog = (props: Props) => {
  const {open, transactions, onClose, onSelectTransaction} = props;
  const {clear, remove} = useSwapTransactions();

  const handleClear = useCallback(() => {
    clear();
  }, []);

  const handleRemove = useCallback((transaction: ChangellyTransaction) => {
    remove(transaction.id);
  }, []);

  return (
    <Dialog fullWidth open={open} maxWidth='md' onClose={onClose}>
      <DialogTitle>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          alignContent='center'>
          <Typography variant='inherit'>
            <IntlMessages id='app.dashboard.transactions' />
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        {transactions.length > 0 ? (
          <Box mb={4}>
            <Box display='flex' justifyContent='flex-end' py={4}>
              <Button onClick={handleClear} startIcon={<ClearIcon />}>
                <IntlMessages id='app.dashboard.clear' />
              </Button>
            </Box>
            <SwapHistoricTable
              transactions={transactions}
              onSelect={onSelectTransaction}
              onRemove={handleRemove}
            />
          </Box>
        ) : (
          <Box display='flex' justifyContent='center' py={8}>
            <Typography variant='body1'>
              <IntlMessages id='app.dashboard.noTransactionsYet' />
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
