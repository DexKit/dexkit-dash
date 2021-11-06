import {
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@material-ui/core';
import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
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
            <TableCell>
              <IntlMessages id='app.dashboard.send' />
            </TableCell>
            <TableCell>
              <IntlMessages id='app.dashboard.receive' />
            </TableCell>
            <TableCell>
              <IntlMessages id='app.dashboard.created' />
            </TableCell>
            <TableCell>
              <IntlMessages id='app.dashboard.status' />
            </TableCell>
            <TableCell />
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
