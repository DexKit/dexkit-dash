import React, {useContext} from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Avatar, Chip, makeStyles, Tooltip} from '@material-ui/core';
import {useIntl} from 'react-intl';

import TableRow from '@material-ui/core/TableRow';

import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';

import {GetAllTradeHistoryList_ethereum_dexTrades} from 'services/graphql/bitquery/history/__generated__/GetAllTradeHistoryList';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import ExchangeLogo from 'shared/components/ExchangeLogo';
import {AppContext} from '@crema';

import {ETHERSCAN_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';

interface TableItemProps {
  row: GetAllTradeHistoryList_ethereum_dexTrades;
  networkName: EthereumNetwork;
}

const TableItem: React.FC<TableItemProps> = ({row, networkName}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    borderBottomClass: {
      borderBottom: '0 none',
    },
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
  }));

  const classes = useStyles();

  const {locale} = useContext<AppContextPropsType>(AppContext);
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const formatter = new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: 'USD',
  });
  const {messages} = useIntl();

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='center' className={classes.tableCell}>
        {row.exchange && <ExchangeLogo exchange={row.exchange.fullName} />}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.sellAmount?.toFixed(4)} {row.sellCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.buyAmount?.toFixed(4)} {row.buyCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {formatter.format(row.tradeAmountInUsd || 0)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {timestamp}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {/* <Link
          to={`/${networkName}/history/order/view/${row.transaction?.hash}`}
          component={RouterLink}>
          <SearchIcon />
       </Link>*/}
        <Tooltip title={messages['app.viewTx']} placement='top'>
          <a
            href={`${ETHERSCAN_API_URL_FROM_NETWORK(networkName)}/tx/${
              row.transaction?.hash
            }`}
            target='_blank'
            rel='noopener noreferrer'>
            {networkName === EthereumNetwork.ethereum ? (
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
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
