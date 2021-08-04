import {
  Dialog,
  DialogContent,
  DialogProps,
  Typography,
  DialogTitle,
  Box,
  Grid,
  IconButton,
  Button,
  Divider,
} from '@material-ui/core';
import React, {useState, useEffect, useCallback} from 'react';
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
    <Dialog fullWidth open={open} maxWidth='lg' onClose={onClose}>
      <DialogTitle>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          alignContent='center'>
          <Typography variant='inherit'>Transactions</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {transactions.length > 0 ? (
          <Box mb={4}>
            <Box display='flex' justifyContent='flex-end' py={4}>
              <Button onClick={handleClear} startIcon={<ClearIcon />}>
                Clear{' '}
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
            <Typography variant='body1'>No transactions yet</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
