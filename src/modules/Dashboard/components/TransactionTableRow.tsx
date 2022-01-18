import IntlMessages from '@crema/utility/IntlMessages';
import {
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import FileCopy from '@material-ui/icons/FileCopy';
import {useChainInfo} from 'hooks/useChainInfo';
import React from 'react';
import CopyButton from 'shared/components/CopyButton';
import {truncateAddress} from 'utils';

export interface Props {
  hash: string;
  date: string;
  status: string;
  chainId: number;
}

export const TransactionTableRow: React.FC<Props> = ({
  hash,
  date,
  chainId,
  status,
}) => {
  const theme = useTheme();

  const {getScannerUrl} = useChainInfo();

  return (
    <TableRow>
      <TableCell>
        {truncateAddress(hash)}{' '}
        <CopyButton size='small' copyText={hash || ''} tooltip='Copied!'>
          <FileCopy color='inherit' style={{fontSize: 16}} />
        </CopyButton>
      </TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>
        {status === 'done' ? (
          <CheckCircle style={{color: theme.palette.success.main}} />
        ) : status === 'failed' ? (
          <Error style={{color: theme.palette.error.main}} />
        ) : (
          <CircularProgress color='primary' />
        )}
      </TableCell>
      <TableCell>
        <Link
          href={chainId ? `${getScannerUrl(chainId)}/tx/${hash}` : ''}
          target='_blank'
          rel='noopener noreferrer'>
          <IntlMessages id='app.wallet.viewTransaction' />
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default TransactionTableRow;
