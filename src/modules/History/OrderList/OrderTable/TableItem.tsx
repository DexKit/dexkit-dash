import React, { useContext } from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Chip, Link, makeStyles} from '@material-ui/core';

import {Link as RouterLink} from 'react-router-dom';

import TableRow from '@material-ui/core/TableRow';

import AppContextPropsType, {CremaTheme} from 'types/AppContextPropsType';

import SearchIcon from '@material-ui/icons/Search';
import {IOrderList} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import ExchangeLogo from 'shared/components/ExchangeLogo';
import { AppContext } from '@crema';

interface TableItemProps {
  row: IOrderList;
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

  const getPaymentTypeColor = () => {
    switch (row.side) {
      case 'SELL': {
        return '#F84E4E';
      }
      case 'BUY': {
        return '#00b400';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  const {
    locale
  } = useContext<AppContextPropsType>(AppContext);
  const timestamp = row.block?.timestamp?.time
    ? new Date(row.block?.timestamp?.time).toLocaleString()
    : row.block?.timestamp?.time;

  const formatter = new Intl.NumberFormat( locale.locale, { style: 'currency', currency: 'USD' })
  const priceUSD = row?.baseAmount ? formatter.format((row?.tradeAmountIsUsd || 0) / row?.baseAmount) : '-';


  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='center' className={classes.tableCell}>
        {row.exchange && <ExchangeLogo exchange={row.exchange.fullName} />}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Chip
          style={{backgroundColor: getPaymentTypeColor(), color: 'white'}}
          label={row.side}
        />
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.baseCurrency?.symbol}/{row.quoteCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.baseAmount?.toFixed(4)} {row.baseCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.quoteAmount?.toFixed(4)} {row.quoteCurrency?.symbol}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {priceUSD}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {formatter.format(row.tradeAmountIsUsd || 0)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {timestamp}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Link
          to={`/${networkName}/history/order/view/${row.transaction?.hash}`}
          component={RouterLink}>
          <SearchIcon />
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;