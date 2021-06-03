import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Chip, Link, makeStyles} from '@material-ui/core';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import SearchIcon from '@material-ui/icons/Search';
import {useWeb3} from 'hooks/useWeb3';
import {truncateAddress} from 'utils';
import {IOrderList} from 'types/app';
import {EthereumNetwork} from 'shared/constants/AppEnums';

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

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        {row.exchange?.fullName}
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
        {row.quotePrice?.toFixed(4)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        ${row.tradeAmountIsUsd?.toFixed(2)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.block?.timestamp?.time}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        <Link
          href={`/${networkName}/history/order/view/${row.transaction?.hash}`}>
          <SearchIcon />
        </Link>
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
