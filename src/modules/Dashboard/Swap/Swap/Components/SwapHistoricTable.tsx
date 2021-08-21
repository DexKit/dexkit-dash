import {
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ChangellyTransaction} from 'types/changelly';
import {SwapHistoricTableRow} from './SwapHistoricTableRow';

interface Props {
  transactions: ChangellyTransaction[];
  onSelect: (transaction: ChangellyTransaction) => void;
  onRemove: (transaction: ChangellyTransaction) => void;
}

export const SwapHistoricTable = (props: Props) => {
  const {transactions, onSelect, onRemove} = props;

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Send</TableCell>
            <TableCell>Receive</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx: ChangellyTransaction, index: number) => (
            <SwapHistoricTableRow
              onClick={onSelect}
              transaction={tx}
              key={index}
              onRemove={onRemove}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
