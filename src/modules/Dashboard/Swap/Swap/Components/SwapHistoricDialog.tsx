import {
  Dialog,
  DialogContent,
  Typography,
  DialogTitle,
  Box,
  IconButton,
  Button,
  Divider,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import React, {useCallback} from 'react';
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

  /* eslint-disable */
  const handleClear = useCallback(() => {
    clear();
  }, []);

  /* eslint-disable */
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
