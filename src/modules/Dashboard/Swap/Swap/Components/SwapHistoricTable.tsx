import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
