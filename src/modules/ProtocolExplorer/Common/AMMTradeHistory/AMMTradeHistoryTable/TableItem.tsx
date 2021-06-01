import React from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {useNetwork} from 'hooks/useNetwork';
import {CremaTheme} from 'types/AppContextPropsType';
import {ETHERSCAN_API_URL} from 'shared/constants/AppConst';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {GET_PROTOCOL_TOKEN_URL} from 'utils/protocol';
import {
  Box,
  TableCell,
  TableRow,
  Chip,
  Link,
  Avatar,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { GetContractOrders_ethereum_dexTrades } from 'services/graphql/bitquery/protocol/__generated__/GetContractOrders';
import { useIntl } from 'react-intl';

interface Props {
  row: GetContractOrders_ethereum_dexTrades;
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  tableCell: {
    fontSize: 16,
    padding: '12px 8px',
    '&:first-child': {
      // [theme.breakpoints.up('xl')]: {
      //   paddingLeft: 4,
      // },
      paddingLeft: 20,
    },
    '&:last-child': {
      // [theme.breakpoints.up('xl')]: {
      //   paddingRight: 4,
      // },
      paddingRight: 20,
    },
    // [theme.breakpoints.up('xl')]: {
    //   fontSize: 18,
    //   padding: 16,
    // },
  },
  anchar: {
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    display: 'inline-block',
  },
  badgeRoot: {
    padding: '3px 10px',
    borderRadius: 4,
    display: 'inline-block',
  },
}));

const TableItem: React.FC<Props> = ({row, networkName, exchange}) => {
  const classes = useStyles();
  const {chainId} = useWeb3();
  const {messages} = useIntl();
  const netName = useNetwork();

  const getPaymentTypeColor = () => {
    switch (row.side) {
      case 'BUY': {
        return '#F84E4E';
      }
      case 'SELL': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  const createdFn = new Date((row.date?.date)||0);

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      <TableCell component='th' scope='row' className={classes.tableCell}>
        <Box>{createdFn.toLocaleDateString()}</Box>
        <Box>{createdFn.toLocaleTimeString()}</Box>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={row.side === 'SELL' ? 'BUY' : 'SELL'}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${((row.baseAmountInUsd || 1) / (row.baseAmount || 1)).toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.baseAmount?.toFixed(4)}{' '}
        <Link
          href={GET_PROTOCOL_TOKEN_URL(networkName, row.baseCurrency?.address, exchange)}>{row.baseCurrency?.symbol}</Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.quoteAmount?.toFixed(4)}{' '}
        <Link  href={GET_PROTOCOL_TOKEN_URL(networkName, row.quoteCurrency?.address, exchange)}>{row.quoteCurrency?.symbol}</Link>
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${row.tradeAmountIsUsd?.toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Box display='flex' alignItems='center'>
          <Tooltip title={messages['app.viewTx']} placement='top'>
            <a
              href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.transaction?.hash}`}
              target='_blank'>
              {netName == EthereumNetwork.ethereum ? (
                <Avatar
                  style={{
                    color: '#3F51B5',
                    backgroundColor: 'white',
                    width: '20px',
                    height: '20px',
                    marginRight: '5px',
                    marginBottom: '5px',
                  }}
                  src='/images/etherescan.png'></Avatar>
              ) : (
                <Avatar
                  style={{
                    color: '#3F51B5',
                    backgroundColor: 'white',
                    width: '20px',
                    height: '20px',
                    marginRight: '5px',
                    marginBottom: '5px',
                  }}
                  src='/images/bscscan-logo-circle.png'></Avatar>
              )}
            </a>
          </Tooltip>
          <a
            href={`${ETHERSCAN_API_URL(chainId)}/tx/${row.transaction?.hash}`}
            target='_blank'
            rel='noreferrer'>
            <SearchIcon />
          </a>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
