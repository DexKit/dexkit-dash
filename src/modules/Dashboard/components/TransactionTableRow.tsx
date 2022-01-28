import IntlMessages from '@crema/utility/IntlMessages';
import {
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  useTheme,
  Chip,
} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import FileCopy from '@material-ui/icons/FileCopy';
import {useCustomNetworkList} from 'hooks/network';
import {useChainInfo} from 'hooks/useChainInfo';
import React from 'react';
import CopyButton from 'shared/components/CopyButton';
import {GET_CHAIN_ID_NAME_V2} from 'shared/constants/Blockchain';
import {truncateAddress} from 'utils';

export interface Props {
  hash: string;
  date: string;
  status: string;
  chainId: number;
  title: string;
}

export const TransactionTableRow: React.FC<Props> = ({
  title,
  hash,
  date,
  chainId,
  status,
}) => {
  const theme = useTheme();

  const {getScannerUrl} = useChainInfo();

  const {networks} = useCustomNetworkList();

  return (
    <TableRow>
      <TableCell>{title}</TableCell>
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
        <Chip label={GET_CHAIN_ID_NAME_V2(chainId, networks)} />
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
