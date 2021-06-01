import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import {Chip, Link, makeStyles} from '@material-ui/core';

import TableRow from '@material-ui/core/TableRow';

import {CremaTheme} from 'types/AppContextPropsType';

import SearchIcon from '@material-ui/icons/Search';
import {useWeb3} from 'hooks/useWeb3';
import {truncateAddress} from 'utils';
import {EthereumNetwork} from 'shared/constants/AppEnums';

interface TableItemProps {
  row: any;
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

  return (
    <TableRow key={row.transaction?.hash} className={classes.borderBottomClass}>
      <TableCell align='left' className={classes.tableCell}>
        {truncateAddress(row.order.maker)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.order.makerAmount}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {truncateAddress(row.order.taker)}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {row.order.takerAmount}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {new Date(row.order.expiry * 1000).toUTCString()}
      </TableCell>

      <TableCell align='left' className={classes.tableCell}>
        {/* <Link href={`/${networkName}/history/order/view/${row.metaData.orderHash}`}>
          <SearchIcon />
        </Link> */}
      </TableCell>
    </TableRow>
  );
};

export default TableItem;
