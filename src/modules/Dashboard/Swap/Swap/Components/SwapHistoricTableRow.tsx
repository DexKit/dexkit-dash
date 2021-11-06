import React, {useCallback, useState} from 'react';

import moment from 'moment';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import {ChangellyTransaction} from 'types/changelly';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

interface Props {
  transaction: ChangellyTransaction | null;
  onClick: (transaction: ChangellyTransaction) => void;
  onRemove: (transaction: ChangellyTransaction) => void;
}

export const SwapHistoricTableRow = (props: Props) => {
  const {transaction, onClick, onRemove} = props;
  const [removing, setRemoving] = useState(false);
  const {messages} = useIntl();

  const handleClick = useCallback(() => {
    if (transaction) {
      onClick(transaction);
    }
  }, [onClick, transaction]);

  /* eslint-disable */
  const handleConfirm = useCallback(() => {
    if (transaction) {
      onRemove(transaction);
      setRemoving(false);
    }
  }, [transaction]);

  const handleCancel = useCallback(() => {
    setRemoving(false);
  }, []);

  const handleRemove = useCallback(() => {
    setRemoving(true);
  }, []);

  return (
    <TableRow hover>
      <TableCell>
        <Link style={{cursor: 'pointer'}} onClick={handleClick}>
          {transaction?.id}
        </Link>
      </TableCell>
      <TableCell>
        {transaction?.amountExpectedFrom}{' '}
        {transaction?.currencyFrom.toUpperCase()}
      </TableCell>
      <TableCell>
        {transaction?.amountExpectedTo} {transaction?.currencyTo?.toUpperCase()}
      </TableCell>
      <TableCell>
        {transaction?.createdAt
          ? moment(transaction?.createdAt).format('DD/MM/YYYY HH:mm:ss')
          : ''}
      </TableCell>
      <TableCell>{transaction?.status}</TableCell>
      <TableCell>
        {removing ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography align='center' variant='caption'>
                <IntlMessages id='app.dashboard.pleaseConfirm' />
              </Typography>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={handleConfirm}>
                <DoneIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size='small' onClick={handleCancel}>
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <IconButton size='small' onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};
