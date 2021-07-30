import React, {useCallback} from 'react';

import {TableCell, TableRow, Link} from '@material-ui/core';
import {SwapTransaction} from '../../types';
import moment from 'moment';
import {ChangellyTransaction} from 'types/changelly';

interface Props {
  transaction: ChangellyTransaction;
  onClick: (transaction: ChangellyTransaction) => void;
}

export const SwapHistoricTableRow = (props: Props) => {
  const {transaction, onClick} = props;

  const handleClick = useCallback(() => {
    onClick(transaction);
  }, [onClick, transaction]);

  return (
    <TableRow hover>
      <TableCell>
        <Link style={{cursor: 'pointer'}} onClick={handleClick}>
          {transaction.id}
        </Link>
      </TableCell>
      <TableCell>
        {transaction.amountExpectedFrom}{' '}
        {transaction.currencyFrom.toUpperCase()}
      </TableCell>
      <TableCell>
        {transaction.amountExpectedTo} {transaction.currencyTo.toUpperCase()}
      </TableCell>
      <TableCell>
        {transaction.createdAt
          ? moment(transaction.createdAt).format('DD/MM/YYYY HH:mm:ss')
          : ''}
      </TableCell>
      <TableCell>{transaction.status}</TableCell>
    </TableRow>
  );
};
